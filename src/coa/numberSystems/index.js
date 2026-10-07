import { validateForBase } from './validation.js'
import { parseToBigInt, fromBigInt } from './converter.js'

/**
 * Pipeline: input → validate for source base → BigInt → target base string.
 * Returns { ok, result } or { ok: false, error, pos }.
 */
export function convert(rawValue, fromBase, toBase) {
  const validated = validateForBase(rawValue, fromBase)
  if (!validated.ok) return validated

  try {
    const value = parseToBigInt(validated.digits, fromBase)
    const result = (validated.negative && value !== 0n ? '-' : '') + fromBigInt(value, toBase)
    return { ok: true, result }
  } catch {
    return { ok: false, error: 'Could not convert this value.' }
  }
}

export { validateForBase, STANDARD_BASES, EXTRA_BASES, baseLabel, validDigitsHint } from './validation.js'
