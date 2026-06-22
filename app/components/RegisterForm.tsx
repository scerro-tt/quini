'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signUp } from '@/lib/auth'
import { Loader2, AlertCircle } from 'lucide-react'

export function RegisterForm() {
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setLoading(false)
      return
    }

    const result = await signUp(email, password, nickname)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  const passwordStrength = password.length > 0 ? Math.min(Math.ceil(password.length / 4), 3) : 0

  return (
    <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center p-4">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-[rgba(250,85,30,0.08)] blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[250px] h-[250px] rounded-full bg-[rgba(250,210,75,0.06)] blur-[80px] pointer-events-none" />

      <div className="w-full max-w-[420px] relative z-10">
        {/* Header */}
        <div className="text-center mb-[48px]">
          <div className="flex items-center justify-center gap-[11px] mb-[12px]">
            <div className="w-[40px] h-[40px] rounded-[4px] bg-[#FA551E] flex items-center justify-center text-white font-[Manrope] font-black text-[24px]">
              D
            </div>
            <span className="font-[Manrope] font-bold text-[24px] text-[#121827] tracking-[-0.01em]">
              Peña la Desilusión
            </span>
          </div>
          <p className="font-[Inter] text-[16px] text-[#5A6378] mt-[8px]">
            Únete al grupo
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border-[2px] border-[#121827] rounded-[6px] p-[32px] shadow-[0_24px_60px_-28px_rgba(0,0,0,0.1)]">
          <form onSubmit={handleSubmit} className="space-y-[20px]">
            {/* Email */}
            <div className="flex flex-col gap-[8px]">
              <label className="font-[Inter] font-semibold text-[13px] text-[#121827] tracking-[0.04em] uppercase">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@ejemplo.com"
                className="w-full px-[16px] py-[12px] font-[Inter] text-[15px] border-[2px] border-[#121827] rounded-[4px] text-[#121827] placeholder-[#7B8296] focus:outline-none focus:ring-[2px] focus:ring-[#FA551E] focus:ring-offset-[2px] transition-all"
                required
              />
            </div>

            {/* Nickname */}
            <div className="flex flex-col gap-[8px]">
              <label className="font-[Inter] font-semibold text-[13px] text-[#121827] tracking-[0.04em] uppercase">
                Apodo (público)
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Tu apodo en el ranking"
                className="w-full px-[16px] py-[12px] font-[Inter] text-[15px] border-[2px] border-[#121827] rounded-[4px] text-[#121827] placeholder-[#7B8296] focus:outline-none focus:ring-[2px] focus:ring-[#FA551E] focus:ring-offset-[2px] transition-all"
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-[8px]">
              <label className="font-[Inter] font-semibold text-[13px] text-[#121827] tracking-[0.04em] uppercase">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-[16px] py-[12px] font-[Inter] text-[15px] border-[2px] border-[#121827] rounded-[4px] text-[#121827] placeholder-[#7B8296] focus:outline-none focus:ring-[2px] focus:ring-[#FA551E] focus:ring-offset-[2px] transition-all"
                required
              />
              {password.length > 0 && (
                <div className="flex gap-[6px] mt-[8px]">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`h-[4px] flex-1 rounded-full transition-colors ${
                        i < passwordStrength ? 'bg-[#FA551E]' : 'bg-[#E8EAEF]'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-[12px] p-[16px] bg-[#FEE8E1] border-[2px] border-[#FA551E] rounded-[4px]">
                <AlertCircle size={20} className="text-[#FA551E] flex-shrink-0 mt-[2px]" />
                <p className="font-[Inter] text-[14px] text-[#C2390A]">{error}</p>
              </div>
            )}

            {/* Password Requirements */}
            {password.length > 0 && password.length < 6 && (
              <div className="flex items-center gap-[8px] p-[12px] bg-[rgba(250,210,75,0.10)] border border-[rgba(250,210,75,0.30)] rounded-[4px]">
                <div className="w-[4px] h-[4px] rounded-full bg-[#FAD24B]" />
                <p className="font-[Inter] text-[13px] text-[#5A6378]">
                  {6 - password.length} caracteres más para continuar
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || password.length < 6}
              className="w-full mt-[28px] px-[24px] py-[14px] bg-[#FA551E] hover:bg-[#E2440F] disabled:bg-[#C2390A] text-white font-[Inter] font-semibold text-[15px] rounded-[4px] disabled:cursor-not-allowed transition-colors duration-[140ms] flex items-center justify-center gap-[8px]"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-[28px] border-t border-[#E8EAEF]" />

          {/* Login Link */}
          <div className="text-center">
            <p className="font-[Inter] text-[14px] text-[#5A6378]">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-[#FA551E] hover:text-[#E2440F] font-semibold no-underline transition-colors">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>

        {/* Footer hint */}
        <p className="text-center mt-[24px] font-[Inter] text-[12px] text-[#7B8296]">
          Peña la Desilusión · una quiniela entre amigos
        </p>
      </div>
    </div>
  )
}
