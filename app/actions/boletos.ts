'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'

export async function uploadBoleto(jornadaId: string, imageUrl: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { error: 'Not authenticated' }
    }

    const supabase = await createClient()

    // Check if user already has a boleto for this jornada
    const { data: existing } = await supabase
      .from('boletos')
      .select('id')
      .eq('jornada_id', jornadaId)
      .eq('user_id', user.id)
      .single()

    if (existing) {
      // Update existing boleto
      const { data, error } = await supabase
        .from('boletos')
        .update({
          image_url: imageUrl,
          processing_status: 'pending',
          processed_at: null,
          error_message: null,
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) {
        return { error: error.message }
      }

      return { data, isNew: false }
    } else {
      // Create new boleto
      const { data, error } = await supabase
        .from('boletos')
        .insert({
          jornada_id: jornadaId,
          user_id: user.id,
          image_url: imageUrl,
          processing_status: 'pending',
        })
        .select()
        .single()

      if (error) {
        return { error: error.message }
      }

      return { data, isNew: true }
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to upload boleto' }
  }
}

export async function processBoletoWithVision(boletoId: string, imageBase64: string) {
  try {
    const supabase = await createClient()

    // Update status to processing
    await supabase
      .from('boletos')
      .update({ processing_status: 'processing' })
      .eq('id', boletoId)

    // Call Claude Vision API
    const response = await fetch('/api/claude-vision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64,
        boletoId,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      // Update with error
      await supabase
        .from('boletos')
        .update({
          processing_status: 'failed',
          error_message: result.error || 'Vision API failed',
        })
        .eq('id', boletoId)

      return { error: result.error || 'Vision API failed' }
    }

    // Update boleto with predictions
    const { data, error } = await supabase
      .from('boletos')
      .update({
        predictions: result.predictions,
        processing_status: 'completed',
        processed_at: new Date().toISOString(),
      })
      .eq('id', boletoId)
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    return { data, predictions: result.predictions }
  } catch (err) {
    const supabase = await createClient()
    await supabase
      .from('boletos')
      .update({
        processing_status: 'failed',
        error_message: err instanceof Error ? err.message : 'Unknown error',
      })
      .eq('id', boletoId)

    return { error: err instanceof Error ? err.message : 'Failed to process boleto' }
  }
}

export async function getBoletosByJornada(jornadaId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('boletos')
      .select(`
        id,
        user_id,
        image_url,
        predictions,
        processing_status,
        uploaded_at,
        profiles (nickname, avatar)
      `)
      .eq('jornada_id', jornadaId)
      .order('uploaded_at', { ascending: false })

    if (error) {
      return { error: error.message }
    }

    return { data, error: null }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to fetch boletos' }
  }
}

export async function getUserBoletoForJornada(jornadaId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { error: 'Not authenticated' }
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('boletos')
      .select('*')
      .eq('jornada_id', jornadaId)
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found
      return { error: error.message }
    }

    return { data: error?.code === 'PGRST116' ? null : data, error: null }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to fetch boleto' }
  }
}

export async function updateBoletoNotes(boletoId: string, notes: Record<number, string>) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { error: 'Not authenticated' }
    }

    const supabase = await createClient()

    // Verify user owns this boleto
    const { data: boleto } = await supabase
      .from('boletos')
      .select('user_id, predictions')
      .eq('id', boletoId)
      .single()

    if (!boleto || boleto.user_id !== user.id) {
      return { error: 'Unauthorized' }
    }

    // Update predictions with manual notes
    const updatedPredictions = {
      ...boleto.predictions,
      manual_notes: notes,
    }

    const { data, error } = await supabase
      .from('boletos')
      .update({ predictions: updatedPredictions })
      .eq('id', boletoId)
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    return { data, error: null }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to update boleto' }
  }
}
