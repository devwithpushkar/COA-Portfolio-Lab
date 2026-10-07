import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-28 text-center">
      <p className="font-mono text-6xl font-bold text-amber-glow">404</p>
      <p className="mt-2 font-mono text-xs tracking-widest text-mist-400">
        ADDRESS NOT MAPPED · SEGMENT FAULT (KIND OF)
      </p>
      <h1 className="mt-6 text-2xl font-semibold text-mist-100">This page doesn't exist</h1>
      <p className="mt-2 text-sm text-mist-400">
        The address you requested is not in this program's memory map.
      </p>
      <Link
        to="/home"
        className="mt-8 inline-flex items-center gap-2 rounded-lg border border-amber-glow/60 px-5 py-2.5 text-sm font-medium text-amber-glow transition-colors hover:bg-amber-glow/10"
      >
        <ArrowLeft size={15} aria-hidden="true" />
        Back to Home
      </Link>
    </div>
  )
}
