'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { signOut } from '@/lib/auth'
import { Loader2, AlertCircle, Check, LogOut, Edit2 } from 'lucide-react'

interface Profile {
  id: string
  nickname: string
  avatar: string
  created_at: string
}

export function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
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

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (fetchError) throw fetchError
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
    if (!profile || !nickname.trim()) return
    setError('')
    setSaveLoading(true)

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ nickname: nickname.trim() })
        .eq('id', profile.id)

      if (updateError) throw updateError
      setProfile({ ...profile, nickname: nickname.trim() })
      setEditing(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error('Error updating profile:', err)
      setError(err instanceof Error ? err.message : 'Error updating profile')
    } finally {
      setSaveLoading(false)
    }
  }

  async function handleSignOut() {
    await signOut()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="text-[#FA551E] animate-spin mx-auto mb-4" />
          <p className="font-[Inter] text-[15px] text-[#5A6378]">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center p-4">
        <div className="bg-white border-[2px] border-[#121827] rounded-[6px] p-[32px] max-w-[420px]">
          <AlertCircle size={32} className="text-[#FA551E] mx-auto mb-4" />
          <p className="font-[Inter] text-[15px] text-center text-[#121827]">
            Perfil no encontrado
          </p>
        </div>
      </div>
    )
  }

  const avatarInitial = profile.nickname.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-[#F7F5F2] p-4">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-[rgba(250,85,30,0.08)] blur-[80px] pointer-events-none" />

      <div className="max-w-[420px] mx-auto mt-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-[32px]">
          <div className="flex items-center justify-center gap-[11px] mb-[12px]">
            <div className="w-[40px] h-[40px] rounded-[4px] bg-[#FA551E] flex items-center justify-center text-white font-[Manrope] font-black text-[24px]">
              D
            </div>
            <span className="font-[Manrope] font-bold text-[24px] text-[#121827] tracking-[-0.01em]">
              Peña la Desilusión
            </span>
          </div>
          <p className="font-[Inter] text-[16px] text-[#5A6378] mt-[8px]">
            Mi Perfil
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border-[2px] border-[#121827] rounded-[6px] p-[32px] shadow-[0_24px_60px_-28px_rgba(0,0,0,0.1)]">
          {/* Avatar */}
          <div className="text-center mb-[32px]">
            <div className="w-[80px] h-[80px] rounded-full bg-[#FBEDE7] border-[2px] border-[#FA551E] flex items-center justify-center mx-auto">
              <span className="font-[Manrope] font-black text-[36px] text-[#FA551E]">
                {avatarInitial}
              </span>
            </div>
          </div>

          {/* Success Message */}
          {saveSuccess && (
            <div className="flex items-center gap-[12px] p-[16px] bg-[rgba(30,158,106,0.12)] border-[2px] border-[#157A4F] rounded-[4px] mb-[24px]">
              <Check size={20} className="text-[#157A4F] flex-shrink-0" />
              <p className="font-[Inter] text-[14px] text-[#157A4F]">Perfil actualizado correctamente</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-[12px] p-[16px] bg-[#FEE8E1] border-[2px] border-[#FA551E] rounded-[4px] mb-[24px]">
              <AlertCircle size={20} className="text-[#FA551E] flex-shrink-0 mt-[2px]" />
              <p className="font-[Inter] text-[14px] text-[#C2390A]">{error}</p>
            </div>
          )}

          {/* Nickname Field */}
          <div className="mb-[28px]">
            <label className="font-[Inter] font-semibold text-[13px] text-[#121827] tracking-[0.04em] uppercase block mb-[8px]">
              Apodo (público)
            </label>
            {editing ? (
              <div className="space-y-[12px]">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={50}
                  className="w-full px-[16px] py-[12px] font-[Inter] text-[15px] border-[2px] border-[#121827] rounded-[4px] text-[#121827] placeholder-[#7B8296] focus:outline-none focus:ring-[2px] focus:ring-[#FA551E] focus:ring-offset-[2px] transition-all"
                  autoFocus
                />
                <div className="flex gap-[8px]">
                  <button
                    onClick={handleUpdateNickname}
                    disabled={saveLoading || !nickname.trim()}
                    className="flex-1 px-[16px] py-[12px] bg-[#FA551E] hover:bg-[#E2440F] text-white font-[Inter] font-semibold text-[14px] rounded-[4px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-[140ms] flex items-center justify-center gap-[8px]"
                  >
                    {saveLoading && <Loader2 size={16} className="animate-spin" />}
                    Guardar
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false)
                      setNickname(profile.nickname)
                      setError('')
                    }}
                    className="flex-1 px-[16px] py-[12px] bg-[#E8EAEF] hover:bg-[#D6D9E0] text-[#121827] font-[Inter] font-semibold text-[14px] rounded-[4px] transition-colors duration-[140ms]"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between px-[16px] py-[12px] bg-[#F7F5F2] border-[2px] border-[#E8EAEF] rounded-[4px]">
                <span className="font-[Inter] text-[15px] font-semibold text-[#121827]">
                  {profile.nickname}
                </span>
                <button
                  onClick={() => setEditing(true)}
                  className="p-[8px] text-[#FA551E] hover:bg-[rgba(250,85,30,0.10)] rounded-[4px] transition-colors"
                  title="Editar apodo"
                >
                  <Edit2 size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Email Display */}
          <div className="mb-[28px]">
            <label className="font-[Inter] font-semibold text-[13px] text-[#121827] tracking-[0.04em] uppercase block mb-[8px]">
              Email
            </label>
            <div className="px-[16px] py-[12px] bg-[#F7F5F2] border-[2px] border-[#E8EAEF] rounded-[4px]">
              <span className="font-[Inter] text-[15px] text-[#5A6378]">
                {profile.id}
              </span>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="w-full px-[24px] py-[14px] bg-[#121827] hover:bg-[#0A0F1A] text-white font-[Inter] font-semibold text-[15px] rounded-[4px] transition-colors duration-[140ms] flex items-center justify-center gap-[8px]"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>

        {/* Footer hint */}
        <p className="text-center mt-[24px] font-[Inter] text-[12px] text-[#7B8296]">
          Usuario desde {new Date(profile.created_at).toLocaleDateString('es-ES')}
        </p>
      </div>
    </div>
  )
}
