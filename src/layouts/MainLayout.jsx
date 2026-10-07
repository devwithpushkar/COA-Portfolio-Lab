import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Menu, X, FileDown, Cpu } from 'lucide-react'
import useDocumentTitle from '../hooks/useDocumentTitle.js'

const NAV_LINKS = [
  { to: '/home', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/achievements', label: 'Achievements' },
  { to: '/lab', label: 'COA Lab' },
]

const PAGE_TITLES = {
  '/home': 'Home',
  '/about': 'About',
  '/achievements': 'Achievements',
  '/lab': 'COA Lab',
}

function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => setOpen(false), [location.pathname])

  const linkClass = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm transition-colors ${
      isActive
        ? 'bg-amber-glow/10 font-medium text-amber-glow'
        : 'text-mist-200 hover:bg-ink-800 hover:text-mist-100'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-ink-700/70 bg-ink-950/85 backdrop-blur-md">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
        aria-label="Main navigation"
      >
        <Link to="/home" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-glow/50 bg-ink-900">
            <Cpu size={18} className="text-amber-glow" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold text-mist-100">Pushkar Gupta</span>
            <span className="hex-label block text-[0.6rem]">CSE · COA Lab</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
          <a
            href="/resume/pushkar-gupta-resume.pdf"
            download
            className="ml-3 inline-flex items-center gap-1.5 rounded-md border border-amber-glow/60 px-3 py-2 text-sm font-medium text-amber-glow transition-colors hover:bg-amber-glow/10"
          >
            <FileDown size={15} aria-hidden="true" />
            Resume
          </a>
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-mist-200 hover:bg-ink-800 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-ink-700/70 bg-ink-950 px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
            <a
              href="/resume/pushkar-gupta-resume.pdf"
              download
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-md border border-amber-glow/60 px-3 py-2 text-sm font-medium text-amber-glow"
            >
              <FileDown size={15} aria-hidden="true" />
              Download Resume
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

function Footer() {
  return (
    <footer className="mt-20 border-t border-ink-700/70 bg-ink-900/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-sm font-semibold text-mist-100">Pushkar Gupta</p>
          <p className="mt-1 text-xs leading-relaxed text-mist-400">
            B.E. Computer Science Engineering · Chandigarh University · Class of 2029
          </p>
          <p className="hex-label mt-3">Academic COA Project</p>
        </div>
        <div>
          <p className="hex-label mb-3">Navigate</p>
          <ul className="space-y-1.5 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-mist-200 transition-colors hover:text-amber-glow">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="hex-label mb-3">Connect</p>
          <ul className="space-y-1.5 text-sm">
            <li>
              <a href="mailto:pushkar4335g@gmail.com" className="text-mist-200 hover:text-amber-glow">
                pushkar4335g@gmail.com
              </a>
            </li>
            <li>
              <a
                href="https://github.com/devwithpushkar"
                target="_blank"
                rel="noreferrer"
                className="text-mist-200 hover:text-amber-glow"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com/in/pushkargupta-"
                target="_blank"
                rel="noreferrer"
                className="text-mist-200 hover:text-amber-glow"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-700/50 py-4 text-center">
        <p className="font-mono text-[0.7rem] text-mist-400">
          0x{new Date().getFullYear().toString(16).toUpperCase()} · Built with React, Vite &
          Tailwind CSS
        </p>
      </div>
    </footer>
  )
}

export default function MainLayout() {
  const location = useLocation()
  const base = '/' + (location.pathname.split('/')[1] ?? '')
  useDocumentTitle(PAGE_TITLES[base] ?? '')

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
