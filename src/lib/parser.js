
const LPAREN = "LPAREN"
const RPAREN = "RPAREN"
const PLUS = "PLUS"
const PARALLEL = "PARALLEL"
const NUMBER = "NUMBER"
const TIMES = "TIMES"
const DIVIDE = "DIVIDE"


const DONE = "DONE"

class Ast {
    //Based of https://ruslanspivak.com/lsbasi-part7/
    get_next_token() {
        return this.tokens.shift()
    }
    constructor(tokens) {
        this.tokens = tokens;
        this.current_token = this.get_next_token();
    }


    error() {
        console.error("Parsing errror", this.current_token)
    }
    eat(token_type) {
        if (this.current_token.type == token_type)
            this.current_token = this.get_next_token()
        else {
            this.error()
        }

    }
    factor() {
        //"""factor : NUMBER | LPAREN expr RPAREN"""
        let token = this.current_token;
        if (token.type == NUMBER) {
            this.eat(NUMBER);
            return token;
        }
        else if (token.type == LPAREN) {
            this.eat(LPAREN);
            let node = this.expr()
            this.eat(RPAREN)
            return node
        }

    }
    term() {
        //"""term : factor ((MUL | DIV) factor)*"""
        let node = this.factor()


        while ([PARALLEL, TIMES, DIVIDE].includes(this.current_token.type)) {
            let token = this.current_token
            if (token.type == PARALLEL) {
                this.eat(PARALLEL)
            }
            else if (token.type == TIMES) {
                this.eat(TIMES)
            }
            else if (token.type == DIVIDE) {
                this.eat(DIVIDE)
            }

            node = { left: node, op: token, right: this.factor() }

        }
        return node
    }
    expr() {
        /*
        expr   : term ((PLUS | MINUS) term)*
        term   : factor ((MUL | DIV) factor)*
        factor : INTEGER | LPAREN expr RPAREN
        */
        let node = this.term()

        while ([PLUS].includes(this.current_token.type)) {
            let token = this.current_token
            if (token.type == PLUS) {
                this.eat(PLUS)
            }/*else if(token.type == MINUS){
                this.eat(MINUS)
            }*/

            node = { left: node, op: token, right: this.term() }
        }
        return node
    }
    parse() {
        return this.expr()
    }
}


function get_paralell_resistance(a, b) {
    return 1.0 / (1 / a + 1 / b)
}

export const lookup = [

    //{ value: 1e-24, symbol: "y" , name: "Yocto"},
    //{ value: 1e-21, symbol: "z" , name: "Zepto"},
    //{ value: 1e-18, symbol: "a" , name: "Atto"},
    { value: 1e-15, symbol: "f", name: "Femto" },
    { value: 1e-12, symbol: "p", name: "Pico" },
    { value: 1e-9, symbol: "n", name: "Nano" },
    { value: 1e-6, symbol: "u", name: "Micro" },
    { value: 1e-3, symbol: "m", name: "Milli" },
    { value: 1, symbol: "", name: "" },

    { value: 1e3, symbol: "k", name: "Kilo" },
    { value: 1e6, symbol: "M", name: "Mega" },
    { value: 1e9, symbol: "G", name: "Giga" },
    { value: 1e12, symbol: "T", name: "Tera" },
    //{ value: 1e15, symbol: "P" , name: "Peta"},
    //{ value: 1e18, symbol: "E" , name: "Exa"},
    //{ value: 1e21, symbol: "Z" , name: "Zetta"},
    //{ value: 1e24, symbol: "Y" , name: "Yotta"},
    //{ value: 1e27, symbol: "R", name: "Ronna"},
    //{ value: 1e30, symbol: "Q", name: "Queta"},


]

export function parse_number(n) {
    let m = parseFloat(n) //This ignores anything after a letter..
    //If the last character is e or E we need to handle it differently
    let exponentChars = "eE";
    if (exponentChars.includes(n)) {
        throw new Error("Missing Base")
    }
    if (exponentChars.includes(n.charAt(n.length - 1))) {
        throw new Error("Missing Exponent")
    }
    lookup.forEach(e => {
        if (n.charAt(n.length - 1).includes(e.symbol)) {
            m *= e.value;
        }
    })
    return m
}

export function parse_expression(expression, caluclation_type = "resistance") {

    expression = expression + ""
    if (expression == "")
        return undefined


    let tokens = [];

    function get_type(c) {
        let type = undefined;
        let types = [["|", PARALLEL], ["(", LPAREN], [")", RPAREN], ["+", PLUS], ["*", TIMES], ["/", DIVIDE]]
        types.forEach(e => { if (e[0] === c) { type = e[1] } });
        if (type === undefined)
            throw new Error('"' + c + '" not valid');
        return type;
    }


    let number_in_progress = false
    let num_storage = ""
    /*Go through the expression charachter by character and create a token stream.
    For tokens that are more than a character long we need to store them, 
    for now its only number, so they are stored in num_storage. 
    */
    let allowed_letters_in_number = "0123456789.-";
    allowed_letters_in_number += "eE";

    lookup.forEach(e => { allowed_letters_in_number += e.symbol })
    for (let i in expression) {

        let c = expression[i];
        if (c === " ")
            continue;

        //var r = /\d+|m|M|k|u|E|\./;
        //let is_number = c.match(r) != null;
        let is_number = allowed_letters_in_number.includes(c);

        if (is_number) {
            num_storage += c;
        }
        number_in_progress = num_storage.length > 0;



        /*A full number token has been found!*/

        if (!is_number && number_in_progress) {

            tokens.push({ "token": num_storage, "type": NUMBER });
            num_storage = "";
            number_in_progress = false;
            tokens.push({ "token": c, "type": get_type(c) });
        } else if (!is_number) {
            tokens.push({ "token": c, "type": get_type(c) });
        } else {
            //Numbers are stored above
        }
        // console.log(c,is_number,number_in_progress,num_storage,JSON.stringify(tokens))
    }

    if (number_in_progress) {
        // console.log("Final number push")
        tokens.push({ "token": num_storage, "type": NUMBER });
    }




    tokens.push({ "type": DONE })
    //console.log(expression,JSON.stringify(tokens))

    /*Cool, we have the token stream, it will look something like this
    (10+1) gives a toke stream like this
    [
        {"token":"(","type":"LPAREN"},
        {"token":"10","type":"NUMBER"},
        {"token":"+","type":"PLUS"},
        {"token":"1","type":"NUMBER"},
        {"token":")","type":"RPAREN"},
        {"token":"","type":"NUMBER"},
        {"type":"DONE"}]
    */



    //Dumb hotfix to be able to calculate expressions such as "1".
    if (tokens.length == 2 && tokens[0].type == NUMBER) {
        return parse_number(tokens[0].token);
    }

    /*We now need to construct the binary tree that holds our expression*/
    let a = new Ast(tokens);
    let tree = a.parse()

    function calculate(node) {

        let lhs = undefined;

        /*We must have both the left and right leafs for the expression to be complete*/
        if (node.left === undefined || node.right === undefined) {

            throw new Error("Incomplete expression")
        }

        if (node.left.type == NUMBER) {
            lhs = parse_number(node.left.token)
        } else {
            lhs = calculate(node.left);
        }
        let rhs = undefined

        if (node.right.type == NUMBER) {
            rhs = parse_number(node.right.token);
        } else {
            rhs = calculate(node.right)
        }

        if (node.op.type == PARALLEL) {
            if (caluclation_type === "resistance") {

                return get_paralell_resistance(lhs, rhs)
            } else {
                return lhs + rhs;
            }
        }

        if (node.op.type == PLUS) {
            if (caluclation_type === "resistance") {
                return lhs + rhs;
            } else {
                return get_paralell_resistance(lhs, rhs)

            }
        }

        if (node.op.type == TIMES) {
            return lhs * rhs
        }
        if (node.op.type == DIVIDE) {
            return lhs / rhs
        }

        console.info("You should not be here!", node.op.type, node.op.type == PARALLEL)
    }



    let res = "Parsing Error"
    try {
        res = calculate(tree);
    } catch (err) {
        console.error("PARSING ERROR")

        console.log(err)
        console.log(JSON.stringify(tree))
        return "Parsing error: " + err.message
    }
    return res;

}
