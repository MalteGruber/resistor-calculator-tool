


let two_combinations = `R+R,R|R`;
let three_combinations = `R+R+R,R+R|R,R|R|R,(R+R)|R`;
let four_combinations = `
R+R+R+R,
R|R+R+R,
R|R|R+R,
(R+R)|(R+R),
R|(R+R+R),
R|(R+R|R)
`;


const combinations = (arr, min = 1, max) => {
    const combination = (arr, depth) => {
        if (depth === 1) {
            return arr;
        } else {

            let r = combination(arr, depth - 1);

            const result = r.flatMap(
                (val) => {
                    return arr.map((char) => {

                        return [val, [char]].flat()
                    })
                }
            );
            return arr.concat(result);
        }
    };
    let c = combination(arr, max)
    return c.filter((val) => {
        if (val.length === undefined)
            return false
        return val.flat().length >= min
    }
    );
};







const LPAREN = "LPAREN"
const RPAREN = "RPAREN"
const PLUS = "PLUS"
const PARA = "PARA"
const NUMBER = "NUMBER"
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
        while ([PARA].includes(this.current_token.type)) {
            let token = this.current_token
            if (token.type == PARA) {
                this.eat(PARA)
            }
            /*else if( token.type == DIV){
                this.eat(DIV)
            }*/

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




function parse_expression(expression) {
    expression = expression + ""
    if (expression == "")
        return undefined

    
    let tokens = [];

    function get_type(c) {
        type = "";
        types = [["|", PARA], ["(", LPAREN], [")", RPAREN], ["+", PLUS]]
        types.forEach(e => { if (e[0] === c) { type = e[1] } });
        return type;
    }


    let number_in_progress=false
    let num_storage = ""
    /*Go through the expression charachter by character and create a token stream.
    For tokens that are more than a character long we need to store them, 
    for now its only number, so they are stored in num_storage. 
    */
    for (let i in expression) {

        let c = expression[i];

        var r = /\d+|m|M|k|u|E|\./;
        let is_number = c.match(r) != null;
        if (is_number) {
            num_storage += c;
        }
        number_in_progress = num_storage.length > 0;



        /*A full number token has been found!*/
        if (!is_number && number_in_progress) {

            tokens.push({ "token": num_storage, "type": NUMBER });
            num_storage = "";
            tokens.push({ "token": c, "type": get_type(c) });
        } else if (!is_number) {

            tokens.push({ "token": c, "type": get_type(c) });
        } else {
            //Numbers are stored above
        }
    }

    if (number_in_progress) {
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
    if(tokens.length==2&&tokens[0].type==NUMBER){
        return parse_number(tokens[0].token);
    }
        
    /*We now need to construct the binary tree that holds our expression*/
    let a = new Ast(tokens);
    tree = a.parse()


    function calculate(node) {
        let lhs = undefined;
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
        if (node.op.type == PARA) {

            return get_paralell_resistance(lhs, rhs)
        }
        if (node.op.type == PLUS) {
            return lhs + rhs
        }
        console.error("You should not be here!", node.op.type, node.op.type == PARA)


    }
    let res = calculate(tree);
    return res;
}

//parse_expression("(1.4+1)|5+42+1337|43|32");

let tests = [

    { exp: "(1+1)", assert: 2.0 },
    { exp: "(100+100+100)", assert: 300.0 },
    { exp: "1", assert: 1 },
    { exp: "1|1", assert: 1.0 },
    { exp: "1|1|1|1", assert: 0.25 },
    { exp: "1|1|1|1+1", assert: 1.25 },
    { exp: "1|1|(0.5+1|1)|1+1", assert: 1.25 },



    // {exp:"(1.4+1)|5+42+1337|43|32",assert:1.0},



]

tests.forEach(test => {
    console.log(test, "Result ->", parse_expression(test.exp))
})




function calculate_all_voltages(cmd) {
    let r_cnt = (cmd.match(/o/g) || []).length;
    let combinations = [1, 2, 3];
}


const nFormatter = (num, digits) => {


    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
    const item = lookup.slice().reverse().find((item) => {
        return num >= item.value
    })
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0"
}


function parse_number(n) {
    let m = parseFloat(n)

    const lookup = [
        { value: 1e-9, symbol: "n" },
        { value: 1e-6, symbol: "u" },  
        { value: 1e-3, symbol: "m" },
        { value: 1, symbol: "" },

        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" }
    ]
    lookup.forEach(e => {
        if (n.charAt(n.length - 1).includes(e.symbol)) {
            m *= e.value;
        }
    })
    return m


}

console.log("Extracted number", parse_number("13.3E3"))
function get_paralell_resistance(a, b) {
    return 1.0 / (1 / a + 1 / b)
}

function parse_and_calc() {
    let inp = $("#expression").val()
    let voltage = $("#resistor_calc_voltage").val()
    let current = $("#resistor_calc_current").val()

    let resistance=parse_expression(inp)
    $("#result").text(resistance)

    if(voltage&&current)
        alert("Please enter current or voltage, but not both!")
    if(voltage){
        let current=voltage/resistance;
        let power=voltage*current;
        $("#result").text(`${resistance} Ohm, Current ${current} A. Power ${power} W`)
    }else if(current){
        let voltage=current*resistance;
        let power=voltage*current;
        $("#result").text(`${resistance} Ohm, Voltage ${voltage} V. Power ${power} W`)    
    }
}

$('#expression').keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        parse_and_calc();
    }
});


class BestMatchTracker {

    constructor() {
        this.good_matches = [];
        this.best_match_error = 9999999;
        this.num_matches = 4;
    }
    evaluate_match(value, target, info) {
        let error = Math.abs(value - target);
        if (error < this.best_match_error) {
            this.best_match_error = error;
            this.good_matches.push({ error: error, value: value, target: target, info: info })
            if (this.good_matches.length > this.num_matches) {
                this.good_matches.shift();
            }
        }
    }

}

const urlParams = new URLSearchParams(window.location.search);
resistors = [] //[100, 22, 470, 4700, 100000, 1000, 10000, 120, 18000, 2200, 2.2, 330, 150, 1E6]
let res_param =urlParams.get('resistors')

if(res_param){
    res_param=res_param.split(",")

res_param=res_param.map(parse_number);

console.log("Got the following resistors",res_param)
resistors=res_param
}
function find_best_match(target, ) {
    let bmt = new BestMatchTracker();

    function do_combinations(cnt, possible_combinations) {
        let c = combinations(resistors, cnt, cnt);
        possible_combinations.split(",").forEach(comb_exp => {

            //console.log(comb_exp)

            c.forEach(e => {
                let expression = comb_exp.trim();

                e.forEach(r => {
                    expression = expression.replace("R", r).trim();
                });
                let value = undefined;
                if (expression) {
                    //    console.log(expression)
                    value = parse_expression(expression);

                    bmt.evaluate_match(value, target, expression);
                } else {
                    console.error(comb_exp)
                }
                //console.log(value, comb_exp, "->", expression);
            });
        })
    }
    do_combinations(2, two_combinations)
    do_combinations(3, three_combinations)
    do_combinations(4, four_combinations)
    console.log(bmt.good_matches)
    return bmt.good_matches
}

function btn_calc_eqvivalen() {
    let num=parse_number($("#target_resistance").val());

    let bm = find_best_match(num);
    console.log(num,bm)
    
    let report = ""
    
    bm.forEach(r => {
        report += `<b>${r.value}Ω </b><p> error=${r.error}Ω, Using this combination: ${r.info}</p><br>`;
    })
    $("#best_match").html(report)
    if(bm.length==0)
        alert("Please add your resistors in the URL!")
}

function get_power_string(vin,vout,rlow,rhigh){
    let i=vin/(rlow*rhigh)

    let o={plow:vout*i,phigh:(vin-vout)*i,current:i};
    return `Power in Rhigh=${o.phigh} W, power in Rlow=${o.plow} W, current=${o.current} A`

}
function btn_calc_series() {


    let rhigh = parse_expression($("#rhigh").val());
    let rlow = parse_expression($("#rlow").val());
    let vin = parse_expression($("#vin").val());
    let vout = parse_expression($("#vout").val());

    console.log("x")
    function value_not_provided(val) {
        return val == undefined
    }

    //vout*rhigh+vout*rlow=vin*rlow

    //rlow=(vout*rhigh)/(vin-vout)
    

    let result_id="";
    let result_val="COOL";
    if (value_not_provided(rhigh)) {
        console.log("calc rhigh")
         rhigh = (vin*rlow-rlow*vout)/vout
        $("#div_result").text("R High=" + rhigh + " Ohm, "+get_power_string(vin,vout,rlow,rhigh))
        result_id="rhigh"
        result_val=rhigh;
    }

    if (value_not_provided(rlow)) {
        console.log("calc rlow")
         rlow=(vout*rhigh)/(vin-vout)
        $("#div_result").text("R Low=" + rlow + " Ohm, "+get_power_string(vin,vout,rlow,rhigh))
        result_id="rlow"
        result_val=rlow;
    }

    if (value_not_provided(vin)) {
        console.log("vin ")
        result_id="vin";
         vin=(vout*rhigh+vout*rlow)/rlow;
        $("#div_result").text("Vin=" + vin + " V, "+get_power_string(vin,vout,rlow,rhigh))
        result_val=vin;
    }


    if (value_not_provided(vout)) {
        console.log("vout ")
         vout=vin/(rlow+rhigh)*rlow;
        $("#div_result").text("Vout=" + vout + " V, "+get_power_string(vin,vout,rlow,rhigh))
        result_id="vout"
        result_val=vout;
    }
    $("#"+result_id).attr("placeholder","Result: "+result_val)
    


}
