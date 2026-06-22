'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/admin'

export async function createJornada(
  seasonId: string,
  jornadaNumber: number,
  name: string,
  deadline: string
) {
  try {
    await requireAdmin()

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('jornadas')
      .insert({
        season_id: seasonId,
        jornada_number: jornadaNumber,
        name,
        deadline: new Date(deadline).toISOString(),
        status: 'upcoming',
      })
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    return { data, error: null }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to create jornada' }
  }
}

export async function getJornadas(seasonId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('jornadas')
      .select('*')
      .eq('season_id', seasonId)
      .order('jornada_number', { ascending: true })

    if (error) {
      return { error: error.message }
    }

    return { data, error: null }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to fetch jornadas' }
  }
}

export async function getJornadaById(jornadaId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('jornadas')
      .select('*')
      .eq('id', jornadaId)
      .single()

    if (error) {
      return { error: error.message }
    }

    return { data, error: null }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to fetch jornada' }
  }
}

export async function getCurrentJornada(seasonId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('jornadas')
      .select('*')
      .eq('season_id', seasonId)
      .eq('status', 'open')
      .order('jornada_number', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found, which is fine
      return { error: error.message }
    }

    return { data: error?.code === 'PGRST116' ? null : data, error: null }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to fetch current jornada' }
  }
}

export async function updateJornadaStatus(jornadaId: string, status: 'upcoming' | 'open' | 'locked' | 'results_entered') {
  try {
    await requireAdmin()

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('jornadas')
      .update({ status })
      .eq('id', jornadaId)
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    return { data, error: null }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to update jornada' }
  }
}
