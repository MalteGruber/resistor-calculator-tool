<script>
      import Parameter from "./parameter.svelte";
      import { Calculator } from "$lib/calculator.js";

      let d = $state({});
      let calc = new Calculator(d);

      calc.register_input(
            "vin",
            "V input",
            "Vin",
            (vals) => {
                  return (vals.vout * (vals.rhigh + vals.rlow)) / vals.rlow;
            },
            (vals) => {
                  let current = vals.vin / (vals.rhigh + vals.rlow);
                  let power = current*vals.vin;
                  return [
                        { val: current, unit: "A" },
                        { val: power, unit: "W" },
                  ];
            },
      );
      calc.register_input(
            "rhigh",
            "R Highside",
            "Rhigh",
            (vals) => {
                  let current = vals.vout / vals.rlow;
                  return (vals.vin - current * vals.rlow) / current;
            },
            (vals) => {
                  let current = vals.vin / (vals.rhigh + vals.rlow);
                  let power = current * current * vals.rhigh;
                  let voltage = vals.vin - vals.vout;
                  return [
                        { val: voltage, unit: "V" },
                        { val: power, unit: "W" },
                  ];
            },
      );
      calc.register_input(
            "rlow",
            "10|4+2",
            "R Lowside",
            (vals) => {
                  return (vals.vout * vals.rhigh) / (vals.vin - vals.vout);
            },
            (vals) => {
                  let current = vals.vin / (vals.rhigh + vals.rlow);
                  let power = current * current * vals.rlow;
                  let voltage = vals.vout;
                  return [
                        { val: voltage, unit: "V" },
                        { val: power, unit: "W" },
                  ];
            },
      );

      calc.register_input("vout", "V output", "Vout", (vals) => {
            return (vals.vin * vals.rlow) / (vals.rhigh + vals.rlow);
      });

      function do_self_test(V, RH, RL) {
            let I = V / (RH + RL);
            let PL = I * I * RL;
            let PH = I * I * RH;
            let VOUT = I * RL;

            let obj = { values: {}, extras: {} };
            obj.values.vin = V;
            obj.values.rlow = RL;
            obj.values.rhigh = RH;
            obj.values.vout = VOUT;

            obj.extras.vin=[{val:I,unit:"A"},{val:PL+PH,unit:"W"}]  
            obj.extras.rhigh=[{val:V-VOUT,unit:"V"},{val:PH,unit:"W"}]
            obj.extras.rlow=[{val:VOUT,unit:"V"},{val:PL,unit:"W"}]
            
            calc.self_test(obj);
      }

      do_self_test(1, 2, 3);
      do_self_test(3, 2, 2);
      do_self_test(100.0, 3.3, 2);
      do_self_test(101.0, 2, 3.3);
      do_self_test(102.0, 3.3, 3.3);

      function cb(k, v) {
            calc.on_change_callback(k, v);
      }
</script>

<Parameter bind:cb data={calc.data} key="vin" unit="V"></Parameter>
<Parameter bind:cb data={calc.data} key="rhigh" unit="Ω"></Parameter>
<Parameter bind:cb data={calc.data} key="rlow" unit="Ω"></Parameter>
<Parameter bind:cb data={calc.data} key="vout" unit="V"></Parameter>
