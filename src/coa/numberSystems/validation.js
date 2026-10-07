const DIGIT_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export const STANDARD_BASES = [
  { base: 2, name: 'Binary', sample: '1011' },
  { base: 8, name: 'Octal', sample: '27' },
  { base: 10, name: 'Decimal', sample: '23' },
  { base: 16, name: 'Hexadecimal', sample: '17' },
]

export const EXTRA_BASES = [
  { base: 3, name: 'Ternary' },
  { base: 4, name: 'Quaternary' },
  { base: 5, name: 'Quinary' },
  { base: 6, name: 'Senary' },
  { base: 12, name: 'Duodecimal' },
  { base: 36, name: 'Base-36' },
]

export function baseLabel(base) {
  const known = [...STANDARD_BASES, ...EXTRA_BASES].find((b) => b.base === base)
  return known ? `${known.name} (base ${base})` : `Base ${base}`
}

export function validDigitsHint(base) {
  if (base <= 10) return `0–${base - 1}`
  return `0–9, A–${DIGIT_CHARS[base - 1]}`
}

/**
 * Validate a digit string for the given base.
 * Accepts an optional leading '-' and ignores inner spaces.
 * Returns { ok, digits, negative } or { ok: false, error, pos }.
 */
export function validateForBase(rawValue, base) {
  if (!(base >= 2 && base <= 36)) {
    return { ok: false, error: 'Base must be between 2 and 36.' }
  }

  let value = String(rawValue ?? '').trim()
  if (value === '') {
    return { ok: false, error: 'Enter a value to convert.' }
  }

  let negative = false
  if (value[0] === '-' || value[0] === '+') {
    negative = value[0] === '-'
    value = value.slice(1)
  }

  const compact = value.replace(/ /g, '')
  if (compact === '') {
    return { ok: false, error: 'Enter a value to convert.' }
  }

  const allowed = DIGIT_CHARS.slice(0, base)
  for (let i = 0; i < compact.length; i++) {
    const ch = compact[i].toUpperCase()
    if (!allowed.includes(ch)) {
      return {
        ok: false,
        error: `"${compact[i]}" is not a valid base-${base} digit. Allowed digits: ${validDigitsHint(base)}.`,
        pos: i,
      }
    }
  }

  return { ok: true, digits: compact.toUpperCase(), negative }
}
