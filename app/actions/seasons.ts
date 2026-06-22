'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import { requireAdmin } from '@/lib/auth/admin'

export async function createSeason(
  year: number,
  name: string,
  startDate: string,
  endDate: string
) {
  try {
    await requireAdmin()

    const user = await getCurrentUser()
    if (!user) {
      return { error: 'Not authenticated' }
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('seasons')
      .insert({
        year,
        name,
        start_date: new Date(startDate).toISOString(),
        end_date: new Date(endDate).toISOString(),
        created_by: user.id,
        status: 'upcoming',
      })
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    return { data, error: null }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to create season' }
  }
}

export async function getSeasons() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('seasons')
      .select('*')
      .order('year', { ascending: false })

    if (error) {
      return { error: error.message }
    }

    return { data, error: null }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to fetch seasons' }
  }
}

export async function getSeasonById(seasonId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('seasons')
      .select('*')
      .eq('id', seasonId)
      .single()

    if (error) {
      return { error: error.message }
    }

    return { data, error: null }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to fetch season' }
  }
}

export async function updateSeasonStatus(seasonId: string, status: 'upcoming' | 'active' | 'completed') {
  try {
    await requireAdmin()

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('seasons')
      .update({ status })
      .eq('id', seasonId)
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    return { data, error: null }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to update season' }
  }
}
