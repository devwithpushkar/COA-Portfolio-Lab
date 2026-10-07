/**
 * Assignment data access.
 *
 * Primary store: FastAPI backend at /api/assignments (PostgreSQL in
 * production, SQLite in local development — the frontend never cares which).
 * Set VITE_API_URL at build time to point at the deployed backend.
 * If the backend is unreachable (e.g. static-only dev preview), the service
 * transparently falls back to a local browser store so the UI keeps working —
 * callers receive `mode: 'local'` and should surface that to the user.
 */
const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')
const LOCAL_KEY = 'coa.assignments.v1'
const TOKEN_KEY = 'coa.adminToken'
const FIELDS = [
  'title', 'question', 'topic', 'category', 'date',
  'difficulty', 'notes', 'answer', 'solution', 'reference',
]

export function getAdminToken() {
  return sessionStorage.getItem(TOKEN_KEY) ?? ''
}

export function setAdminToken(token) {
  if (token) sessionStorage.setItem(TOKEN_KEY, token)
  else sessionStorage.removeItem(TOKEN_KEY)
}

async function apiFetch(path, options = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 6000)
  try {
    const token = getAdminToken()
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'X-Admin-Token': token } : {}),
        ...(options.headers ?? {}),
      },
    })
    if (!res.ok) {
      let detail = `Request failed (${res.status})`
      try {
        const body = await res.json()
        if (typeof body.detail === 'string') detail = body.detail
        else if (Array.isArray(body.detail)) detail = body.detail[0]?.msg ?? detail
      } catch { /* keep default */ }
      const err = new Error(detail)
      err.status = res.status
      throw err
    }
    return await res.json()
  } finally {
    clearTimeout(timer)
  }
}

/* ---------- local fallback store ---------- */

function readLocal() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY)) ?? []
  } catch {
    return []
  }
}

function writeLocal(items) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items))
}

function sanitize(payload) {
  const out = {}
  for (const f of FIELDS) out[f] = String(payload[f] ?? '').slice(0, 8000)
  if (!['Easy', 'Medium', 'Hard'].includes(out.difficulty)) out.difficulty = 'Medium'
  return out
}

function isNetworkError(err) {
  return err.name === 'AbortError' || err instanceof TypeError || err.status === undefined
}

/* ---------- public API ---------- */

/** Reports the active backend engine, e.g. { database: 'postgresql' }.
 *  Returns null when the API is unreachable. */
export async function getBackendInfo() {
  try {
    return await apiFetch('/api/health')
  } catch {
    return null
  }
}

export async function listAssignments() {
  try {
    const data = await apiFetch('/api/assignments')
    return { items: data.items, mode: 'server' }
  } catch (err) {
    if (!isNetworkError(err)) throw err
    return { items: readLocal(), mode: 'local' }
  }
}

export async function createAssignment(payload) {
  const clean = sanitize(payload)
  if (!clean.title.trim() || !clean.question.trim()) {
    throw new Error('Title and question are required.')
  }
  try {
    const item = await apiFetch('/api/assignments', {
      method: 'POST',
      body: JSON.stringify(clean),
    })
    return { item, mode: 'server' }
  } catch (err) {
    if (!isNetworkError(err)) throw err
    const items = readLocal()
    const item = { ...clean, id: Date.now(), created_at: new Date().toISOString() }
    items.unshift(item)
    writeLocal(items)
    return { item, mode: 'local' }
  }
}

export async function updateAssignment(id, payload) {
  const clean = sanitize(payload)
  if (!clean.title.trim() || !clean.question.trim()) {
    throw new Error('Title and question are required.')
  }
  try {
    const item = await apiFetch(`/api/assignments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clean),
    })
    return { item, mode: 'server' }
  } catch (err) {
    if (!isNetworkError(err)) throw err
    const items = readLocal()
    const idx = items.findIndex((a) => a.id === id)
    if (idx === -1) throw new Error('Assignment not found in local store.')
    items[idx] = { ...items[idx], ...clean }
    writeLocal(items)
    return { item: items[idx], mode: 'local' }
  }
}

export async function deleteAssignment(id) {
  try {
    await apiFetch(`/api/assignments/${id}`, { method: 'DELETE' })
    return { mode: 'server' }
  } catch (err) {
    if (!isNetworkError(err)) throw err
    writeLocal(readLocal().filter((a) => a.id !== id))
    return { mode: 'local' }
  }
}
