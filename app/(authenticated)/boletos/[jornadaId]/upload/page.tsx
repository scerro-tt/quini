'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { BoletoUpload } from '@/app/components/BoletoUpload'
import { BoletoPreview } from '@/app/components/BoletoPreview'
import { getJornadaById } from '@/app/actions/jornadas'
import { Loader2 } from 'lucide-react'

export default function BoletoUploadPage() {
  const router = useRouter()
  const params = useParams()
  const jornadaId = params.jornadaId as string

  const [jornada, setJornada] = useState<any>(null)
  const [boleto, setBoleto] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadJornada = async () => {
      const result = await getJornadaById(jornadaId)
      if (result.error) {
        setError(result.error)
      } else {
        setJornada(result.data)
      }
      setLoading(false)
    }
    loadJornada()
  }, [jornadaId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error || !jornada) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error || 'Jornada not found'}</p>
        </div>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 text-blue-500 hover:text-blue-600"
        >
          Go back
        </button>
      </div>
    )
  }

  // Check if jornada is still open for uploads
  const deadline = new Date(jornada.deadline)
  const isOpen = jornada.status === 'open' && deadline > new Date()

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{jornada.name}</h1>
        <p className="text-gray-600 mt-2">
          Upload your boleto image and Claude Vision will extract your predictions
        </p>
      </div>

      {!isOpen && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700">
            This jornada is no longer open for uploads. Deadline was{' '}
            {deadline.toLocaleDateString()} at {deadline.toLocaleTimeString()}
          </p>
        </div>
      )}

      {boleto ? (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Boleto</h2>
          <BoletoPreview boleto={boleto} />
          <button
            onClick={() => setBoleto(null)}
            className="mt-6 px-4 py-2 text-blue-500 hover:text-blue-600"
          >
            Upload Another Image
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Your Boleto</h2>
          <BoletoUpload
            jornadaId={jornadaId}
            onSuccess={(newBoleto) => {
              setBoleto(newBoleto)
            }}
          />
        </div>
      )}
    </div>
  )
}
