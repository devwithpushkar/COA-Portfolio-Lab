import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Cpu } from 'lucide-react'
import useDocumentTitle from '../hooks/useDocumentTitle.js'

const REGISTER_LINES = [
  { addr: '0x00', label: 'PC', value: 'PUSHKAR.EXE' },
  { addr: '0x04', label: 'IR', value: 'LOAD PORTFOLIO' },
  { addr: '0x08', label: 'MAR', value: 'COA_LAB' },
  { addr: '0x0C', label: 'ACC', value: 'CSE · 2029' },
]

function useTyped(text, speed = 55, startDelay = 400) {
  const [out, setOut] = useState('')
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setOut(text)
      return
    }
    let i = 0
    let timer
    const start = setTimeout(() => {
      timer = setInterval(() => {
        i++
        setOut(text.slice(0, i))
        if (i >= text.length) clearInterval(timer)
      }, speed)
    }, startDelay)
    return () => {
      clearTimeout(start)
      clearInterval(timer)
    }
  }, [text, speed, startDelay])
  return out
}

function FloatingGlyphs() {
  const glyphs = useMemo(
    () => [
      { text: '01001', top: '12%', left: '8%', delay: '0s' },
      { text: '0xF3A1', top: '22%', left: '84%', delay: '1.2s' },
      { text: '1011', top: '68%', left: '12%', delay: '0.6s' },
      { text: '0x7FF0', top: '78%', left: '80%', delay: '1.8s' },
      { text: '01', top: '40%', left: '92%', delay: '2.4s' },
      { text: 'R1', top: '85%', left: '30%', delay: '3s' },
      { text: 'ADD', top: '8%', left: '45%', delay: '2s' },
      { text: '0b1101', top: '55%', left: '4%', delay: '1.5s' },
    ],
    [],
  )
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {glyphs.map((g) => (
        <span
          key={g.text + g.top}
          className="absolute font-mono text-xs text-ink-600 select-none"
          style={{ top: g.top, left: g.left, animation: `pulse-line 4s ease-in-out ${g.delay} infinite` }}
        >
          {g.text}
        </span>
      ))}
    </div>
  )
}

export default function Landing() {
  useDocumentTitle('')
  const typed = useTyped('Computer Science Engineering student · Builder of intelligent systems')

  return (
    <div className="grid-bg relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      {/* subtle circuit traces */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
        preserveAspectRatio="none"
      >
        <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#232a3d" strokeWidth="1" className="bus-line" />
        <line x1="0" y1="72%" x2="100%" y2="72%" stroke="#232a3d" strokeWidth="1" className="bus-line" style={{ animationDelay: '0.8s' }} />
      </svg>

      <FloatingGlyphs />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <div className="panel mb-8 flex items-center gap-2 px-4 py-2">
          <Cpu size={15} className="text-amber-glow" aria-hidden="true" />
          <span className="hex-label">Academic COA Project · Chandigarh University</span>
        </div>

        <p className="hex-label mb-4">WELCOME TO THE PORTFOLIO OF</p>
        <h1 className="text-5xl font-bold tracking-tight text-mist-100 sm:text-7xl">
          Pushkar{' '}
          <span className="bg-gradient-to-r from-amber-glow to-amber-deep bg-clip-text text-transparent">
            Gupta
          </span>
        </h1>

        <p className="mt-5 h-6 max-w-xl font-mono text-sm text-mist-400">
          {typed}
          <span className="caret ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-amber-glow" aria-hidden="true" />
        </p>

        {/* register strip */}
        <div className="panel mt-10 w-full max-w-xl overflow-hidden">
          <div className="grid grid-cols-4 border-b border-ink-700/70 bg-ink-850 text-center">
            {REGISTER_LINES.map((r) => (
              <div key={r.addr} className="border-r border-ink-700/50 py-1.5 last:border-r-0">
                <span className="font-mono text-[0.6rem] text-mist-400">{r.addr}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 text-center">
            {REGISTER_LINES.map((r) => (
              <div key={r.addr} className="border-r border-ink-700/50 px-1 py-3 last:border-r-0">
                <p className="font-mono text-[0.65rem] font-semibold text-amber-glow">{r.label}</p>
                <p className="mt-1 truncate font-mono text-[0.7rem] text-mist-200">{r.value}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 max-w-lg text-sm leading-relaxed text-mist-400">
          This site is my academic Computer Organization & Architecture project — a personal
          portfolio combined with an interactive COA laboratory. Explore who I am, what I have
          built, and try the tools yourself.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            to="/home"
            className="group inline-flex items-center gap-2 rounded-lg bg-amber-glow px-7 py-3 text-sm font-semibold text-ink-950 shadow-lg shadow-amber-glow/20 transition-all hover:bg-amber-soft hover:shadow-amber-glow/30"
          >
            Explore
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          <Link
            to="/lab"
            className="inline-flex items-center gap-2 rounded-lg border border-ink-600 px-7 py-3 text-sm font-medium text-mist-200 transition-colors hover:border-amber-glow/50 hover:text-amber-glow"
          >
            Jump to COA Lab
          </Link>
        </div>
      </div>

      <p className="absolute bottom-5 font-mono text-[0.65rem] text-mist-400/70">
        STATUS: READY · CLK: 2029 · LOC: LUDHIANA, IN
      </p>
    </div>
  )
}
