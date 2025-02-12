<script>
      import Parameter from "./parameter.svelte";
      import { Calculator } from "$lib/calculator.js";
      let d = $state({});
      let calc = new Calculator(d);
      calc.register_input("voltage", "V input", "Vin", (vals) => {
            return vals.current * vals.resistance;
      });
      calc.register_input("current", "Current", "Current", (vals) => {
            return vals.voltage / vals.resistance;
      });
      calc.register_input(
            "resistance",
            "Resistance",
            "",
            (vals) => {
                  return vals.voltage / vals.current;
            },
            (vals) => {
                  let power = vals.current * vals.current;
                  return [{ val: power, unit: "W" }];
            },
      );

      function do_self_test(V, R) {
            let I = V / R;
            let P = V * I;

            let obj = { values: {}, extras: {} };
            obj.values.voltage = V;
            obj.values.current = I + 1;
            obj.values.resistance = R;

            // obj.extras.vin
            calc.self_test(obj);
      }

      do_self_test(1, 2);
      do_self_test(3, 2);
      do_self_test(100.0, 3.3);
      do_self_test(101.0, 2);
      do_self_test(102.0, 3.3);

      function cb(k, v) {
            calc.on_change_callback(k, v);
      }
</script>

<Parameter bind:cb data={calc.data} key="voltage" unit="V"></Parameter>
<Parameter bind:cb data={calc.data} key="current" unit="A"></Parameter>
<Parameter bind:cb data={calc.data} key="resistance" unit="Ω"></Parameter>
