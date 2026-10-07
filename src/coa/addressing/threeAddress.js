import { OP_NAMES } from './opnames.js'

/**
 * Three-address instructions: OP Rn, operand1, operand2
 * Every operation produces exactly one instruction writing to a fresh
 * temporary register.
 */
export function generateThreeAddress(postfix) {
  const instructions = []
  const stack = []
  let nextReg = 1

  for (const token of postfix) {
    if (token.type === 'operand') {
      stack.push(token.value)
      continue
    }
    const b = stack.pop()
    const a = stack.pop()
    const dest = `R${nextReg++}`
    instructions.push(`${OP_NAMES[token.value]} ${dest}, ${a}, ${b}`)
    stack.push(dest)
  }

  return {
    instructions,
    count: instructions.length,
    result: stack[0],
  }
}
