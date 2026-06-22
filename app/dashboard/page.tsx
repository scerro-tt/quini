'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Profile {
  id: string
  nickname: string
  avatar: string
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
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

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(data)
    } catch (err) {
      console.error('Error loading profile:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <nav className="bg-green-700 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">La Quini de los Colegas</h1>
          <Link href="/profile" className="hover:bg-green-600 px-4 py-2 rounded">
            {profile?.nickname}
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-green-700 mb-4">
            Bienvenido, {profile?.nickname}!
          </h2>
          <p className="text-gray-600 mb-6">
            La app está en construcción. En breve podrás:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Subir boletos semanales</li>
            <li>Ver el ranking en vivo</li>
            <li>Registrar resultados y premios</li>
            <li>Ganar o perder la camiseta</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
