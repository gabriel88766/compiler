const fs = require("fs")
const { analyze } = require("./src/LexicalAnalyser")
const { syntactic } = require("./src/SyntacticAnalyser")
const { scope } = require("./src/ScopeAnalyser")
const file = process.argv[2]
const code = fs.readFileSync(file).toString()

const tokens = analyze({
  codeToRead: code,
  IDTable: {},
})

console.log(tokens)

//console.log("deu certo")
//syntatical(tokens.tokens)

scope(tokens.tokens)

console.log("teste")

let program = ["ID", "*", "(", "ID","+","ID", ")", "$"]
syntactic(program)