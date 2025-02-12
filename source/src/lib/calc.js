
    import { parse_expression, lookup } from "./parser.js";
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

                const result = r.flatMap((val) => {
                    return arr.map((char) => {
                        return [val, [char]].flat();
                    });
                });
                return arr.concat(result);
            }
        };
        let c = combination(arr, max);
        return c.filter((val) => {
            if (val.length === undefined) return false;
            return val.flat().length >= min;
        });
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

        { exp: "1k*2k", assert: 1000 * 2000 },
        { exp: "3*7k+1", assert: 3 * 7e3 + 1 },
        { exp: "2+3*7k+1", assert: 2 + 3 * 7e3 + 1 },
        { exp: "2+3*7k+1|1", assert: 2 + 3 * 7e3 + 0.5 },
        { exp: "(1|1)", assert: 0.5 },
        { exp: "(1|1)*2", assert: 1 },
        { exp: "2*(1|1)", assert: 1 },
        { exp: "1+2*(1|1)", assert: 2 },
        { exp: "10+2*2+(1|1)", assert: 10 + 2 * 2 + 0.5 },
        { exp: "7*3", assert: 7 * 3 },
        { exp: "7*3/2", assert: (7 * 3) / 2 },
        { exp: "7/11*3/2", assert: ((7 / 11) * 3) / 2 },
        { exp: "7/11*3/2+1", assert: ((7 / 11) * 3) / 2 + 1 },
        { exp: "(7/11*3/2+1)/5", assert: (((7 / 11) * 3) / 2 + 1) / 5 },
    ];

    let pass = true;
    tests.forEach((test) => {
        let result = parse_expression(test.exp);
        if (result != test.assert) {
            console.error("Test failed!!");
            console.log(
                "Test:",
                JSON.stringify(test),
                "Result:",
                result,
                "Expected",
                test.assert,
            );
            pass = false;
        }
    });
    if (pass) {
        console.log("All tests passed!");
    } else {
        // alert("Test failed")
    }

    function calculate_all_voltages(cmd) {
        let r_cnt = (cmd.match(/o/g) || []).length;
        let combinations = [1, 2, 3];
    }

    const nFormatter = (num, digits) => {
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        const item = lookup
            .slice()
            .reverse()
            .find((item) => {
                return num >= item.value;
            });
        return item
            ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
            : "0";
    };

    export function stringify_number(n) {
        if (isNaN(n)) {
            console.log("Not a number");
            return n

        }

        if (!isFinite(n)) {
            console.log("Infinite number");
            return n;}


        let found = false;

        //Assumes prefixes are sorted smalest to largest

        let prefix = lookup[0];
        if (n<prefix.value){

        }else{
        
        for (let i = 0; i < lookup.length; i++) {
            let e = lookup[i];
            if (i == lookup.length - 1) {
                break;
            }
            let nextPrefixMagnitude = lookup[i + 1].value;

            if (n < nextPrefixMagnitude && !found) {
                prefix = e;
                found = true;
            }
        }
    }
        let div_val = n;
        if (found) {
            div_val = n / prefix.value;
            let digits = 1000;
            div_val = Math.round(div_val * digits) / digits;
            return div_val + "" + prefix.symbol;
        }else{
            /*The number is going to be HUUGE, so lets make it a exponential*/
            return parseFloat(div_val).toPrecision(3)
        }   
    }

    let tests_stringify = [
        { n: 1, assert: "1" },
        { n: 1e3, assert: "1k" },
        { n: 1e6, assert: "1M" },
        { n: 1e9, assert: "1G" },
        { n: 1e12, assert: "1.00e+12" },
        { n: 1e15, assert: "1.00e+15" },
        { n: 1.3123123123123123e15, assert: "1.31e+15" },
        { n: 1.399993123123123123123e15, assert: "1.40e+15" },
        { n: 1/3, assert: "333.333m" },

        { n: 1e-3, assert: "1m" },
        { n: 1e-6, assert: "1u" },
        { n: 1e-9, assert: "1n" },
        { n: 1e-12, assert: "1p" },
        { n: 1e-15, assert: "1f" },
        { n: 1e-18, assert: "1.00e-18" },
        {n: 1001, assert: "1.001k"},

        //Funky tests
        { n: 1e-3, assert: "1m" },
        { n: 1e-6, assert: "1u" },
        { n: 1e-9, assert: "1n" },
        { n: 1e-12, assert: "1p" },
        { n: 1e-15, assert: "1f" },
        { n: 1e-18, assert: "1.00e-18" },
        { n: 1.3123123123123123e-15, assert: "1.312f" },
        { n: 1.399993123123123123123e-15, assert: "1.4f" },
        { n: 1e-3/3, assert: "333.333u" },
  
    ];
    pass = true;
    for (let i = 0; i < tests_stringify.length; i++) {
        let test = tests_stringify[i];
        let result = stringify_number(test.n);
        if (result != test.assert) {
            console.error("Test failed!!");
            console.log(
                "Test:",
                test,
                "Result:",
                result,
                "Expected",
                test.assert,
            );
            pass = false;
            break;

        }
    }
    if (!pass) {
        console.error("Test failed");
    } else {
        console.log("All stringify tests passed!");
    }

    //console.log("Extracted number", parse_number("13.3E3"))

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
                this.good_matches.push({
                    error: error,
                    value: value,
                    target: target,
                    info: info,
                });
                if (this.good_matches.length > this.num_matches) {
                    this.good_matches.shift();
                }
            }
        }
    }
    let resistors = [];
    /*
const urlParams = new URLSearchParams(window.location.search);
resistors = [] //[100, 22, 470, 4700, 100000, 1000, 10000, 120, 18000, 2200, 2.2, 330, 150, 1E6]
let res_param = urlParams.get('resistors')

if (res_param) {
    res_param = res_param.split(",")

    res_param = res_param.map(parse_number);

    console.log("Got the following resistors", res_param)
    resistors = res_param
}
*/
    function find_best_match(target) {
        let bmt = new BestMatchTracker();

        function do_combinations(cnt, possible_combinations) {
            let c = combinations(resistors, cnt, cnt);
            possible_combinations.split(",").forEach((comb_exp) => {
                //console.log(comb_exp)

                c.forEach((e) => {
                    let expression = comb_exp.trim();

                    e.forEach((r) => {
                        expression = expression.replace("R", r).trim();
                    });
                    let value = undefined;
                    if (expression) {
                        //    console.log(expression)
                        value = parse_expression(expression);

                        bmt.evaluate_match(value, target, expression);
                    } else {
                        console.error(comb_exp);
                    }
                    //console.log(value, comb_exp, "->", expression);
                });
            });
        }
        do_combinations(2, two_combinations);
        do_combinations(3, three_combinations);
        do_combinations(4, four_combinations);
        console.log(bmt.good_matches);
        return bmt.good_matches;
    }

    export       class Calculator {

        constructor(data) {
              this.data=data
              this.values = {};
              this.calculators = {};
              this.extra_cb = {};
        }
        register_input(key, placeholder, name, calc_cb, extra_cb) {
   

              this.data[key] = { placeholder, extra:undefined, name };
              this.values[key] = undefined;
              this.calculators[key] = calc_cb;
              this.extra_cb[key] = extra_cb;
        }

        reset_results() {
              for (let key in this.values) {
                    this.data[key].result = undefined;
                    this.data[key].extra = undefined;

                    // this.data[key].placeholder="LOL"

              }
        }
        on_change_callback(key, value) {
              console.log("Whoop", key, value, this);
              this.values[key] = value;
              /*Check how many values we have now*/

              let keys_with_missing_values = [];
              for (let key in this.values) {
                    if (this.values[key] == undefined) {
                          keys_with_missing_values.push(key);
                    }
              }
              if (keys_with_missing_values.length == 1) {
                    let key = keys_with_missing_values[0];
                    let missing_value = this.calculators[key](this.values);
                    console.log("Missing value", missing_value);
                    this.data[key].result = stringify_number(missing_value);
                    console.log(this.data);

                    let vals = {};
                    for (let k in this.values) {
                          if (k != key) {
                                vals[k] = this.values[k];
                          } else {
                                vals[k] = missing_value;
                          }                              
                    }

                    for (let k in this.values) {
                          console.log("Checking", k);
                          if (this.extra_cb[k]) {
                                console.log("Extra cb", k, vals);
                                this.data[k].extra = this.extra_cb[k](vals);
                          }
                    }

                    return missing_value;
              } else {
                    this.reset_results();
              }
        }
  }