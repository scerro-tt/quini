'use client'

import { useState, useRef } from 'react'
import { uploadBoleto, processBoletoWithVision } from '@/app/actions/boletos'
import { Upload, Loader2 } from 'lucide-react'

interface BoletoUploadProps {
  jornadaId: string
  onSuccess: (boleto: any) => void
}

export function BoletoUpload({ jornadaId, onSuccess }: BoletoUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      // Convert to base64 for API
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64 = (e.target?.result as string).split(',')[1]

        // Upload to Supabase Storage
        const supabase = (await import('@/lib/supabase/client')).createClient()
        const filename = `${jornadaId}/${Date.now()}-${file.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('boletos')
          .upload(filename, file, { upsert: false })

        if (uploadError) {
          setError('Failed to upload image: ' + uploadError.message)
          setIsLoading(false)
          return
        }

        const { data: urlData } = supabase.storage
          .from('boletos')
          .getPublicUrl(filename)
        const imageUrl = urlData.publicUrl

        // Save boleto record
        const uploadResult = await uploadBoleto(jornadaId, imageUrl)
        if (uploadResult.error) {
          setError(uploadResult.error)
          setIsLoading(false)
          return
        }

        const boletoId = uploadResult.data.id

        // Process with Claude Vision
        const visionResult = await processBoletoWithVision(boletoId, base64)
        if (visionResult.error) {
          setError(visionResult.error)
          setIsLoading(false)
          return
        }

        onSuccess(visionResult.data)
        setIsLoading(false)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      setIsLoading(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  return (
    <div className="w-full">
      <div
        onDragOver={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && handleFile(e.target.files[0])}
          className="hidden"
        />

        <div className="space-y-4">
          {isLoading ? (
            <>
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-500" />
              <p className="text-sm text-gray-600">Processing your boleto with Claude Vision...</p>
            </>
          ) : (
            <>
              <Upload className="mx-auto h-10 w-10 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Drag and drop your boleto image here
                </p>
                <p className="text-xs text-gray-500 mt-1">or</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-block mt-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600"
                >
                  Select File
                </button>
              </div>
              <p className="text-xs text-gray-500">JPG, PNG or GIF (max 5MB)</p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  )
}
