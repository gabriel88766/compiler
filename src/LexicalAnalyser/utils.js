module.exports = {
  isDigit: function (char) {
    return /\d/.test(char)
  },

  isAlpha: function (char) {
    return /[a-zA-Z_]/.test(char)
  },

  isAlphanumeric: function (char) {
    return /\w/.test(char)
  },

  isSpace: function (char) {
    return /\s/.test(char)
  },

  findNextAlphanumericSequence: function (str) {
    return /\w+/.exec(str)[0]
  },

  findNextNumeral: function (str) {
    return /\d+/.exec(str)[0]
  },

  findNextStringLiteral: function (str) {
    return /\w+"/.exec(str)[0].replace('"', "")
  },

  findNextChar: function (str) {
    return /'\w/.exec(str)[0].replace("'", "")
  },

  findNextSymbol: function (str) {
    return /([^\w\s])+/.exec(str)[0]
  },
}
