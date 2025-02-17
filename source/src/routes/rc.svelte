<script>
      import Parameter from "./parameter.svelte";
      import { Calculator } from "$lib/calculator.js";
      let d = $state({});
      let calc = new Calculator(d);

      calc.register_input("tc", "Time Constant", "Time", (vals) => {
            return vals.capacitance * vals.resistance;
      },
      (v)=>{
            return [{val:1/(2*Math.PI*v.tc),unit:"Hz"}]
      });
      calc.register_input("capacitance", "Capacitance", "Capacitance", (vals) => {
            return vals.tc / vals.resistance;
      });
      calc.register_input(
            "resistance",
            "Resistance",
            "Resistance",
            (vals) => {
                  return vals.tc/vals.capacitance;
            },
            // (vals) => {
            //       let power = vals.current * vals.current;
            //       return [{ val: power, unit: "W" }];
            // },
      );
      function do_self_test(C, R) {
            let T=C*R;
            let F=1/(2*Math.PI*T)


            let obj = { values: {}, extras: {} };
            obj.values.capacitance = C;
            obj.values.tc = T;
            obj.values.resistance = R;

            obj.extras={tc:[{val:F,unit:"Hz"}]}

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


<Parameter bind:cb data={calc.data} key="capacitance" unit="F"></Parameter>
<Parameter bind:cb data={calc.data} key="resistance" unit="Ω"></Parameter>
<Parameter bind:cb data={calc.data} key="tc" unit="s"></Parameter>