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


// O analisador sintático não está completo, falta gerar a action_table, existem funções
// para calcular first follow e a tabela auxiliar.
// syntactic baseado nas tabelas faz o procedimento de reconhecimento
let program = ["ID", "*", "(", "ID","+","ID", ")", "$"]
syntactic(program)
