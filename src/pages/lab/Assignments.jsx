import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Save,
  ChevronDown,
  KeyRound,
  HardDrive,
  Cloud,
  AlertTriangle,
  BookOpen,
  Link2,
} from 'lucide-react'
import Reveal from '../../components/Reveal.jsx'
import {
  listAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAdminToken,
  setAdminToken,
  getBackendInfo,
} from '../../services/assignments.js'

const DIFFICULTIES = ['Easy', 'Medium', 'Hard']
const DIFFICULTY_STYLES = {
  Easy: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300',
  Medium: 'border-amber-glow/40 bg-amber-glow/10 text-amber-glow',
  Hard: 'border-rose-400/40 bg-rose-400/10 text-rose-300',
}

const EMPTY_FORM = {
  title: '',
  question: '',
  topic: '',
  category: '',
  date: '',
  difficulty: 'Medium',
  notes: '',
  answer: '',
  solution: '',
  reference: '',
}

function AssignmentForm({ initial, onSave, onClose, busy }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initial })
  const [errors, setErrors] = useState({})

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!form.title.trim()) nextErrors.title = 'Title is required.'
    if (!form.question.trim()) nextErrors.question = 'Question text is required.'
    if (form.reference.trim() && !/^https?:\/\//i.test(form.reference.trim())) {
      nextErrors.reference = 'Reference must be an http(s) URL or empty.'
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) onSave(form)
  }

  const field = (name, label, required = false) => (
    <div>
      <label htmlFor={`f-${name}`} className="hex-label mb-1.5 block">
        {label} {required && <span className="text-amber-glow">*</span>}
      </label>
      <input
        id={`f-${name}`}
        type={name === 'date' ? 'date' : 'text'}
        value={form[name]}
        onChange={set(name)}
        aria-invalid={errors[name] ? 'true' : 'false'}
        className={`w-full rounded-lg border bg-ink-950 px-3 py-2 text-sm text-mist-100 focus:outline-none ${
          errors[name] ? 'border-rose-500/70' : 'border-ink-600 focus:border-amber-glow/70'
        }`}
      />
      {errors[name] && (
        <p role="alert" className="mt-1 text-xs text-rose-300">
          {errors[name]}
        </p>
      )}
    </div>
  )

  const area = (name, label, rows = 3) => (
    <div>
      <label htmlFor={`f-${name}`} className="hex-label mb-1.5 block">
        {label} {name === 'question' && <span className="text-amber-glow">*</span>}
      </label>
      <textarea
        id={`f-${name}`}
        rows={rows}
        value={form[name]}
        onChange={set(name)}
        aria-invalid={errors[name] ? 'true' : 'false'}
        className={`w-full rounded-lg border bg-ink-950 px-3 py-2 text-sm leading-relaxed text-mist-100 focus:outline-none ${
          errors[name] ? 'border-rose-500/70' : 'border-ink-600 focus:border-amber-glow/70'
        }`}
      />
      {errors[name] && (
        <p role="alert" className="mt-1 text-xs text-rose-300">
          {errors[name]}
        </p>
      )}
    </div>
  )

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-ink-950/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-title"
    >
      <div
        className="flex min-h-full w-full items-center justify-center p-4 sm:p-6"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <form onSubmit={submit} className="panel my-auto w-full max-w-2xl p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 id="form-title" className="text-lg font-semibold text-mist-100">
            {initial?.id ? 'Edit Assignment' : 'Add Assignment'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-mist-400 hover:bg-ink-800 hover:text-mist-100"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">{field('title', 'Question title', true)}</div>
          <div className="sm:col-span-2">{area('question', 'Question', 4)}</div>
          {field('topic', 'Topic')}
          {field('category', 'Category')}
          {field('date', 'Date')}
          <div>
            <label htmlFor="f-difficulty" className="hex-label mb-1.5 block">
              Difficulty
            </label>
            <select
              id="f-difficulty"
              value={form.difficulty}
              onChange={set('difficulty')}
              className="w-full rounded-lg border border-ink-600 bg-ink-950 px-3 py-2 text-sm text-mist-100 focus:border-amber-glow/70 focus:outline-none"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">{area('notes', 'Notes', 2)}</div>
          <div className="sm:col-span-2">{area('answer', 'Answer (optional)', 2)}</div>
          <div className="sm:col-span-2">{area('solution', 'Solution (optional)', 2)}</div>
          <div className="sm:col-span-2">{field('reference', 'Reference URL (optional)')}</div>
        </div>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-ink-600 px-5 py-2.5 text-sm text-mist-200 transition-colors hover:border-ink-600 hover:bg-ink-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-glow px-5 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-amber-soft disabled:opacity-60"
          >
            <Save size={15} aria-hidden="true" />
            {busy ? 'Saving…' : 'Save Question'}
          </button>
        </div>
        </form>
      </div>
    </div>
  )
}

function AssignmentCard({ a, index, expanded, onToggle, onEdit, onDelete }) {
  return (
    <Reveal delay={Math.min(index, 6) * 50}>
      <article className="panel panel-hover overflow-hidden">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className="flex w-full items-start justify-between gap-4 p-5 text-left"
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-mist-100">{a.title}</h3>
              <span
                className={`rounded-full border px-2 py-0.5 font-mono text-[0.6rem] font-semibold ${
                  DIFFICULTY_STYLES[a.difficulty] ?? DIFFICULTY_STYLES.Medium
                }`}
              >
                {(a.difficulty || 'Medium').toUpperCase()}
              </span>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.65rem] text-mist-400">
              {a.topic && <span>TOPIC · {a.topic}</span>}
              {a.category && <span>CAT · {a.category}</span>}
              {a.date && <span>DATE · {a.date}</span>}
              <span>ID · {String(a.id).padStart(4, '0')}</span>
            </div>
          </div>
          <ChevronDown
            size={17}
            className={`mt-1 shrink-0 text-mist-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>

        {expanded && (
          <div className="border-t border-ink-700/70 px-5 py-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-mist-200">{a.question}</p>
            {a.notes && (
              <p className="mt-3 rounded-lg border border-ink-700 bg-ink-850 px-3 py-2 text-xs leading-relaxed text-mist-400">
                <span className="hex-label mr-2">NOTES</span>
                {a.notes}
              </p>
            )}
            {a.answer && (
              <p className="mt-3 text-xs leading-relaxed text-signal">
                <span className="hex-label mr-2">ANSWER</span>
                <span className="font-mono">{a.answer}</span>
              </p>
            )}
            {a.solution && (
              <p className="mt-3 whitespace-pre-wrap text-xs leading-relaxed text-mist-400">
                <span className="hex-label mr-2">SOLUTION</span>
                {a.solution}
              </p>
            )}
            {a.reference && (
              <a
                href={a.reference}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-amber-glow hover:underline"
              >
                <Link2 size={12} aria-hidden="true" />
                Reference
              </a>
            )}
            <div className="mt-4 flex gap-2 border-t border-ink-700/50 pt-4">
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex items-center gap-1.5 rounded-md border border-ink-600 px-3 py-1.5 text-xs text-mist-200 transition-colors hover:border-amber-glow/50 hover:text-amber-glow"
              >
                <Pencil size={12} aria-hidden="true" />
                Edit
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="inline-flex items-center gap-1.5 rounded-md border border-ink-600 px-3 py-1.5 text-xs text-mist-200 transition-colors hover:border-rose-400/60 hover:text-rose-300"
              >
                <Trash2 size={12} aria-hidden="true" />
                Delete
              </button>
            </div>
          </div>
        )}
      </article>
    </Reveal>
  )
}

export default function Assignments() {
  const [items, setItems] = useState([])
  const [mode, setMode] = useState(null)
  const [engine, setEngine] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [search, setSearch] = useState('')
  const [topicFilter, setTopicFilter] = useState('All')
  const [difficultyFilter, setDifficultyFilter] = useState('All')
  const [expandedId, setExpandedId] = useState(null)
  const [editing, setEditing] = useState(null) // null | {} for new | assignment for edit
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState(null)
  const [showToken, setShowToken] = useState(false)
  const [tokenDraft, setTokenDraft] = useState(getAdminToken())

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const { items: data, mode: m } = await listAssignments()
      setItems(data)
      setMode(m)
    } catch (err) {
      setLoadError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    getBackendInfo().then((info) => {
      if (info?.database) setEngine(info.database)
    })
  }, [])

  const topics = useMemo(
    () => ['All', ...new Set(items.map((a) => a.topic).filter(Boolean))],
    [items],
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter((a) => {
      if (topicFilter !== 'All' && a.topic !== topicFilter) return false
      if (difficultyFilter !== 'All' && a.difficulty !== difficultyFilter) return false
      if (q) {
        const hay = `${a.title} ${a.question} ${a.topic} ${a.category} ${a.notes}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [items, search, topicFilter, difficultyFilter])

  const handleSave = async (form) => {
    setBusy(true)
    setActionError(null)
    try {
      if (editing?.id) {
        await updateAssignment(editing.id, form)
      } else {
        await createAssignment(form)
      }
      setEditing(null)
      await load()
    } catch (err) {
      setActionError(
        err.status === 401
          ? 'Admin token rejected. Enter the token configured on the server (COA_ADMIN_TOKEN).'
          : err.message,
      )
      if (err.status === 401) setShowToken(true)
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async (a) => {
    if (!window.confirm(`Delete "${a.title}"? This cannot be undone.`)) return
    setActionError(null)
    try {
      await deleteAssignment(a.id)
      await load()
    } catch (err) {
      setActionError(
        err.status === 401
          ? 'Admin token rejected. Enter the token configured on the server (COA_ADMIN_TOKEN).'
          : err.message,
      )
      if (err.status === 401) setShowToken(true)
    }
  }

  return (
    <div>
      <Reveal>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-mist-100">Assignments</h2>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-mist-400">
              COA assignment archive. Questions live in the backend database — add new ones any
              time without touching frontend code.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setShowToken((v) => !v)
                setTokenDraft(getAdminToken())
              }}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs transition-colors ${
                getAdminToken()
                  ? 'border-signal/50 text-signal'
                  : 'border-ink-600 text-mist-200 hover:border-amber-glow/50 hover:text-amber-glow'
              }`}
              aria-expanded={showToken}
            >
              <KeyRound size={13} aria-hidden="true" />
              {getAdminToken() ? 'Admin ✓' : 'Admin'}
            </button>
            <button
              type="button"
              onClick={() => {
                setActionError(null)
                setEditing({})
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-glow px-4 py-2 text-xs font-semibold text-ink-950 transition-colors hover:bg-amber-soft"
            >
              <Plus size={14} aria-hidden="true" />
              Add Assignment
            </button>
          </div>
        </div>
      </Reveal>

      {/* storage mode / errors */}
      {mode && !loading && (
        <p className="mt-4 inline-flex items-center gap-2 rounded-lg border border-ink-700 bg-ink-900 px-3 py-1.5 font-mono text-[0.65rem] text-mist-400">
          {mode === 'server' ? (
            <>
              <Cloud size={12} className="text-signal" aria-hidden="true" />
              CONNECTED · FastAPI +{' '}
              {engine === 'postgresql' ? 'PostgreSQL' : engine === 'sqlite' ? 'SQLite' : 'database'}{' '}
              backend
            </>
          ) : (
            <>
              <HardDrive size={12} className="text-amber-glow" aria-hidden="true" />
              OFFLINE MODE · backend unreachable — using this browser's local store (not shared,
              not persistent across devices)
            </>
          )}
        </p>
      )}

      {showToken && (
        <div className="panel mt-4 flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="admin-token" className="hex-label mb-1.5 block">
              Admin token (server env: COA_ADMIN_TOKEN)
            </label>
            <input
              id="admin-token"
              type="password"
              value={tokenDraft}
              onChange={(e) => setTokenDraft(e.target.value)}
              placeholder="Enter admin token to enable add/edit/delete"
              className="w-full rounded-lg border border-ink-600 bg-ink-950 px-3 py-2 font-mono text-sm text-mist-100 focus:border-amber-glow/70 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setAdminToken(tokenDraft.trim())
              setShowToken(false)
            }}
            className="rounded-lg border border-amber-glow/60 px-4 py-2 text-xs font-medium text-amber-glow hover:bg-amber-glow/10"
          >
            Save token
          </button>
        </div>
      )}

      {actionError && (
        <p
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
        >
          <AlertTriangle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
          {actionError}
        </p>
      )}
      {loadError && (
        <p
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
        >
          <AlertTriangle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
          Failed to load assignments: {loadError}
        </p>
      )}

      {/* filters */}
      <Reveal>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, question, topic…"
              aria-label="Search assignments"
              className="w-full rounded-lg border border-ink-600 bg-ink-950 py-2.5 pl-9 pr-3 text-sm text-mist-100 placeholder:text-mist-400/60 focus:border-amber-glow/70 focus:outline-none"
            />
          </div>
          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            aria-label="Filter by topic"
            className="rounded-lg border border-ink-600 bg-ink-950 px-3 py-2.5 text-sm text-mist-100 focus:border-amber-glow/70 focus:outline-none"
          >
            {topics.map((t) => (
              <option key={t}>{t === 'All' ? 'All topics' : t}</option>
            ))}
          </select>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            aria-label="Filter by difficulty"
            className="rounded-lg border border-ink-600 bg-ink-950 px-3 py-2.5 text-sm text-mist-100 focus:border-amber-glow/70 focus:outline-none"
          >
            <option value="All">All difficulties</option>
            {DIFFICULTIES.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
      </Reveal>

      {/* list */}
      <div className="mt-6 space-y-3">
        {loading ? (
          <div className="panel flex items-center justify-center gap-3 p-10 text-sm text-mist-400">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-amber-glow border-t-transparent" aria-hidden="true" />
            Loading assignments…
          </div>
        ) : filtered.length === 0 ? (
          <div className="panel flex flex-col items-center gap-3 p-12 text-center">
            <BookOpen size={26} className="text-mist-400" aria-hidden="true" />
            <p className="text-sm text-mist-200">
              {items.length === 0
                ? 'No assignments yet.'
                : 'Nothing matches the current filters.'}
            </p>
            <p className="max-w-sm text-xs leading-relaxed text-mist-400">
              {items.length === 0
                ? 'Use “Add Assignment” to store the first question — it persists in the backend database and survives refreshes and redeploys.'
                : 'Try clearing the search or choosing a different topic / difficulty.'}
            </p>
          </div>
        ) : (
          filtered.map((a, i) => (
            <AssignmentCard
              key={a.id}
              a={a}
              index={i}
              expanded={expandedId === a.id}
              onToggle={() => setExpandedId(expandedId === a.id ? null : a.id)}
              onEdit={() => {
                setActionError(null)
                setEditing(a)
              }}
              onDelete={() => handleDelete(a)}
            />
          ))
        )}
      </div>

      {!loading && items.length > 0 && (
        <p className="mt-8 text-center font-mono text-[0.65rem] text-mist-400">
          {filtered.length} / {items.length} SHOWN · STORED IN {mode === 'server' ? 'SQLite (server)' : 'LOCAL BROWSER STORE'}
        </p>
      )}

      {editing !== null && (
        <AssignmentForm
          initial={editing?.id ? editing : undefined}
          busy={busy}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}
