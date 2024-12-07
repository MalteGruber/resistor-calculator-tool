<script>
    /*
  RC
  Series resistor divider
  RC Curve
  */
    import Value from "./value.svelte";
    import { parse_expression } from "./parser.svelte";

    export let resultsSideDisplayValue;
    export let key;
    export let data;

    export let unit;
    let emptyInput = true;
    let error = false;
    let debug = "";

    $: obj = data[key];

    $: showing_result = obj.placeholder.includes("=");

    let input_element;

    function check(d) {
        let raw_input = d.target.value;
        emptyInput =
            (raw_input === "" || raw_input === undefined) && !showing_result;

        if (emptyInput) {
            resultsSideDisplayValue = undefined;
            error = false;
            return;
        }
        try {
            resultsSideDisplayValue = parse_expression(raw_input, "resistance");

        } catch (e) {
            error = true;
            //This should not happen
            resultsSideDisplayValue = e.message;
        }
    }

    // $: lol=check(obj);
</script>

<div class="frame">
    <div class="input_div_with_columns">
        <label>{obj.name}</label>
        <input
            type="text"
            readonly={showing_result}
            class:error
            class:emptyInput
            class:showing_result
            on:input={check}
            bind:this={input_element}
            placeholder={obj.placeholder}
        />

        <label>{obj.extra} </label>
        <br />

        <label>
            <Value value={resultsSideDisplayValue} {unit}></Value>
        </label>
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
        color: rgb(71, 71, 71);

        display: flex;
        align-items: center;
        width: 100px;
        padding-left: 20px;
    }
    .showing_result {
        box-shadow: inset 0px 0px 4px 1px #3cd400;
    }
    .emptyInput {
        box-shadow: inset 0px 0px 5px 0px #0bffb6;
        transition: box-shadow 1s ease 0s;
        animation: emptyInput 1s infinite;
    }

    @keyframes emptyInput {
        0% {
            box-shadow: inset 0px 0px 5px 0px #0bffb6;
        }
        50% {
            box-shadow: inset 0px 0px 2px 0px #b20bff;
        }
        100% {
            box-shadow: inset 0px 0px 5px 0px #0bffb6;
        }
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
        background-color: rgb(255, 255, 255);
        padding: 0px;
        padding-left: 10px;
        border: none;
    }
    .frame {
        box-shadow: 0px 0px 4px 0px #919191;
        width: fit-content;
        border-radius: 15px;
    }
</style>
