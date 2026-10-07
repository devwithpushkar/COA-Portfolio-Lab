import { tokenize } from './tokenizer.js'
import { toPostfix, postfixToString } from './postfix.js'
import { generateThreeAddress } from './threeAddress.js'
import { generateTwoAddress } from './twoAddress.js'
import { generateOneAddress } from './oneAddress.js'
import { generateZeroAddress } from './zeroAddress.js'

/**
 * Full pipeline: infix expression → validated tokens → postfix →
 * instruction sequences for all four addressing organizations.
 *
 * Returns { ok: true, postfix, variables, three, two, one, zero }
 * or     { ok: false, error: { message, pos } }
 */
export function analyzeExpression(input) {
  const parsed = tokenize(input)
  if (!parsed.ok) return parsed

  const postfixTokens = toPostfix(parsed.tokens)
  const variables = [
    ...new Set(parsed.tokens.filter((t) => t.type === 'operand').map((t) => t.value)),
  ].sort()

  return {
    ok: true,
    postfix: postfixToString(postfixTokens),
    variables,
    three: generateThreeAddress(postfixTokens),
    two: generateTwoAddress(postfixTokens),
    one: generateOneAddress(postfixTokens),
    zero: generateZeroAddress(postfixTokens),
  }
}

export { tokenize, toPostfix, postfixToString }
