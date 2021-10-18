const {
  isAlpha,
  isSpace,
  isDigit,
  findNextAlphanumericSequence,
  findNextStringLiteral,
  findNextChar,
  findNextSymbol,
} = require("./utils")
const { KEYWORDS, CONSTS, SPECIALS, SYMBOLS } = require("./tokens")

function findNextToken(program) {
  while (isSpace(program.codeToRead[0])) {
    program.codeToRead = program.codeToRead.slice(1)
  }

  const nextChar = program.codeToRead[0]

  if (isAlpha(nextChar)) {
    const term = findNextAlphanumericSequence(program.codeToRead)
    program.codeToRead = program.codeToRead.slice(term.length)

    if (KEYWORDS[term]) return [KEYWORDS[term]]

    return [SPECIALS.ID, term]
  }

  if (isDigit(nextChar)) {
    const term = findNextAlphanumericSequence(program.codeToRead)
    program.codeToRead = program.codeToRead.slice(term.length)

    return [CONSTS.NUMERAL, Number(term)]
  }

  if (nextChar === '"') {
    const term = findNextStringLiteral(program.codeToRead)
    program.codeToRead = program.codeToRead.slice(term.length + 2)

    return [CONSTS.STRINGVAL, String(term)]
  }

  if (nextChar === "'") {
    const term = findNextChar(program.codeToRead)
    program.codeToRead = program.codeToRead.slice(term.length + 2)

    return [CONSTS.CHARACTER, String(term)]
  }

  const term = findNextSymbol(program.codeToRead)
  program.codeToRead = program.codeToRead.slice(term.length)

  if (SYMBOLS[term]) return [SYMBOLS[term]]

  return [SPECIALS.UNKNOWN]
}

function analyze(program) {
  let tokens = []
  while (program.codeToRead.trim().length > 0) {
    const [token, secondaryToken] = findNextToken(program)

    if (secondaryToken) {
      tokens.push([token, secondaryToken])
    } else {
      tokens.push([token])
    }
  }

  return { tokens }
}

module.exports = {
  analyze,
}
