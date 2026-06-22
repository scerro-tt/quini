'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from '@/lib/auth'
import { Loader2, AlertCircle } from 'lucide-react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn(email, password)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center p-4">
      {/* Decorative blob */}
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
            Inicia sesión en tu cuenta
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

            {/* Password */}
            <div className="flex flex-col gap-[8px]">
              <label className="font-[Inter] font-semibold text-[13px] text-[#121827] tracking-[0.04em] uppercase">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-[16px] py-[12px] font-[Inter] text-[15px] border-[2px] border-[#121827] rounded-[4px] text-[#121827] placeholder-[#7B8296] focus:outline-none focus:ring-[2px] focus:ring-[#FA551E] focus:ring-offset-[2px] transition-all"
                required
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-[12px] p-[16px] bg-[#FEE8E1] border-[2px] border-[#FA551E] rounded-[4px]">
                <AlertCircle size={20} className="text-[#FA551E] flex-shrink-0 mt-[2px]" />
                <p className="font-[Inter] text-[14px] text-[#C2390A]">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-[28px] px-[24px] py-[14px] bg-[#FA551E] hover:bg-[#E2440F] text-white font-[Inter] font-semibold text-[15px] rounded-[4px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-[140ms] flex items-center justify-center gap-[8px]"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-[28px] border-t border-[#E8EAEF]" />

          {/* Register Link */}
          <div className="text-center">
            <p className="font-[Inter] text-[14px] text-[#5A6378]">
              ¿No tienes cuenta?{' '}
              <Link href="/register" className="text-[#FA551E] hover:text-[#E2440F] font-semibold no-underline transition-colors">
                Regístrate aquí
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
