module.exports = module.exports = {
    scope
}

function scope(tokens){
    let in_struct = false
    let in_function_head = false
    let in_var_dec = false
    let in_type_dec = false
    let IDD = {}
    let all_symbols = []
    let block_IDD = []
    let current_level = 0 
    for(let i in tokens){
        if(tokens[i][0] == "STRUCT"){
            in_struct = true
            continue
        }
        if(tokens[i][0] == "FUNCTION"){
            in_function_head = true
            continue
        }
        if(tokens[i][0] == "VAR"){
            in_var_dec = true
        }
        if(tokens[i][0] == "RIGHT_BRACES"){
            if(in_struct) in_struct = false
            current_level -= 1
            for(let j in all_symbols){
                let symbol = all_symbols[j]
                while((IDD[symbol]) && (IDD[symbol].length != 0) && (IDD[symbol][IDD[symbol].length - 1] > current_level)){
                    IDD[symbol].pop()
                }
            }
        }
        if(tokens[i][0] == "TYPE"){
            in_type_dec = true
        }
        if(tokens[i][0] == "LEFT_BRACES"){
            if(in_function_head){
                in_function_head = false
            }else{
                current_level += 1
            }

        }
        if(tokens[i][0] == "LEFT_PARENTHESIS"){
            if(in_function_head) current_level += 1;
        }
        if(tokens[i][0] == "SEMI_COLON"){
            in_var_dec = false
        }
        
        if(tokens[i][0] == "ID"){
            let in_struct_dec = false
            let symbol = tokens[i][1]
            all_symbols.push(symbol)
            if(in_struct){
                if(tokens[i-1][0] != "COLON"){
                    in_struct_dec = true
                }
            }
            if(in_var_dec || in_function_head || in_struct_dec  || in_type_dec){
                if(IDD[symbol] && (IDD[symbol][IDD[symbol].length - 1 ]) == current_level){
                    console.log("erro redecl - escopo item " + i)
                    console.log(symbol)
                    return;
                }else{
                    if(!IDD[symbol]) IDD[symbol] = [current_level]
                    else IDD[symbol].push(current_level)
                }
                in_type_dec = false
            }else{
                if(symbol == "min") console.log(IDD[symbol])
                if(!IDD[symbol] || (IDD[symbol].length == 0)){
                    console.log("erro no escopo, nao decl, item " + i)
                    return
                }
            }
        }
    }
    console.log("Successo - escopo")
}


// examples/debugscope, esperado erro no primeiro uso de min
// examples/debugscope2, esperado erro redecl min
// examples/example, sucesso
// examples/debugscope3, sucesso