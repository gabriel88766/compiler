const { table, Console } = require('console')
const fs = require('fs')
const GRAMMAR_SYMBOLS = require('../action_table/grammar_symbols')

const GRAMMAR = [
    ["P", "LDE", "$"],
    ["LDE", "LDE", "DE"],
    ["LDE", "DE"],
    ["DE", "DF"],
    ["DE", "DT"],
    ["T", "INTEGER"],
    ["T", "CHAR"],
    ["T", "BOOLEAN"],
    ["T", "STRING"],
    ["T", "IDU"],
    ["DT", "TYPE", "IDD", "EQUALS", "ARRAY", "LEFT_SQUARE", "NUM", "RIGHT_SQUARE", "OF", "T"],
    ["DT", "TYPE", "IDD", "EQUALS", "STRUCT", "LEFT_BRACES", "DC", "RIGHT_BRACES"],
    ["DT", "TYPE", "IDD", "EQUALS", "T"],
    ["DC", "DC", "SEMI_COLON", "LI", "COLON", "T"],
    ["DC", "LI", "COLON", "T"],


]

const TEST_GRAMMAR = [
    ["S", "E", "$"],
    ["E", "E", "+", "T"],
    ["E", "T"],
    ["T", "T", "*", "F"],
    ["T", "F"],
    ["F", "(", "E", ")"],
    ["F", "ID"]
]

const ANOTHER_GRAMMAR_1 = [
    ["S", "A", "$"],
    ["A", "a", "B", "A'"],
    ["A'", "d", "A'"],
    ["A'", "empty"],
    ["B", "b"],
    ["C", "g"]
]

const ANOTHER_GRAMMAR_2 = [
    ["S", "a", "B", "D", "h"],
    ["B", "c", "C"],
    ["C", "b", "C"],
    ["C", "empty"],
    ["D", "E", "F"],
    ["E", "g"],
    ["E", "empty"],
    ["F", "f"],
    ["F", "empty"],
]

const ANOTHER_GRAMMAR_3 = [
    ["S", "A", "a", "A", "b"],
    ["S", "B", "b", "B", "a"],
    ["A", "empty"],
    ["B", "empty"],
]

const LAST_GRAMMAR = [
    ["S", "E", "$"],
    ["E", "T", "E'"],
    ["E'", "+", "T", "E'"],
    ["E'", "empty"],
    ["T", "F", "T'"],
    ["T'", "*", "F", "T'"],
    ["T'", "empty"],
    ["F", "(", "E", ")"],
    ["F", "ID"]
]

let first = {}
let follow = {}
let not_terminals_rules_index = {}
let action_table = [[]]
let auxiliar_table = []
let map_symbols = {}
let all_symbols = []
let ACC
//let rules = ANOTHER_GRAMMAR_2
let rules = TEST_GRAMMAR

function generate_tables(){
    
    
    index = 1

    for(let i in rules){
        if(i == 0){
            not_terminals_rules_index[rules[i][0]] = [i]
            continue
        } 
        element = []
        element.push(i)
        element.push(rules[i].length-1)
        element.push(rules[i][0])
        auxiliar_table.push(element)
        if(!map_symbols[rules[i][0]]){
            map_symbols[rules[i][0]] = index
            all_symbols.push(rules[i][0])
            if(!not_terminals_rules_index[rules[i][0]]) not_terminals_rules_index[rules[i][0]] = [i]
            else not_terminals_rules_index[rules[i][0]].push(i)
            index += 1
        }else{
            not_terminals_rules_index[rules[i][0]].push(i)
        }
    }

    calc_first_follow()

    console.log(auxiliar_table)
    console.log(not_terminals_rules_index)
    writetable(auxiliar_table, "auxiliar_table")

    for(let i in rules){
        if(i == 0) continue
        for(let j in rules[i]){
            if(!map_symbols[rules[i][j]]){
                map_symbols[rules[i][j]] = index
                all_symbols.push(rules[i][j])
                index += 1
            }
        }
    }

    map_symbols["$"] = index
    all_symbols.push("$")
    console.log(map_symbols)
    console.log(all_symbols)

    states_of_symbols = []
    symbol_of_state = []
    rules_of_state = [[[]]]
    rules_of_state[0] = [[0, 1]]
    rules_used = {}

    let p1 = 0
    let p2 = 1
    do{
       
    }while(p1 !== p2)
    console.log("simbolos dos estados")
    console.log(symbol_of_state)
    console.log(action_table)

    

    //writetable(action_table, "table")
}

function writetable(table, name){
    file = 'src/SyntaticalAnalyser/action_table_generator/' + name
    fs.writeFile(file, "[[" + table.join("],[") + "]]", err => {
        if (err) {
          console.error(err)
          return
        }
      })
}


//not_terminals_rules_index[symbol][i] = ith rule of not terminal symbol = "symbol"

function calc_first(symbol){
    if(!first[symbol]){
        first[symbol] = []
    } 
    for(let i in not_terminals_rules_index[symbol]){
        let rule = not_terminals_rules_index[symbol][i]
        if(symbol === rules[rule][1]){
            continue
        } 
        for(let j in rules[rule]){
            if(j == 0) continue
            let next_symbol = rules[rule][j]
            if(not_terminals_rules_index[next_symbol]){
                first_of_right = calc_first(next_symbol)
                if(first_of_right.find(e => e == "empty")){
                    for(let k in first_of_right){
                        if((first_of_right[k] == "empty") && ((Number(j) + 1) != rules[rule].length)) continue
                        if(!first[symbol].find(e => e == first_of_right[k])){
                            first[symbol].push(first_of_right[k])
                        }
                    }
                }else{
                    for(let k in first_of_right){
                        if(!first[symbol].find(e => e == first_of_right[k])){
                            first[symbol].push(first_of_right[k])
                        }
                    }
                    break
                }
            }else{
                first[symbol].push(next_symbol)
                break
            }   
        }
    }
    return first[symbol]
}

function calc_follow(){
    for(i in not_terminals_rules_index){
        follow[i] = []
    }
    follow[rules[0][0]] = ["$"]
    do {
        isSetChanged = false
        for(let i in rules){
            left = rules[i][0]
            for(let index in rules[i]){
                if(index == 0) continue
                let item = rules[i][index]
                if(!not_terminals_rules_index[item]) continue
                next_index = Number(index) + 1
                if(next_index < rules[i].length){
                    let next_item = rules[i][next_index]
                    if(not_terminals_rules_index[next_item]){
                        let seq = []
                        for(let j = next_index; j < rules[i].length; j++){
                            seq.push(rules[i][j])
                        }
                        let first_seq = calc_first_seq(seq)
                        if(first_seq.find(e => e === "empty")){
                            for(let j in follow[left]){
                                if(!follow[item].find(e => e == follow[left][j])){
                                    isSetChanged = true
                                    follow[item].push(follow[left][j])
                                    
                                } 
                            }
                        }
                        for(j in first_seq){
                            if(first_seq[j] === "empty") continue
                            if(!follow[item].find(e => e == first_seq[j])){
                                isSetChanged = true
                                follow[item].push(first_seq[j])
                            }                            
                        }
                    }else{
                        if(!follow[item].find(e => e == next_item)){
                            isSetChanged = true
                            follow[item].push(next_item)
                        }    
                    }
                }else{
                    for(let j in follow[left]){
                        let next_item = follow[left][j]
                        if(!follow[item].find(e => e == next_item)){
                            isSetChanged = true
                            follow[item].push(next_item)
                        } 
                    }
                }
            }
        }
    } while (isSetChanged);
}

function calc_first_seq(seq){
    ans = []
    for (let i = 0; i < seq.length; i++) {
        let c = seq[i]
        if(not_terminals_rules_index[c]){
            for(let j in first[c]){
                if((first[c][j] == "empty") && ((Number(i) + 1) != seq.length)){
                    continue
                } 
                if(!ans.find(e => e == first[c][j])){
                    ans.push(first[c][j])
                }
            }
            if(!first[c].find(e => e == "empty")){
                break;
            }
        }else{
            ans.push(c) 
            break
        }
    }
    return ans
}

function calc_first_follow(){
    for(let i in not_terminals_rules_index){
        if(!first[i]){
            calc_first(i)
        }
    }
    calc_follow()
    console.log("First")
    console.log(first)
    console.log("Follow")
    console.log(follow)
}


generate_tables()


function test_grammar_test(){
    let program = ["ID", "*", "(", "ID","+","ID", ")", "$"]

    //ALGORITHM
    let size = program.length
    let i = 0
    let q = [0]
    do{
        let next_symbol = map_symbols[program[i]]
        let last = q[q.length - 1]
        if(last == ACC) break
        let next_act = action_table[last][next_symbol]
        if(next_act > 0){   
            i += 1
            q.push(next_act)
        }else if(next_act < 0){
            let reduc = -Number(next_act)
            for(let j = 0; j < auxiliar_table[reduc-1][1]; j++){
                q.pop()
            }
            q.push(action_table[q[q.length-1]][map_symbols[auxiliar_table[reduc-1][2]]])
        }else{
            console.log("syntax error")
            let expected = []
            for(let j in action_table[last]){
                if(action_table[last][j] > 0){
                    expected.push(all_symbols[j])
                }
            }
            let expected_string = ""
            for(let j in expected){
                expected_string += expected[j]
                if((Number(j) + 1) < expected.length) expected_string += " or "
            }
            console.log(expected_string)
        }
    }while(i < size)
    console.log("sucess (Syntax analysis)")
}