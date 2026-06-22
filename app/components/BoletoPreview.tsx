'use client'

import Image from 'next/image'
import { useState } from 'react'
import { updateBoletoNotes } from '@/app/actions/boletos'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

interface Prediction {
  match_number: number
  match_description: string
  prediction: '1' | 'X' | '2' | 'TBD'
  confidence: number
}

interface BoletoPreviewProps {
  boleto: {
    id: string
    image_url: string
    processing_status: string
    predictions?: {
      matches: Prediction[]
      raw_ocr_text: string
    }
  }
}

export function BoletoPreview({ boleto }: BoletoPreviewProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [corrections, setCorrections] = useState<Record<number, string>>({})

  const predictions = boleto.predictions?.matches || []
  const hasLowConfidence = predictions.some((p) => p.confidence < 0.7 && p.prediction !== 'TBD')
  const hasUncertain = predictions.some((p) => p.prediction === 'TBD')

  const handleSave = async () => {
    setIsSaving(true)
    setSaveError(null)

    const result = await updateBoletoNotes(boleto.id, corrections)
    if (result.error) {
      setSaveError(result.error)
    }

    setIsSaving(false)
  }

  return (
    <div className="space-y-6">
      {/* Image Preview */}
      <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
        <Image src={boleto.image_url} alt="Boleto" fill className="object-contain" />
      </div>

      {/* Status Alerts */}
      <div className="space-y-2">
        {boleto.processing_status === 'failed' && (
          <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">Failed to process image. Please try again.</p>
          </div>
        )}

        {hasLowConfidence && (
          <div className="flex items-start gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-700">
              Some predictions have low confidence. Please review and correct if needed.
            </p>
          </div>
        )}

        {hasUncertain && (
          <div className="flex items-start gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              Some predictions couldn't be read clearly (marked as TBD). Please correct them.
            </p>
          </div>
        )}

        {!hasLowConfidence && !hasUncertain && (
          <div className="flex items-start gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700">
              All predictions read successfully with high confidence.
            </p>
          </div>
        )}
      </div>

      {/* Predictions Table */}
      {predictions.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Match</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Prediction</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Confidence</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Correction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {predictions.map((pred) => (
                <tr key={pred.match_number} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {pred.match_number}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{pred.match_description}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-3 py-1 rounded font-medium ${
                        pred.prediction === 'TBD'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {pred.prediction === '1' ? 'Local' : pred.prediction === 'X' ? 'Empate' : pred.prediction === '2' ? 'Visitante' : `"${pred.prediction}"`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-colors ${
                            pred.confidence >= 0.8
                              ? 'bg-green-500'
                              : pred.confidence >= 0.6
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                          }`}
                          style={{ width: `${pred.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-10">
                        {(pred.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <select
                      value={corrections[pred.match_number] || ''}
                      onChange={(e) =>
                        setCorrections({
                          ...corrections,
                          [pred.match_number]: e.target.value,
                        })
                      }
                      className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">—</option>
                      <option value="1">Local</option>
                      <option value="X">Empate</option>
                      <option value="2">Visitante</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Raw OCR Text (for debugging) */}
      {boleto.predictions?.raw_ocr_text && (
        <details className="bg-gray-50 rounded-lg p-4">
          <summary className="text-sm font-medium text-gray-700 cursor-pointer">
            Raw OCR Text (Debug)
          </summary>
          <pre className="mt-2 text-xs text-gray-600 whitespace-pre-wrap overflow-x-auto">
            {boleto.predictions.raw_ocr_text}
          </pre>
        </details>
      )}

      {/* Save Button */}
      {Object.keys(corrections).length > 0 && (
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
        >
          {isSaving ? 'Saving...' : 'Save Corrections'}
        </button>
      )}

      {saveError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{saveError}</p>
        </div>
      )}
    </div>
  )
}
