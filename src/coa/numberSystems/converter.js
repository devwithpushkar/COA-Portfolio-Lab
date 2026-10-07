const DIGIT_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

/** Parse validated digits in `base` into a BigInt (internal representation). */
export function parseToBigInt(digits, base) {
  const b = BigInt(base)
  let value = 0n
  for (const ch of digits) {
    value = value * b + BigInt(DIGIT_CHARS.indexOf(ch))
  }
  return value
}

/** Render a non-negative BigInt in `base`. */
export function fromBigInt(value, base) {
  if (value === 0n) return '0'
  const b = BigInt(base)
  let out = ''
  let n = value
  while (n > 0n) {
    out = DIGIT_CHARS[Number(n % b)] + out
    n /= b
  }
  return out
}
