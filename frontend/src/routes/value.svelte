

<script>
    import {stringify_number} from "./calc.svelte";
    export let value = undefined
    export let unit = "Ω";
    export let allowZeros = false;

    let error = false;

    $: display_string = go(value);

    function go(value) {

        if(value===undefined){
            return "";
        }
        //if the value is a string we display it wihtout the unit
        if (typeof value === "string") {
            error = true;
            return value;
         
        }
        if (isNaN(value)) {
            error = true;
            return "Not a number";
        }
        if (value === 0 && !allowZeros) {
            error = true;
            return "Zero not valid";
        }
        if (!isFinite(value)) {
            error = true;
            return "Infinity";
        }

        let res_str = stringify_number(value);
        error = false;
        return "[" + res_str + "" + unit+"]";
    }
</script>

<div class:error>
    {display_string}
</div>

<style>
    .error {
        color: red;
    }
</style>
