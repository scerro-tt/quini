'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-green-700 mb-4">
            La Quini de los Colegas
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Seguimiento semanal de la Quiniela en grupo
          </p>
          <p className="text-gray-500 mb-12">
            Ranking automático, premios en euros y... la camiseta del perdedor
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold transition"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="px-8 py-3 bg-white text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-50 font-bold transition"
            >
              Registrarse
            </Link>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-green-700 mb-2">📊 Ranking</h3>
            <p className="text-gray-600">
              Clasifica a tus colegas según premios y puntería. Gana dinero real o acumula
              puntos virtuales.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-green-700 mb-2">📸 Boletos</h3>
            <p className="text-gray-600">
              Sube la foto del boleto. Claude lo lee automáticamente y tú lo confirmas.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-green-700 mb-2">👕 Camiseta</h3>
            <p className="text-gray-600">
              El que acaba último se lleva la camiseta de la temporada. Que pierda el otro.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
