import { useState } from 'react'
import { Play, AlertTriangle, Info, TerminalSquare } from 'lucide-react'
import Reveal from '../../components/Reveal.jsx'
import { analyzeExpression } from '../../coa/addressing/index.js'

const SAMPLES = ['A + B * (C - D)', '(A + B) * (C - D)', 'A * B + C / D', 'A - (B + C) * D']

const FORMATS = [
  { key: 'three', name: '3-Address', note: 'OP dest, src1, src2 — one instruction per operation.' },
  { key: 'two', name: '2-Address', note: 'OP dest, src — dest doubles as an operand; MOV loads values in.' },
  { key: 'one', name: '1-Address', note: 'Accumulator machine — implicit AC operand, temporaries in memory.' },
  { key: 'zero', name: '0-Address', note: 'Stack machine — operands implicit on the top of stack.' },
]

function InstructionPanel({ format, data, index, maxCount }) {
  return (
    <section className="panel flex h-full flex-col overflow-hidden" aria-label={`${format.name} instructions`}>
      <header className="flex items-center justify-between border-b border-ink-700/70 bg-ink-850/70 px-5 py-3">
        <div className="flex items-center gap-2">
          <TerminalSquare size={15} className="text-amber-glow" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-mist-100">{format.name}</h3>
        </div>
        <span
          className="rounded-md border border-amber-glow/40 bg-amber-glow/10 px-2 py-0.5 font-mono text-xs font-semibold text-amber-glow"
          title="Instruction count"
        >
          {data.count} instr
        </span>
      </header>
      <p className="px-5 pt-3 text-[0.7rem] leading-relaxed text-mist-400">{format.note}</p>
      <div className="flex-1 overflow-x-auto p-5 pt-3">
        {data.count === 0 ? (
          <p className="font-mono text-xs text-mist-400">
            ; no operation — the expression is a single operand
          </p>
        ) : (
          <ol className="space-y-1.5">
            {data.instructions.map((instr, i) => (
              <li
                key={`${index}-${i}`}
                className="instr-row flex items-baseline gap-3 font-mono text-sm text-mist-100"
                style={{ animationDelay: `${i * 60 + index * 120}ms` }}
              >
                <span className="w-8 shrink-0 text-right font-mono text-[0.65rem] text-mist-400">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="whitespace-nowrap">
                  <span className="font-semibold text-amber-glow">{instr.split(' ')[0]}</span>
                  {instr.includes(' ') && ` ${instr.slice(instr.indexOf(' ') + 1)}`}
                </span>
              </li>
            ))}
          </ol>
        )}
        {data.result && data.count > 0 && (
          <p className="mt-4 font-mono text-[0.7rem] text-signal">
            ; final result → {data.result}
          </p>
        )}
      </div>
      {/* relative load bar */}
      <div className="h-1 w-full bg-ink-800" aria-hidden="true">
        <div
          className="h-full bg-gradient-to-r from-amber-deep to-amber-glow transition-all duration-700"
          style={{ width: `${(data.count / maxCount) * 100}%` }}
        />
      </div>
    </section>
  )
}

function Comparison({ result }) {
  const counts = FORMATS.map((f) => ({ name: f.name, count: result[f.key].count }))
  const max = Math.max(...counts.map((c) => c.count), 1)
  return (
    <Reveal>
      <section className="panel mt-8 p-6 sm:p-8" aria-labelledby="comparison-heading">
        <h3 id="comparison-heading" className="text-base font-semibold text-mist-100">
          Instruction count comparison
        </h3>
        <div className="mt-5 space-y-3">
          {counts.map((c) => (
            <div key={c.name} className="flex items-center gap-3">
              <span className="w-24 shrink-0 font-mono text-xs text-mist-200">{c.name}</span>
              <div className="h-5 flex-1 overflow-hidden rounded bg-ink-800">
                <div
                  className="flex h-full items-center justify-end rounded bg-gradient-to-r from-amber-deep/80 to-amber-glow/90 px-2 transition-all duration-700"
                  style={{ width: `${(c.count / max) * 100}%`, minWidth: '2rem' }}
                >
                  <span className="font-mono text-[0.65rem] font-bold text-ink-950">{c.count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-mist-400">
          <Info size={14} className="mt-0.5 shrink-0 text-signal" aria-hidden="true" />
          Fewer instructions is not universally "better". Instruction count depends on the
          expression and the machine model — wider instructions cost more bits and more memory
          bandwidth, while stack machines trade instruction count for hidden operand traffic.
          Each organization is a different trade-off, not a ranking.
        </p>
      </section>
    </Reveal>
  )
}

export default function AddressingTool() {
  const [expr, setExpr] = useState('A + B * (C - D)')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const run = (value) => {
    const input = value ?? expr
    const analysis = analyzeExpression(input)
    if (analysis.ok) {
      setResult(analysis)
      setError(null)
    } else {
      setResult(null)
      setError(analysis.error)
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    run()
  }

  return (
    <div>
      <Reveal>
        <section className="panel p-6 sm:p-8" aria-labelledby="addressing-heading">
          <h2 id="addressing-heading" className="text-xl font-semibold text-mist-100">
            Instruction Set Addressing
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mist-400">
            Enter an arithmetic expression using variables <span className="font-mono text-mist-200">A–Z</span>,
            operators <span className="font-mono text-mist-200">+ − * /</span> and parentheses. The lab
            validates it, converts it to postfix, and generates correct instruction sequences for all
            four addressing organizations.
          </p>

          <form onSubmit={onSubmit} className="mt-6">
            <label htmlFor="expr-input" className="hex-label mb-2 block">
              Infix expression
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="expr-input"
                type="text"
                value={expr}
                onChange={(e) => setExpr(e.target.value)}
                placeholder="A + B * (C - D)"
                autoComplete="off"
                spellCheck={false}
                aria-describedby={error ? 'expr-error' : undefined}
                aria-invalid={error ? 'true' : 'false'}
                className={`w-full flex-1 rounded-lg border bg-ink-950 px-4 py-3 font-mono text-base text-mist-100 placeholder:text-mist-400/50 focus:outline-none ${
                  error
                    ? 'border-rose-500/70 focus:border-rose-400'
                    : 'border-ink-600 focus:border-amber-glow/70'
                }`}
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-glow px-6 py-3 text-sm font-semibold text-ink-950 transition-colors hover:bg-amber-soft"
              >
                <Play size={15} aria-hidden="true" />
                Generate
              </button>
            </div>

            {error && (
              <p
                id="expr-error"
                role="alert"
                className="mt-3 flex items-start gap-2 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
              >
                <AlertTriangle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
                {error.message}
              </p>
            )}
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="hex-label">Try:</span>
            {SAMPLES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setExpr(s)
                  run(s)
                }}
                className="rounded-md border border-ink-700 bg-ink-850 px-3 py-1 font-mono text-xs text-mist-200 transition-colors hover:border-amber-glow/50 hover:text-amber-glow"
              >
                {s}
              </button>
            ))}
          </div>
        </section>
      </Reveal>

      {result && (
        <>
          <Reveal>
            <div className="panel mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 px-6 py-4">
              <div>
                <p className="hex-label mb-1">Postfix (RPN)</p>
                <p className="font-mono text-sm text-signal">{result.postfix}</p>
              </div>
              <div>
                <p className="hex-label mb-1">Variables</p>
                <p className="font-mono text-sm text-mist-100">{result.variables.join(' ')}</p>
              </div>
              <div>
                <p className="hex-label mb-1">Operations</p>
                <p className="font-mono text-sm text-mist-100">{result.three.count}</p>
              </div>
            </div>
          </Reveal>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {FORMATS.map((f, i) => (
              <Reveal key={f.key} delay={i * 80} className="h-full">
                <InstructionPanel
                  format={f}
                  data={result[f.key]}
                  index={i}
                  maxCount={Math.max(...FORMATS.map((x) => result[x.key].count), 1)}
                />
              </Reveal>
            ))}
          </div>

          <Comparison result={result} />
        </>
      )}
    </div>
  )
}
