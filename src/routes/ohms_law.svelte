<script>
      import Parameter from "./parameter.svelte";
      import { stringify_number } from "$lib/calc";

      let voltage, current, resistance;

      let data = {};

      function calulate_series_resistance(voltage, resistance, current) {
            let def_vals = JSON.stringify({
                  voltage: {
                        placeholder: "Voltage",
                        extra: "",
                        name: "Voltage",
                  },
                  resistance: {
                        placeholder: "Resistance",
                        extra: "",
                        name: "Resistance",
                  },
                  current: {
                        placeholder: "Current",
                        extra: "",
                        name: "Current",
                  },
            });

            function ok(val) {
                  return val !== undefined && val !== null && val !== "";
            }

            let okays = 0;
            if (ok(resistance)) {
                  okays++;
            }
            if (ok(current)) {
                  okays++;
            }
            if (ok(voltage)) {
                  okays++;
            }

            if (okays < 2) {
                  data = JSON.parse(def_vals);
                  return "Please fill in two fields";
            }
            if (okays == 3) {
                  return "Please leave one field empty";
            }

            let result_resistance = 0;
            let result_voltage = 0;
            let result_current = 0;

            if (!ok(voltage)) {
                  result_voltage = resistance * current;
                  data.voltage.placeholder =
                        "=" + stringify_number(result_voltage) + "V";
            }
            if (!ok(resistance)) {
                  result_resistance = voltage / current;
                  data.resistance.placeholder =
                        "=" + stringify_number(result_resistance) + "Ω";
            }
            if (!ok(current)) {
                  result_current = voltage / resistance;
                  data.current.placeholder =
                        "=" + stringify_number(result_current) + "A";
            }

            let power = voltage * current;
            data.voltage.extra = stringify_number(power) + "W";
      }

      $: output = calulate_series_resistance(voltage, resistance, current);
</script>

<h3>Message:{output}</h3>

<Parameter bind:value={voltage} {data} key="voltage" unit="V"></Parameter>
<Parameter bind:value={current} {data} key="current" unit="A"></Parameter>
<Parameter bind:value={resistance} {data} key="resistance" unit="Ω"></Parameter>
