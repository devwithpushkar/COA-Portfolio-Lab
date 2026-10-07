import { OP_NAMES } from './opnames.js'

/**
 * One-address (accumulator) instructions:
 *   LOAD a / OP b / STORE Tn
 * Intermediate results live in memory temporaries T1..Tn; the final
 * result is stored in the last temporary.
 */
export function generateOneAddress(postfix) {
  const instructions = []
  const stack = []
  let nextTemp = 1

  for (const token of postfix) {
    if (token.type === 'operand') {
      stack.push(token.value)
      continue
    }
    const b = stack.pop()
    const a = stack.pop()
    const temp = `T${nextTemp++}`
    instructions.push(`LOAD ${a}`)
    instructions.push(`${OP_NAMES[token.value]} ${b}`)
    instructions.push(`STORE ${temp}`)
    stack.push(temp)
  }

  return {
    instructions,
    count: instructions.length,
    result: stack[0],
  }
}
