import { useMemo, useState } from 'react'
import { ArrowLeftRight, Copy, Check, AlertTriangle } from 'lucide-react'
import Reveal from '../../components/Reveal.jsx'
import {
  convert,
  STANDARD_BASES,
  EXTRA_BASES,
  baseLabel,
  validDigitsHint,
} from '../../coa/numberSystems/index.js'

const ALL_BASES = [...STANDARD_BASES, ...EXTRA_BASES]
const QUICK_REF = [
  { base: 10, name: 'DEC' },
  { base: 2, name: 'BIN' },
  { base: 8, name: 'OCT' },
  { base: 16, name: 'HEX' },
]

function BaseSelector({ id, label, base, onBaseChange }) {
  const isKnown = ALL_BASES.some((b) => b.base === base)
  return (
    <div className="flex-1">
      <label htmlFor={id} className="hex-label mb-2 block">
        {label}
      </label>
      <div className="flex gap-2">
        <select
          id={id}
          value={isKnown ? base : 'custom'}
          onChange={(e) => {
            const v = e.target.value
            onBaseChange(v === 'custom' ? base : Number(v))
          }}
          className="w-full rounded-lg border border-ink-600 bg-ink-950 px-3 py-2.5 text-sm text-mist-100 focus:border-amber-glow/70 focus:outline-none"
        >
          {STANDARD_BASES.map((b) => (
            <option key={b.base} value={b.base}>
              {b.name} (base {b.base})
            </option>
          ))}
          <optgroup label="More systems">
            {EXTRA_BASES.map((b) => (
              <option key={b.base} value={b.base}>
                {b.name} (base {b.base})
              </option>
            ))}
          </optgroup>
          <option value="custom">Custom base…</option>
        </select>
        {!isKnown && (
          <input
            type="number"
            min={2}
            max={36}
            value={base}
            onChange={(e) => {
              const n = Number(e.target.value)
              if (n >= 2 && n <= 36) onBaseChange(n)
            }}
            aria-label={`${label} custom base (2-36)`}
            className="w-24 rounded-lg border border-amber-glow/50 bg-ink-950 px-3 py-2.5 font-mono text-sm text-amber-glow focus:outline-none"
          />
        )}
      </div>
      <p className="mt-1.5 font-mono text-[0.65rem] text-mist-400">
        Valid digits: {validDigitsHint(base)}
      </p>
    </div>
  )
}

export default function NumberSystems() {
  const [fromBase, setFromBase] = useState(10)
  const [toBase, setToBase] = useState(2)
  const [value, setValue] = useState('23')
  const [copied, setCopied] = useState(false)

  const conversion = useMemo(() => convert(value, fromBase, toBase), [value, fromBase, toBase])

  const quickRef = useMemo(() => {
    const parsed = convert(value, fromBase, 10)
    if (!parsed.ok) return null
    const abs = parsed.result.replace('-', '')
    return QUICK_REF.map((q) => ({
      ...q,
      value: (parsed.result.startsWith('-') ? '-' : '') + convert(abs, 10, q.base).result,
    }))
  }, [value, fromBase])

  const swap = () => {
    setFromBase(toBase)
    setToBase(fromBase)
    if (conversion.ok) setValue(conversion.result.replace('-', ''))
  }

  const copyResult = async () => {
    if (!conversion.ok) return
    try {
      await navigator.clipboard.writeText(conversion.result)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard unavailable — ignore */
    }
  }

  return (
    <div>
      <Reveal>
        <section className="panel p-6 sm:p-8" aria-labelledby="converter-heading">
          <h2 id="converter-heading" className="text-xl font-semibold text-mist-100">
            Number System Converter
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mist-400">
            Convert between positional number systems. Values are parsed from the source base into
            an internal representation (arbitrary-precision), then rendered in the target base —
            one pipeline, any pair of bases from 2 to 36.
          </p>

          <div className="mt-7 flex flex-col items-stretch gap-4 md:flex-row md:items-end">
            <BaseSelector id="from-base" label="From system" base={fromBase} onBaseChange={setFromBase} />

            <button
              type="button"
              onClick={swap}
              className="mx-auto inline-flex items-center gap-2 rounded-lg border border-ink-600 bg-ink-850 px-4 py-2.5 text-xs font-medium text-mist-200 transition-colors hover:border-amber-glow/60 hover:text-amber-glow md:mb-6"
              aria-label="Swap source and target systems"
            >
              <ArrowLeftRight size={14} aria-hidden="true" />
              Swap
            </button>

            <BaseSelector id="to-base" label="To system" base={toBase} onBaseChange={setToBase} />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="value-input" className="hex-label mb-2 block">
                Input ({baseLabel(fromBase)})
              </label>
              <input
                id="value-input"
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={`e.g. ${STANDARD_BASES.find((b) => b.base === fromBase)?.sample ?? '101'}`}
                autoComplete="off"
                spellCheck={false}
                aria-invalid={!conversion.ok && value.trim() !== '' ? 'true' : 'false'}
                aria-describedby={conversion.ok ? undefined : 'convert-error'}
                className={`w-full rounded-lg border bg-ink-950 px-4 py-3 font-mono text-base text-mist-100 focus:outline-none ${
                  !conversion.ok && value.trim() !== ''
                    ? 'border-rose-500/70 focus:border-rose-400'
                    : 'border-ink-600 focus:border-amber-glow/70'
                }`}
              />
            </div>
            <div>
              <div className="hex-label mb-2 flex items-center justify-between">
                <span>Result ({baseLabel(toBase)})</span>
                {conversion.ok && (
                  <button
                    type="button"
                    onClick={copyResult}
                    className="inline-flex items-center gap-1 text-[0.65rem] text-mist-200 hover:text-amber-glow"
                  >
                    {copied ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
              <div
                className="w-full overflow-x-auto rounded-lg border border-amber-glow/40 bg-amber-glow/5 px-4 py-3"
                aria-live="polite"
              >
                <p className="font-mono text-base font-semibold text-amber-glow">
                  {conversion.ok ? conversion.result : '—'}
                </p>
              </div>
            </div>
          </div>

          {!conversion.ok && value.trim() !== '' && (
            <p
              id="convert-error"
              role="alert"
              className="mt-4 flex items-start gap-2 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
            >
              <AlertTriangle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
              {conversion.error}
            </p>
          )}
        </section>
      </Reveal>

      {quickRef && (
        <Reveal>
          <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Quick reference in common bases">
            {quickRef.map((q) => (
              <div key={q.name} className="panel px-5 py-4">
                <p className="font-mono text-[0.6rem] tracking-widest text-mist-400">{q.name}</p>
                <p className="mt-1.5 overflow-x-auto font-mono text-sm text-mist-100">{q.value}</p>
              </div>
            ))}
          </section>
        </Reveal>
      )}

      <Reveal>
        <p className="mt-6 text-xs leading-relaxed text-mist-400">
          Standard systems are one click away; the custom base option supports any radix from 2 to
          36 (ternary, quaternary, base-12, base-36, …). Digits are validated against the selected
          base — base 2 rejects <span className="font-mono">2</span>, base 8 rejects{' '}
          <span className="font-mono">8</span>, base 16 accepts <span className="font-mono">0–9</span>{' '}
          and <span className="font-mono">A–F</span>.
        </p>
      </Reveal>
    </div>
  )
}
