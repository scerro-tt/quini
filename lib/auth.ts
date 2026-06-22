'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signUp(
  email: string,
  password: string,
  nickname: string
) {
  const supabase = await createClient()

  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (signUpError) {
    return { error: signUpError.message }
  }

  if (!data.user) {
    return { error: 'Failed to create user' }
  }

  // Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: data.user.id,
      nickname,
      avatar: 'default',
      created_at: new Date().toISOString(),
    })

  if (profileError) {
    return { error: profileError.message }
  }

  redirect('/profile')
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  return data.user
}
