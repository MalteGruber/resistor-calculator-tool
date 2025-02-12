<script>
    import { parse_expression } from "$lib/parser.js";
    import { stringify_number } from "$lib/calc.js";

    let {
        cb = $bindable(),
        value = $bindable(),
        key,
        data,
        unit,
        resultsSideDisplayValue,
        allowZeros = false,
    } = $props();

    let emptyInput = $state(true);
    let error = $state(false);
    let display_string = $state("");
    let obj = $state({});

    $effect(() => {
        obj = data[key];
    });

    let showing_result = $derived(data[key].result?true:false);


    function update_parent(v) {
        console.log("Updating parent", cb);
        cb(key,v);
        //value = v;
    }
    function check(d) {
        display_string = "";
        let raw_input = d.target.value;
        emptyInput =
            (raw_input === "" || raw_input === undefined) && !showing_result;

        if (emptyInput) {
            resultsSideDisplayValue = undefined;
            error = false;
            update_parent(undefined);
            return;
        }

        try {
            resultsSideDisplayValue = parse_expression(raw_input, "resistance");
            error = false;
            //Update the parent's value

            update_parent(resultsSideDisplayValue);
        } catch (e) {
            console.log("Error", e);
            error = true;
            console.log("Setting error flag");
            //This should not happen
            resultsSideDisplayValue = e.message;
        }

        function evalResult(val) {
            if (val === undefined) {
                return "";
            }
            //if the value is a string we display it wihtout the unit
            if (typeof val === "string") {
                error = true;
                return val;
            }
            if (isNaN(val)) {
                error = true;
                return "Not a number";
            }
            if (val === 0 && !allowZeros) {
                error = true;
                return "Zero not valid";
            }
            if (!isFinite(val)) {
                error = true;
                return "Infinity";
            }

            let res_str = stringify_number(val);
            error = false;
            return "[" + res_str + "" + unit + "]";
        }
        display_string = evalResult(resultsSideDisplayValue);
    }
</script>

<div class="frame">
    <div class="input_div_with_columns">
        <label>{obj?.name}</label>
        <input
            type="text"
            readonly={showing_result}
            class:error
            class:emptyInput
            class={showing_result ? "showing_result" : ""}
            oninput={check}
            placeholder={showing_result?"="+obj.result:obj?.placeholder}
        />

        <label>{obj?.extra} </label>
        <br />

        <div>
            {display_string}
        </div>
    </div>
</div>

<style>
    .input_div_with_columns {
        display: flex;

        flex-direction: row;
        align-items: center;

        width: 500px;
        height: 50px;
    }
    .input_div_with_columns label {
        color: rgb(150, 149, 149);

        display: flex;
        align-items: center;
        width: 100px;
        padding-left: 20px;
    }

    .emptyInput {
        box-shadow: inset 0px 0px 5px 0px #0bffb6;
        transition: box-shadow 0.2s ease 0s;
        box-shadow: inset 0px 0px 5px 0px #0bffb6;
    }

    .error {
        box-shadow: inset 0px 0px 10px 0px #ff0000;
        transition: 1s ease-in 0s;
        animation: breathe 1s ease-in infinite;
    }
    @keyframes breathe {
        0% {
            box-shadow: inset 0px 0px 10px 0px #ff0000;
        }
        50% {
            box-shadow: inset 0px 0px 5px 0px #ff0000;
        }
        100% {
            box-shadow: inset 0px 0px 10px 0px #ff0000;
        }
    }
    .input_div_with_columns input {
        width: 150px;
        height: 90%;

        padding: 0px;
        padding-left: 10px;
        border: none;
    }
    .frame {
        box-shadow: 0px 0px 4px 0px #919191;
        width: fit-content;
        border-radius: 15px;
    }
    .showing_result {
        box-shadow: inset 0px 0px 8px 1px rgb(222, 152, 255);
    }
</style>
