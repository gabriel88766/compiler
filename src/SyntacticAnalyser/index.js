const { GRAMMAR_SYMBOLS, ACTION_TABLE } = require("./action_table")

function syntactic(tokens){
    q = 0
    for(let value in ACTION_TABLE){
        console.log(ACTION_TABLE[value])
    }
    for(let i in tokens){

        console.log(tokens[i] )
        console.log(GRAMMAR_SYMBOLS[tokens[i][0]])
    }
}

module.exports = {
    syntactic
}
