'use client'

import Link from 'next/link'
import { ArrowRight, Trophy, Ticket, Upload, ScanLine, Calculator, TrendingDown, Image as ImageIcon, Scale, Flame, Radio, Check, Shirt } from 'lucide-react'

const STEPS = [
  { icon: Upload, title: 'Sube el boleto', desc: 'Arrastra la foto del boleto. Una por jornada, da igual quién apostó esta semana.' },
  { icon: ScanLine, title: 'Se lee solo', desc: 'La imagen se lee y saca los 14 signos más el pleno al 15. Tú solo validas si algo baila.' },
  { icon: Calculator, title: 'Se calcula la nota', desc: 'Cada acierto suma, y cada jornada pesa según lo difícil que fue de verdad.' },
  { icon: TrendingDown, title: 'Subes o bajas', desc: 'El ranking se actualiza con el cierre. Para algunos, semana tras semana, para abajo.' },
]

const FEATURES = [
  { icon: ImageIcon, title: 'Boleto por foto', desc: 'Foto y listo. Sin teclear catorce signos a mano ni discutir qué puso cada uno.' },
  { icon: Scale, title: 'Dificultad ponderada', desc: 'Cada jornada vale lo que costó. Acertar en una jornada loca cuenta más.' },
  { icon: Flame, title: 'Rachas e historial', desc: 'Tu mejor jornada, tu peor pleno y la sequía que llevas arrastrando.' },
  { icon: Radio, title: 'Resultados en directo', desc: 'Mira caer cada signo en tiempo real y cómo se te escapa el pleno al 15.' },
]

const RANKING = [
  { pos: 1, name: 'Quique', pts: 184, last: 11, streak: '+3', trend: 'up' as const },
  { pos: 2, name: 'Rubén', pts: 171, last: 9, streak: '+1', trend: 'up' as const },
  { pos: 3, name: 'Dani', pts: 158, last: 10, streak: '—', trend: 'flat' as const },
  { pos: 4, name: 'Nacho', pts: 132, last: 7, streak: '−2', trend: 'down' as const },
  { pos: 5, name: 'Chete', pts: 96, last: 4, streak: '−4', trend: 'down' as const },
]

export function Landing() {
  return (
    <div className="min-h-screen bg-[#F7F5F2]">
      {/* NAV */}
      <nav className="flex items-center justify-between px-[72px] py-[22px] border-b border-[#E8EAEF]">
        <div className="flex items-center gap-[11px]">
          <div className="w-[30px] h-[30px] rounded-[4px] bg-[#FA551E] flex items-center justify-center text-white font-black text-[17px]">D</div>
          <span className="font-[Manrope] font-bold text-[17px] text-[#121827] tracking-[-0.01em]">Peña la Desilusión</span>
        </div>
        <div className="flex items-center gap-[30px]">
          <a href="#" className="font-[Inter] text-[14px] font-medium text-[#5A6378] no-underline">Cómo funciona</a>
          <a href="#" className="font-[Inter] text-[14px] font-medium text-[#5A6378] no-underline">Ranking</a>
          <a href="#" className="font-[Inter] text-[14px] font-medium text-[#5A6378] no-underline">Premios</a>
          <Link href="/login" className="font-[Inter] text-[14px] font-semibold text-[#121827] no-underline hover:text-[#FA551E] transition-colors">
            Entrar
          </Link>
          <Link href="/register" className="px-[18px] py-[10px] bg-[#FA551E] text-white font-[Inter] font-semibold text-[14px] rounded-[4px] no-underline hover:bg-[#E2440F] transition-colors duration-[140ms]">
            Crear cuenta
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <header className="relative bg-[#FA551E] overflow-hidden">
        <div className="absolute top-[-120px] right-[-80px] w-[420px] h-[420px] rounded-full bg-[rgba(250,210,75,0.45)] blur-[8px] pointer-events-none" />
        <div className="max-w-[1136px] mx-auto px-[72px] relative grid grid-cols-[1.05fr_0.95fr] gap-[56px] items-center py-[76px] pb-[84px]">
          <div>
            <span className="inline-flex items-center gap-[8px] font-[Inter] font-semibold text-[12px] tracking-[0.06em] uppercase text-white bg-[rgba(255,255,255,0.10)] px-[12px] py-[6px] rounded-full">
              <Trophy size={14} /> temporada 25/26 · jornada 32
            </span>
            <h1 className="font-[Manrope] font-black text-[72px] leading-[1.04] tracking-[-0.02em] text-white mt-[20px]">
              La quiniela no<br />la vas a acertar.
            </h1>
            <p className="font-[Inter] text-[18px] leading-[1.6] text-[rgba(247,245,242,0.82)] mt-[22px] max-w-[460px]">
              Al menos llévala bien apuntada. Sube la foto del boleto, deja que se lea solo
              y mira cómo te coloca el ranking — ponderado por la dificultad de cada jornada,
              sin excusas de mala suerte.
            </p>
            <div className="flex gap-[14px] mt-[32px]">
              <Link href="/register" className="inline-flex items-center gap-[8px] px-[24px] py-[14px] bg-[#FA551E] text-white font-[Inter] font-semibold text-[15px] rounded-[4px] no-underline hover:bg-[#E2440F] transition-colors duration-[140ms]">
                Crear cuenta <ArrowRight size={17} />
              </Link>
              <button className="inline-flex items-center gap-[8px] px-[24px] py-[14px] bg-transparent text-white font-[Inter] font-semibold text-[15px] border border-[rgba(255,255,255,0.28)] rounded-[4px] hover:bg-[rgba(255,255,255,0.05)] transition-colors duration-[140ms]">
                Ver el ranking
              </button>
            </div>
            <div className="flex gap-[26px] mt-[36px]">
              {[['14', 'signos + pleno'], ['4', 'boletos por jornada'], ['1', 'camiseta en juego']].map(([n, l]) => (
                <div key={l}>
                  <div className="font-[Manrope] font-black text-[26px] text-white tracking-[-0.01em]">{n}</div>
                  <div className="font-[Inter] text-[12.5px] text-[rgba(247,245,242,0.62)] mt-[2px]">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* BOLETO MOCK */}
          <div className="bg-white border-[2px] border-[#121827] rounded-[6px] overflow-hidden shadow-[0_24px_60px_-28px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between px-[18px] py-[14px] border-b border-[#E8EAEF]">
              <div className="flex items-center gap-[9px]">
                <Ticket size={18} className="text-[#C2390A]" />
                <span className="font-[Manrope] font-semibold text-[15px] text-[#0A0F1A]">Boleto · jornada 32</span>
              </div>
              <span className="inline-flex items-center gap-[6px] font-[Inter] font-semibold text-[11.5px] px-[10px] py-[4px] rounded-full bg-[rgba(30,158,106,0.12)] text-[#157A4F]">
                <span className="w-[6px] h-[6px] rounded-full bg-[#1E9E6A]" />leído · 98%
              </span>
            </div>
            <div className="px-[12px] py-[8px]">
              {[
                ['Athletic', 'Sevilla', '1'], ['Betis', 'Getafe', '1'], ['Girona', 'Madrid', '2'],
                ['Osasuna', 'Valencia', 'X'], ['Celta', 'Atleti', '2'], ['Cádiz', 'Alavés', 'X'],
                ['Mallorca', 'Villarreal', '1'],
              ].map(([h, a, pick], i) => (
                <div key={i} className="grid grid-cols-[1fr_auto] items-center px-[8px] py-[8px] rounded-[6px]" style={{ borderBottom: i < 6 ? '1px solid #E8EAEF' : 'none' }}>
                  <span className="font-[Inter] text-[13px] text-[#121827]">
                    <span className="text-[#7B8296] font-mono text-[11px] mr-[8px]">{i + 1}</span>
                    {h} <span className="text-[#7B8296]">·</span> {a}
                  </span>
                  <span className="flex gap-[5px]">
                    {['1', 'X', '2'].map((s) => (
                      <span
                        key={s}
                        className={`w-[26px] h-[26px] rounded-[3px] font-mono text-[12px] font-semibold flex items-center justify-center transition-colors ${
                          s === pick
                            ? 'bg-[#FA551E] text-white'
                            : 'bg-transparent text-[#7B8296] border border-[#121827]'
                        }`}
                      >
                        {s}
                      </span>
                    ))}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between mt-[8px] px-[8px] py-[10px]">
                <span className="font-[Inter] text-[12px] text-[#7B8296]">+ 7 partidos · pleno al 15</span>
                <span className="font-[Inter] font-semibold text-[12.5px] text-[#C2390A] flex items-center gap-[5px]">
                  Validar <ArrowRight size={13} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* CÓMO FUNCIONA */}
      <section className="py-[84px]">
        <div className="max-w-[1136px] mx-auto px-[72px]">
          <p className="font-[Inter] font-semibold text-[12px] tracking-[0.10em] uppercase text-[#C2390A]">cómo funciona</p>
          <h2 className="font-[Manrope] font-black text-[38px] leading-[1.12] tracking-[-0.01em] text-[#0A0F1A] mt-[12px] max-w-[640px]">
            De la foto del boleto al ranking, sin teclear nada
          </h2>
          <div className="grid grid-cols-4 gap-[20px] mt-[44px]">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              return (
                <div key={i} className="bg-white border-[2px] border-[#121827] rounded-[6px] p-[24px] flex flex-col gap-[12px]">
                  <div className="flex items-center justify-between">
                    <span className="w-[40px] h-[40px] rounded-[4px] bg-[#FBEDE7] flex items-center justify-center">
                      <Icon size={20} className="text-[#C2390A]" />
                    </span>
                    <span className="font-mono text-[12px] text-[#7B8296]">0{i + 1}</span>
                  </div>
                  <h3 className="font-[Manrope] font-semibold text-[17px] text-[#0A0F1A]">{s.title}</h3>
                  <p className="font-[Inter] text-[13.5px] leading-[1.55] text-[#5A6378]">{s.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* RANKING / MÉRITO */}
      <section className="border-t border-b border-[#E8EAEF] py-[84px]">
        <div className="max-w-[1136px] mx-auto px-[72px] grid grid-cols-[0.95fr_1.05fr] gap-[56px] items-center">
          <div>
            <p className="font-[Inter] font-semibold text-[12px] tracking-[0.10em] uppercase text-[#C2390A]">el ranking</p>
            <h2 className="font-[Manrope] font-black text-[38px] leading-[1.12] tracking-[-0.01em] text-[#0A0F1A] mt-[12px]">
              Premia el mérito,<br />no la potra
            </h2>
            <p className="font-[Inter] text-[18px] leading-[1.6] text-[#5A6378] mt-[18px] max-w-[440px]">
              Acertar 10 en una jornada de favoritos claros no es lo mismo que acertar 10 en una jornada loca.
              Cada jornada lleva un coeficiente de dificultad — sacado de cuántos acertantes hubo
              y de las categorías premiadas por Loterías — así el ranking mide quién apuesta mejor.
            </p>
            <ul className="list-none p-0 mt-[24px] flex flex-col gap-[12px]">
              {[
                'Puntos no lineales: de 9 a 10 aciertos vale mucho más que de 4 a 5',
                'Multiplicador de dificultad por jornada, reproducible con datos públicos',
                'El premio en metálico suma, pero no infla el mérito ya contado',
              ].map((li, i) => (
                <li key={i} className="flex gap-[11px] items-start">
                  <span className="mt-[1px]"><Check size={17} className="text-[#C2390A]" /></span>
                  <span className="font-[Inter] text-[14.5px] leading-[1.5] text-[#121827]">{li}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* MINI LEADERBOARD */}
          <div className="bg-white border-[2px] border-[#121827] rounded-[6px] overflow-hidden">
            <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-[#E8EAEF]">
              <span className="font-[Manrope] font-semibold text-[16px] text-[#0A0F1A]">Clasificación general</span>
              <span className="font-[Inter] text-[12px] text-[#7B8296]">tras jornada 31</span>
            </div>
            <div className="grid grid-cols-[36px_1fr_64px_56px_48px] gap-4 px-[20px] py-[10px] font-[Inter] text-[11px] font-semibold uppercase text-[#7B8296] border-b border-[#E8EAEF]">
              <span>#</span><span>jugador</span><span className="text-right">puntos</span><span className="text-right">últ.</span><span className="text-right">racha</span>
            </div>
            {RANKING.map((r) => {
              const trendColor = r.trend === 'up' ? '#157A4F' : r.trend === 'down' ? '#C2390A' : '#7B8296'
              const isLast = r.pos === RANKING.length
              return (
                <div
                  key={r.pos}
                  className="grid grid-cols-[36px_1fr_64px_56px_48px] gap-4 items-center px-[20px] py-[13px]"
                  style={{
                    borderBottom: isLast ? 'none' : '1px solid #E8EAEF',
                    background: isLast ? 'rgba(250,85,30,0.05)' : 'transparent',
                  }}
                >
                  <span className="font-[Manrope] font-bold text-[15px]" style={{ color: r.pos === 1 ? '#C2390A' : '#5A6378' }}>
                    {r.pos}
                  </span>
                  <span className="flex items-center gap-[10px]">
                    <span className="w-[28px] h-[28px] rounded-full bg-[#FBEDE7] flex items-center justify-center font-[Manrope] font-bold text-[12px] text-[#5A6378]">
                      {r.name[0]}
                    </span>
                    <span className="font-[Inter] text-[14px] font-medium text-[#121827]">
                      {r.name}{isLast && <span className="font-[Inter] text-[11px] text-[#C2390A] ml-[8px]">· camiseta</span>}
                    </span>
                  </span>
                  <span className="text-right font-mono text-[14px] font-semibold text-[#0A0F1A]">{r.pts}</span>
                  <span className="text-right font-mono text-[13px] text-[#5A6378]">{r.last}</span>
                  <span className="text-right font-mono text-[13px] font-semibold" style={{ color: trendColor }}>
                    {r.streak}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-[84px]">
        <div className="max-w-[1136px] mx-auto px-[72px]">
          <p className="font-[Inter] font-semibold text-[12px] tracking-[0.10em] uppercase text-[#C2390A]">lo que trae</p>
          <h2 className="font-[Manrope] font-black text-[38px] leading-[1.12] tracking-[-0.01em] text-[#0A0F1A] mt-[12px] max-w-[560px]">
            Todo lo que necesita una peña que apuesta en serio
          </h2>
          <div className="grid grid-cols-4 gap-[20px] mt-[44px]">
            {FEATURES.map((f, i) => {
              const Icon = f.icon
              return (
                <div key={i} className="bg-white border-[2px] border-[#121827] rounded-[6px] p-[24px]">
                  <Icon size={24} className="text-[#C2390A]" />
                  <h3 className="font-[Manrope] font-semibold text-[17px] text-[#0A0F1A] mt-[16px] mb-[8px]">{f.title}</h3>
                  <p className="font-[Inter] text-[13.5px] leading-[1.55] text-[#5A6378]">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* STAKES */}
      <section className="bg-[#121827] py-[76px]">
        <div className="max-w-[1136px] mx-auto px-[72px] grid grid-cols-[auto_1fr] gap-[40px] items-center">
          <div className="w-[132px] h-[132px] rounded-[6px] bg-[#FA551E] flex items-center justify-center flex-shrink-0">
            <Shirt size={72} strokeWidth={1.75} className="text-[#121827]" />
          </div>
          <div>
            <p className="font-[Inter] font-semibold text-[12px] tracking-[0.10em] uppercase text-[#FA551E]">el premio que nadie quiere</p>
            <h2 className="font-[Manrope] font-black text-[36px] tracking-[-0.01em] text-[#F7F5F2] mt-[10px]">
              El último se lleva la camiseta
            </h2>
            <p className="font-[Inter] text-[17px] leading-[1.6] text-[#F7F5F2] opacity-[0.82] mt-[14px] max-w-[620px]">
              Final de temporada. Quien peor haya apostado — ponderado por dificultad, sin excusas de mala suerte —
              se pone la camiseta de la Desilusión y posa para la foto del grupo. Todo el año mirando la tabla
              para no ser tú.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#FA551E] py-[72px] text-center">
        <div className="max-w-[1136px] mx-auto px-[72px] flex flex-col items-center">
          <h2 className="font-[Manrope] font-black text-[40px] tracking-[-0.015em] text-white">
            ¿Te atreves a quedar el último?
          </h2>
          <p className="font-[Inter] text-[17px] leading-[1.6] text-white opacity-[0.85] mt-[14px] mb-[28px] max-w-[480px]">
            Crea tu cuenta, sube el primer boleto y empieza a defender tu sitio en la tabla.
          </p>
          <div className="flex gap-[14px]">
            <Link href="/register" className="inline-flex items-center gap-[8px] px-[24px] py-[14px] bg-[#121827] text-[#F7F5F2] font-[Inter] font-semibold text-[15px] rounded-[4px] no-underline hover:bg-[#0A0F1A] transition-colors duration-[140ms]">
              Crear cuenta <ArrowRight size={17} />
            </Link>
            <Link href="/login" className="inline-flex items-center gap-[8px] px-[24px] py-[14px] bg-transparent text-white font-[Inter] font-semibold text-[15px] border border-[rgba(255,255,255,0.30)] rounded-[4px] hover:bg-[rgba(255,255,255,0.05)] transition-colors duration-[140ms] no-underline">
              Entrar
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#F7F5F2] px-[72px] py-[36px] border-t border-[#E8EAEF]">
        <div className="flex items-center justify-between flex-wrap gap-[16px]">
          <div className="flex items-center gap-[10px]">
            <span className="w-[24px] h-[24px] rounded-[3px] bg-[#FA551E] flex items-center justify-center text-white font-[Manrope] font-black text-[13px]">D</span>
            <span className="font-[Inter] text-[13px] text-[#5A6378]">Peña la Desilusión · una quiniela entre amigos</span>
          </div>
          <div className="flex gap-[24px]">
            {[
              { label: 'Cómo funciona', href: '#' },
              { label: 'Ranking', href: '#' },
              { label: 'Reglas', href: '#' },
              { label: 'Entrar', href: '/login' },
            ].map((link) => (
              <Link key={link.label} href={link.href} className="font-[Inter] text-[13px] text-[#5A6378] no-underline hover:text-[#FA551E] transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
