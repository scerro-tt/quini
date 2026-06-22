'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'

export async function isUserAdmin(): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    if (!user) return false

    const supabase = await createClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    return profile?.is_admin ?? false
  } catch {
    return false
  }
}

export async function requireAdmin() {
  const isAdmin = await isUserAdmin()
  if (!isAdmin) {
    throw new Error('Admin access required')
  }
}
