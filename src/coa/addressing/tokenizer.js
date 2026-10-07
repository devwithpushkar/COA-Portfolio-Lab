const OPERATORS = new Set(['+', '-', '*', '/'])

/**
 * Tokenize and validate an arithmetic expression.
 * Supported: single-letter variables A-Z, operators + - * /, parentheses.
 * Returns { ok, tokens } or { ok: false, error } where error is
 * { message, pos } with pos pointing at the offending character.
 */
export function tokenize(input) {
  const src = String(input ?? '')
  const tokens = []
  let parenDepth = 0
  let last = null // last significant token

  const fail = (message, pos) => ({ ok: false, error: { message, pos } })

  if (src.trim().length === 0) {
    return fail('Expression is empty. Try something like A + B * (C - D).', 0)
  }

  for (let i = 0; i < src.length; i++) {
    const ch = src[i]

    if (ch === ' ' || ch === '\t') continue

    if (/[A-Za-z]/.test(ch)) {
      const value = ch.toUpperCase()
      if (last && (last.type === 'operand' || last.type === 'rparen')) {
        return fail(
          `Missing operator between "${last.type === 'operand' ? last.value : ')'}" and "${value}".`,
          i,
        )
      }
      tokens.push({ type: 'operand', value, pos: i })
      last = tokens[tokens.length - 1]
      continue
    }

    if (OPERATORS.has(ch)) {
      if (!last || last.type === 'operator' || last.type === 'lparen') {
        const where = !last
          ? 'Expression cannot start with an operator'
          : last.type === 'operator'
            ? `Operator "${ch}" cannot follow "${last.value}"`
            : `Operator "${ch}" cannot follow "("`
        return fail(`${where} — an operand is missing.`, i)
      }
      tokens.push({ type: 'operator', value: ch, pos: i })
      last = tokens[tokens.length - 1]
      continue
    }

    if (ch === '(') {
      if (last && (last.type === 'operand' || last.type === 'rparen')) {
        return fail(`Missing operator before "(" .`, i)
      }
      parenDepth++
      tokens.push({ type: 'lparen', value: '(', pos: i })
      last = tokens[tokens.length - 1]
      continue
    }

    if (ch === ')') {
      if (parenDepth === 0) {
        return fail('Unbalanced parentheses — unexpected ")".', i)
      }
      if (!last || last.type === 'operator' || last.type === 'lparen') {
        return fail('Missing operand before ")".', i)
      }
      parenDepth--
      tokens.push({ type: 'rparen', value: ')', pos: i })
      last = tokens[tokens.length - 1]
      continue
    }

    return fail(`Invalid character "${ch}". Only A–Z, + - * / and ( ) are allowed.`, i)
  }

  if (parenDepth > 0) {
    const openPos = tokens.filter((t) => t.type === 'lparen').length
    return fail(
      `Unbalanced parentheses — ${openPos} unclosed "(" .`,
      src.length - 1,
    )
  }

  if (!last || last.type === 'operator') {
    return fail('Expression ends with an operator — an operand is missing.', src.length - 1)
  }

  return { ok: true, tokens }
}
