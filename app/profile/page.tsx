'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { signOut } from '@/lib/auth'

interface Profile {
  id: string
  nickname: string
  avatar: string
  created_at: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setProfile(data)
      setNickname(data.nickname)
    } catch (err) {
      console.error('Error loading profile:', err)
      setError('Error loading profile')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateNickname() {
    if (!profile) return
    setError('')

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ nickname })
        .eq('id', profile.id)

      if (error) throw error
      setProfile({ ...profile, nickname })
      setEditing(false)
    } catch (err) {
      console.error('Error updating profile:', err)
      setError('Error updating profile')
    }
  }

  async function handleSignOut() {
    await signOut()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <p className="text-gray-600">Perfil no encontrado</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-4">
      <div className="max-w-md mx-auto mt-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-green-700 mb-6">
            Mi Perfil
          </h1>

          <div className="space-y-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">⚽</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nickname
              </label>
              {editing ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleUpdateNickname}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false)
                      setNickname(profile.nickname)
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold text-gray-900">
                    {profile.nickname}
                  </p>
                  <button
                    onClick={() => setEditing(true)}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Editar
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              onClick={handleSignOut}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
