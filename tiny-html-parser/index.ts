enum TokenType {
  START_TAG,
  END_TAG,
  TEXT,
  GLOBAL,
}
type Token = {
  value: string
  type: number
  children?: Token[]
}
const HTML_REG = {
  startTag: /^<[a-z]+>/,
  endTag: /^<\/[a-z]+>/,
}
// tokenizer
const htmlToToken: (html: string) => Token[] = (
  html,
) => {
  const tokens = []

  while (html) {
    if (html.startsWith('<')) {
      let match = null
      let value = ''
      if (
        (match = html.match(HTML_REG.startTag)) &&
        (value = match[0].slice(1, -1))
      ) {
        tokens.push({
          value,
          type: TokenType.START_TAG,
        })
        html = html.slice(value.length + 2)
      } else if (
        (match = html.match(HTML_REG.endTag)) &&
        (value = match[0].slice(2, -1))
      ) {
        tokens.push({
          value,
          type: TokenType.END_TAG,
        })
        html = html.slice(value.length + 3)
      } else {
        throw new Error('暂未处理的情况')
      }
    } else {
      const textEndIndex = html.indexOf('<')
      if (textEndIndex > 0) {
        tokens.push({
          value: html.slice(0, textEndIndex),
          type: TokenType.TEXT,
        })
        html = html.slice(textEndIndex)
      } else {
        tokens.push({
          value: html,
          type: TokenType.TEXT,
        })
        html = ''
      }
    }
  }

  return tokens
}
const pushChild = (
  prevToken: Token,
  token: Token,
) => {
  if (!prevToken.children) {
    prevToken.children = []
  }
  prevToken.children.push(token)
}
// parser
const tokenToAst: (tokens: Token[]) => any = (
  tokens,
) => {
  let index = 0
  let token = null
  const stack = [
    {
      value: '',
      type: TokenType.GLOBAL,
    },
  ]

  while ((token = tokens[index])) {
    const prevToken = stack[stack.length - 1]
    switch (token.type) {
      case TokenType.START_TAG:
        if (
          prevToken &&
          [
            TokenType.GLOBAL,
            TokenType.START_TAG,
          ].includes(prevToken.type)
        ) {
          pushChild(prevToken, token)
        }
        stack.push(token)
        break
      case TokenType.END_TAG:
        if (
          prevToken &&
          [
            TokenType.GLOBAL,
            TokenType.START_TAG,
          ].includes(prevToken.type)
        ) {
          stack.pop()
        }
        break
      case TokenType.TEXT:
        pushChild(prevToken, token)
        break
    }
    index++
  }

  return stack[0]
}

const html = `
<html>
<body>
    <div>1</div>
    <div>2</div>
</body>
</html>
`
const tokens = htmlToToken(html)
const ast = tokenToAst(tokens)
console.log(JSON.stringify(ast))
