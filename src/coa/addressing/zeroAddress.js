import { OP_NAMES } from './opnames.js'

/**
 * Zero-address (stack machine) instructions:
 *   PUSH a / PUSH b / OP
 * Operands are implicitly the top two stack entries; the result is
 * pushed back and the final value sits on the top of the stack.
 */
export function generateZeroAddress(postfix) {
  const instructions = []
  const depth = { current: 0, max: 0 }
  const stack = []

  for (const token of postfix) {
    if (token.type === 'operand') {
      instructions.push(`PUSH ${token.value}`)
      stack.push(token.value)
      depth.current++
      depth.max = Math.max(depth.max, depth.current)
      continue
    }
    stack.pop()
    stack.pop()
    instructions.push(OP_NAMES[token.value])
    stack.push('(stack top)')
    depth.current-- // two popped, one pushed
  }

  return {
    instructions,
    count: instructions.length,
    result: 'top of stack',
    maxStackDepth: depth.max,
  }
}
