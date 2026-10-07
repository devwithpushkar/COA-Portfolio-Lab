import { NavLink, Outlet } from 'react-router-dom'
import { Binary, Hash, ClipboardList, FlaskConical } from 'lucide-react'

const LAB_LINKS = [
  { to: '/lab/addressing', label: 'Instruction Addressing', icon: Binary },
  { to: '/lab/number-systems', label: 'Number Systems', icon: Hash },
  { to: '/lab/assignments', label: 'Assignments', icon: ClipboardList },
]

export default function LabLayout() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <div className="hex-label mb-2 flex items-center gap-2">
          <FlaskConical size={13} className="text-amber-glow" aria-hidden="true" />
          SECTION 0x04
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-mist-100">COA Lab</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mist-400">
          Interactive Computer Organization & Architecture toolkit — instruction addressing
          models, number system conversion, and the assignment archive.
        </p>
      </div>

      <nav
        aria-label="COA Lab sections"
        className="mb-10 flex flex-wrap gap-2 border-b border-ink-700/70 pb-4"
      >
        {LAB_LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors ${
                isActive
                  ? 'border-amber-glow/60 bg-amber-glow/10 font-medium text-amber-glow'
                  : 'border-ink-700 bg-ink-900 text-mist-200 hover:border-ink-600 hover:text-mist-100'
              }`
            }
          >
            <Icon size={15} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  )
}
