const fs = require("fs")
const { analyze } = require("./src/LexicalAnalyser")

const file = process.argv[2]
const code = fs.readFileSync(file).toString()

analyze({
  codeToRead: code,
  IDTable: {},
})
