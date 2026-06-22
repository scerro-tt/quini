import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

interface VisionRequest {
  imageBase64: string
  boletoId?: string
}

interface PredictionMatch {
  match_number: number
  match_description: string
  prediction: '1' | 'X' | '2' | 'TBD'
  confidence: number
  raw_text?: string
}

interface VisionResponse {
  predictions: {
    matches: PredictionMatch[]
    raw_ocr_text: string
    processing_time_ms: number
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<VisionResponse | { error: string }>> {
  try {
    const body: VisionRequest = await request.json()
    const { imageBase64 } = body

    if (!imageBase64) {
      return NextResponse.json({ error: 'Missing imageBase64' }, { status: 400 })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 })
    }

    const startTime = Date.now()

    // Call Claude Vision API
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: `Analiza esta imagen de un boleto de quiniela (boleto de apuestas deportivas).

Extrae todas las predicciones numeradas del boleto. Para cada predicción, identifica:
1. El número de partido/match
2. Una descripción breve del partido (equipos si es visible)
3. La predicción marcada (1, X, o 2 para victoria local, empate, o victoria visitante)
4. Tu confianza en la lectura (0.0 a 1.0)

Responde en JSON con este formato exacto:
{
  "matches": [
    {"match_number": 1, "match_description": "Equipo A vs Equipo B", "prediction": "1", "confidence": 0.95},
    ...
  ],
  "raw_text": "[todo el texto que pudiste leer del boleto]"
}

Si no puedes leer algo claramente, usa "TBD" (To Be Determined) como predicción y confianza baja (0.1-0.3).
Sé exhaustivo: lee TODOS los números y predicciones del boleto.`,
            },
          ],
        },
      ],
    })

    const processingTime = Date.now() - startTime

    // Extract text response
    const textContent = response.content.find((block) => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      return NextResponse.json({ error: 'No text response from Claude' }, { status: 500 })
    }

    // Parse Claude's JSON response
    let predictions: PredictionMatch[] = []
    let rawText = ''

    try {
      // Extract JSON from response (Claude might include markdown formatting)
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const parsedData = JSON.parse(jsonMatch[0])
      predictions = parsedData.matches || []
      rawText = parsedData.raw_text || textContent.text
    } catch (parseErr) {
      // Fallback: return raw text with TBD predictions
      rawText = textContent.text
      predictions = [
        {
          match_number: 1,
          match_description: 'Unable to parse',
          prediction: 'TBD',
          confidence: 0.0,
          raw_text: rawText,
        },
      ]
    }

    return NextResponse.json({
      predictions: {
        matches: predictions,
        raw_ocr_text: rawText,
        processing_time_ms: processingTime,
      },
    })
  } catch (error: unknown) {
    console.error('Vision API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Vision processing failed' },
      { status: 500 }
    )
  }
}
