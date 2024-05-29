


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




//parse_expression("(1.4+1)|5+42+1337|43|32");

let tests = [

    { exp: "(1+1)", assert: 2.0 },
    { exp: "(100+100+100)", assert: 300.0 },
    { exp: "1", assert: 1 },
    { exp: "1|1", assert: 0.5 },
    { exp: "1|1|1|1", assert: 0.25 },
    { exp: "1|1|1|1+1", assert: 1.25 },
    { exp: "1|1|(0.5+1|1)|1+1", assert: 1.25 },

    { exp: "1k*2k", assert: 1000*2000 },
    { exp: "3*7k+1", assert: 3*7e3+1 },
    { exp: "2+3*7k+1", assert: 2+3*7e3+1 },
    { exp: "2+3*7k+1|1", assert: 2+3*7e3+0.5 },
    { exp: "(1|1)", assert: 0.5},
    { exp: "(1|1)*2", assert: 1},
    { exp: "2*(1|1)", assert: 1},
    { exp: "1+2*(1|1)", assert: 2},
    { exp: "10+2*2+(1|1)", assert: 10+2*2+0.5},
    { exp: "7*3", assert: 7*3},
    { exp: "7*3/2", assert: 7*3/2},
    { exp: "7/11*3/2", assert: 7/11*3/2},
    { exp: "7/11*3/2+1", assert: 7/11*3/2+1},
    { exp: "(7/11*3/2+1)/5", assert: (7/11*3/2+1)/5},   

]

pass=true;
tests.forEach(test => {
   
    let result=parse_expression(test.exp)
    if(result!=test.assert){
        console.error("Test failed!!")
        console.log("Test:",JSON.stringify(test), "Result:",result,"Expected",test.assert)
       pass=false;
    }
})
if (pass){
    console.log("All tests passed!")
}else{
    alert("Test failed")
}

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


function stringify_number(n) {

    if (isNaN(n))
    return "NaN ";
    if(!isFinite(n))
    return n;


    let prefix=undefined
    let prev_prefix=prefix;
    let found=false;
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
    /*
    Assumes prefixes are sorted smalest to largest
    */
    lookup.forEach(e => {
        if(n<e.value*1000 && !found){
            console.log(n,e.value*1e3)
            prefix=e;
            found=true;
        }
        prev_prefix=e;
    })

    if(!found)
        prefix=prev_prefix;
    let div_val=n/prefix.value;
    let digits=1000
    div_val=Math.round(div_val * digits) / digits
    return div_val+" "+prefix.symbol

}



console.log("Extracted number", parse_number("13.3E3"))
function get_paralell_resistance(a, b) {
    return 1.0 / (1 / a + 1 / b)
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
