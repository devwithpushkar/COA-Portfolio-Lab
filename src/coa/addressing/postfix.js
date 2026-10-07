const PRECEDENCE = { '+': 1, '-': 1, '*': 2, '/': 2 }

/**
 * Shunting-yard: convert validated token list (infix) to postfix.
 */
export function toPostfix(tokens) {
  const output = []
  const stack = []

  for (const token of tokens) {
    if (token.type === 'operand') {
      output.push(token)
    } else if (token.type === 'operator') {
      while (
        stack.length > 0 &&
        stack[stack.length - 1].type === 'operator' &&
        PRECEDENCE[stack[stack.length - 1].value] >= PRECEDENCE[token.value]
      ) {
        output.push(stack.pop())
      }
      stack.push(token)
    } else if (token.type === 'lparen') {
      stack.push(token)
    } else if (token.type === 'rparen') {
      while (stack.length > 0 && stack[stack.length - 1].type !== 'lparen') {
        output.push(stack.pop())
      }
      stack.pop() // discard '('
    }
  }

  while (stack.length > 0) {
    output.push(stack.pop())
  }

  return output
}

export function postfixToString(postfixTokens) {
  return postfixTokens.map((t) => t.value).join(' ')
}
