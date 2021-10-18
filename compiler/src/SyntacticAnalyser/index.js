const { GRAMMAR_SYMBOLS, ACTION_TABLE, AUXILIAR_TABLE, ALL_SYMBOLS } = require("./action_table")

let ACC = 6

function syntactic(program){
    //ALGORITHM
    let size = program.length
    let i = 0
    let q = [0]
    let map_symbols = GRAMMAR_SYMBOLS
    do{
        console.log(q)
        let next_symbol = map_symbols[program[i]]
        let last = q[q.length - 1]
        if(last == ACC) break
        let next_act = ACTION_TABLE[last][next_symbol-1]
        if(next_act > 0){   
            i += 1
            q.push(next_act)
        }else if(next_act < 0){
            let reduc = -Number(next_act)
            for(let j = 0; j < AUXILIAR_TABLE[reduc-1][1]; j++){
                q.pop()
            }
            q.push(ACTION_TABLE[q[q.length-1]][map_symbols[AUXILIAR_TABLE[reduc-1][2]]-1])
        }else{
            console.log("syntax error")
            let expected = []
            for(let j in ACTION_TABLE[last]){
                if(ACTION_TABLE[last][j] > 0){
                    expected.push(ALL_SYMBOLS[j])
                }
            }
            let expected_string = ""
            for(let j in expected){
                expected_string += expected[j]
                if((Number(j) + 1) < expected.length) expected_string += " or "
            }
            console.log(expected_string)
            return;
        }
    }while(i < size)
    console.log("sucess (Syntax analysis)")
}


module.exports = {
    syntactic
}
