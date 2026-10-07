import { useMemo, useState } from 'react'
import { Award, Trophy, Timer, ScrollText, Layers } from 'lucide-react'
import Reveal from '../components/Reveal.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { achievements, achievementCategories } from '../data/achievements.js'

const CATEGORY_STYLES = {
  Certification: 'border-signal/40 bg-signal/10 text-signal',
  Hackathon: 'border-amber-glow/50 bg-amber-glow/10 text-amber-glow',
  Competition: 'border-purple-400/40 bg-purple-400/10 text-purple-300',
  Internship: 'border-blue-400/40 bg-blue-400/10 text-blue-300',
  Project: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300',
  Academic: 'border-rose-400/40 bg-rose-400/10 text-rose-300',
}

function FeaturedCard({ a }) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-amber-glow/50 bg-gradient-to-br from-amber-glow/12 via-ink-850 to-ink-900 p-8 shadow-lg shadow-amber-glow/5">
      <div
        aria-hidden="true"
        className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-glow/15 blur-2xl"
      />
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-glow/60 bg-ink-950/60 px-3 py-1 font-mono text-[0.65rem] font-semibold tracking-wider text-amber-glow">
          <Trophy size={13} aria-hidden="true" />
          HACKATHON · FEATURED
        </span>
      </div>
      <h3 className="mt-4 text-2xl font-bold tracking-tight text-mist-100">{a.title}</h3>
      <p className="mt-1 text-sm text-mist-400">
        {a.duration && (
          <span className="inline-flex items-center gap-1.5">
            <Timer size={13} aria-hidden="true" />
            {a.duration} hackathon
          </span>
        )}
        {a.organizer && <span> · {a.organizer}</span>}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="rounded-xl border border-amber-glow/40 bg-ink-950/50 px-6 py-4 text-center">
          <p className="font-mono text-[0.6rem] tracking-widest text-mist-400">RESULT</p>
          <p className="mt-1 text-xl font-bold text-amber-glow">{a.result}</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-ink-700 bg-ink-950/50 px-5 py-4">
          <ScrollText size={16} className="text-mist-400" aria-hidden="true" />
          <span className="text-sm text-mist-200">{a.certificate}</span>
        </div>
      </div>

      <p className="mt-5 max-w-xl text-sm leading-relaxed text-mist-400">{a.description}</p>
    </article>
  )
}

function AchievementCard({ a, index }) {
  const chipClass = CATEGORY_STYLES[a.category] ?? 'border-ink-600 bg-ink-800 text-mist-200'
  return (
    <Reveal delay={index * 60}>
      <article className="panel panel-hover flex h-full flex-col p-6">
        <div className="flex items-start justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[0.6rem] font-semibold tracking-wider ${chipClass}`}>
            <Layers size={11} aria-hidden="true" />
            {a.category.toUpperCase()}
          </span>
          <span className="font-mono text-[0.6rem] text-mist-400">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <h3 className="mt-3 text-base font-semibold text-mist-100">{a.title}</h3>
        {a.organizer && <p className="mt-0.5 text-xs text-mist-400">{a.organizer}</p>}
        <p className="mt-2 flex-1 text-sm leading-relaxed text-mist-400">{a.description}</p>
        {a.status && (
          <p className="mt-4 inline-flex items-center gap-1.5 font-mono text-[0.65rem] text-amber-glow">
            <Award size={12} aria-hidden="true" />
            {a.status.toUpperCase()}
          </p>
        )}
      </article>
    </Reveal>
  )
}

export default function Achievements() {
  const [filter, setFilter] = useState('All')

  const featured = achievements.filter((a) => a.featured)
  const rest = useMemo(() => {
    const pool = achievements.filter((a) => !a.featured)
    return filter === 'All' ? pool : pool.filter((a) => a.category === filter)
  }, [filter])

  const showFeatured = filter === 'All' || filter === 'Hackathon'

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Reveal>
        <SectionHeading
          tag="ACHIEVE ARCHIVE · 0x05"
          title="Achievements"
          subtitle="A living archive of certifications, competitions, projects, and milestones — verified entries only."
        />
      </Reveal>

      {/* Filter chips */}
      <Reveal>
        <div
          className="mb-8 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter achievements by category"
        >
          {achievementCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              aria-pressed={filter === cat}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                filter === cat
                  ? 'border-amber-glow bg-amber-glow/15 text-amber-glow'
                  : 'border-ink-700 bg-ink-900 text-mist-200 hover:border-ink-600 hover:text-mist-100'
              }`}
            >
              {cat}
              {cat !== 'All' && (
                <span className="ml-1.5 font-mono text-[0.6rem] opacity-70">
                  {achievements.filter((a) => a.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </Reveal>

      {showFeatured && featured.length > 0 && (
        <div className="mb-8 space-y-6">
          {featured.map((a) => (
            <Reveal key={a.id}>
              <FeaturedCard a={a} />
            </Reveal>
          ))}
        </div>
      )}

      {rest.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((a, i) => (
            <AchievementCard key={a.id} a={a} index={i} />
          ))}
        </div>
      ) : (
        !showFeatured && (
          <p className="panel p-8 text-center text-sm text-mist-400">
            No entries in this category yet — the archive grows over time.
          </p>
        )
      )}

      <p className="mt-10 text-center font-mono text-[0.65rem] text-mist-400">
        {achievements.length} ENTRIES ARCHIVED · DATA-DRIVEN · src/data/achievements.js
      </p>
    </div>
  )
}
