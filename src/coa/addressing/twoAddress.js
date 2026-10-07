import { OP_NAMES } from './opnames.js'

/**
 * Two-address instructions: OP dest, source  (dest doubles as an operand).
 *
 * In postfix evaluation every intermediate value is consumed exactly once,
 * so when the first operand already lives in a temporary register, that
 * register can be reused in place as the destination — saving the MOV.
 * Only when the first operand is a memory variable (or a still-live
 * register) do we need MOV Rn, a before OP Rn, b.
 */
export function generateTwoAddress(postfix) {
  const instructions = []
  const stack = []
  let nextReg = 1

  const isTemp = (v) => /^R\d+$/.test(v)

  for (const token of postfix) {
    if (token.type === 'operand') {
      stack.push(token.value)
      continue
    }

    const b = stack.pop()
    const a = stack.pop()
    const op = OP_NAMES[token.value]

    let dest
    if (isTemp(a)) {
      // `a` was produced by an earlier instruction and dies here — reuse it.
      dest = a
      instructions.push(`${op} ${dest}, ${b}`)
    } else {
      dest = `R${nextReg++}`
      instructions.push(`MOV ${dest}, ${a}`)
      instructions.push(`${op} ${dest}, ${b}`)
    }
    stack.push(dest)
  }

  return {
    instructions,
    count: instructions.length,
    result: stack[0],
  }
}
