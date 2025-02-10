<script>
      import Parameter from "./parameter.svelte";
      import { stringify_number } from "$lib/calc.js";

      let vin_ = $state();
      let vout_ = $state();
      let rlow_ = $state();
      let rhigh_ = $state();

      let output = $state(0);
      let data = $state({});

      function calulate_series_resistance(vin, rhigh, rlow, vout, testobj) {
            let def_vals = JSON.stringify({
                  vin: { placeholder: "V input", extra: "", name: "Vin" },
                  rhigh: {
                        placeholder: "R Highside",
                        extra: "",
                        name: "Rhigh",
                  },
                  rlow: { placeholder: "10|4+2", name: "R Lowside" },
                  vout: { placeholder: "V output", extra: "", name: "Vout" },
            });
            //Set data to default values for the server to be happy, frontent does not care
            data = JSON.parse(def_vals);

            function ok(val) {
                  return val !== undefined && val !== null && !isNaN(val);
            }

            let okays = 0;
            if (ok(vin)) {
                  okays++;
            }
            if (ok(rhigh)) {
                  okays++;
            }
            if (ok(rlow)) {
                  okays++;
            }
            if (ok(vout)) {
                  okays++;
            }
            console.log("Args", okays);

            if (okays < 3) {
                  data = JSON.parse(def_vals);
                  return "Please fill in three fields";
            }
            if (okays == 4) {
                  return "Please leave one field empty";
            }
            let result_vin = vin;
            let result_vout = vout;
            let result_rhigh = rhigh;
            let result_rlow = rlow;

            /*Calulate the voltage divider for each case*/
            if (!ok(vin)) {
                  /*Here vin is missing, so we calculate it*/
                  result_vin = (vout * (rhigh + rlow)) / rlow;
                  data.vin.placeholder =
                        "=" + stringify_number(result_vin) + "V";
            }
            if (!ok(vout)) {
                  /*Here vout is missing, so we calculate it*/
       
                  result_vout = (vin * rlow) / (rhigh + rlow);


                  data.vout.placeholder =
                        "=" + stringify_number(result_vout) + "V";
            }
            if (!ok(rhigh)) {
                  /*Here rhigh is missing, so we calculate it*/
                  result_rhigh = ((vin - vout) * rlow) / vout;
                  data.rhigh.placeholder =
                        "=" + stringify_number(result_rhigh) + "Ω";
            }
            if (!ok(rlow)) {
                  /*Here rlow is missing, so we calculate it*/
                  result_rlow = (vout * rhigh) / (vin - vout);
                  data.rlow.placeholder =
                        "=" + stringify_number(result_rlow) + "Ω";
            }

            //For the resistors we show their power dissipation
            let current = result_vin / (result_rhigh + result_rlow);
            let phihg = current * current * result_rhigh;
            let plow = current * current * result_rlow;
            if (testobj) {
                  //Assert the values testobj.phihg and testobj.plow,etc are equal to the calculated values
                  let pass = true;
                  function assert(val1, val2, msg) {

                        if (Math.abs(val1 - val2) > 1e-6) {
                              console.error("Assert failed", val1, val2, msg);
                        
                              pass = false;
                        }
                  }
                  assert(phihg, testobj.phihg, "phihg");
                  assert(plow, testobj.plow, "plow");
                  assert(result_vin, testobj.result_vin, "result_vin");
                  assert(result_vout, testobj.result_vout, "result_vout");
                  assert(result_rhigh, testobj.result_rhigh, "result_rhigh");
                  assert(result_rlow, testobj.result_rlow, "result_rlow");

                  if (pass) {
                        //console.log("All tests passed");
                  }
            }
            data.vin.extra = stringify_number(phihg + plow) + "W";
            data.vin.extra +=
                  ", " +
                  stringify_number(result_vin / (result_rhigh + result_rlow)) +
                  "A";
            data.rhigh.extra = stringify_number(phihg) + "W";
            data.rlow.extra = stringify_number(plow) + "W";
      }

      function do_self_test(V, RH, RL) {
            let I = V / (RH + RL);
            let PL = I * I * RL;
            let PH = I * I * RH;
            let VOUT = I * RL;
            calulate_series_resistance(V, RH, RL, undefined, {
                  phihg: PH,
                  plow: PL,
                  result_vin: V,
                  result_vout: VOUT,
                  result_rhigh: RH,
                  result_rlow: RL,
            });
            calulate_series_resistance(V, RH, undefined, VOUT, {
                  phihg: PH,
                  plow: PL,
                  result_vin: V,
                  result_vout: VOUT,
                  result_rhigh: RH,
                  result_rlow: RL,
            });
            calulate_series_resistance(V, undefined, RL, VOUT, {
                  phihg: PH,
                  plow: PL,
                  result_vin: V,
                  result_vout: VOUT,
                  result_rhigh: RH,
                  result_rlow: RL,
            });
            calulate_series_resistance(undefined, RH, RL, VOUT, {
                  phihg: PH,
                  plow: PL,
                  result_vin: V,
                  result_vout: VOUT,
                  result_rhigh: RH,
                  result_rlow: RL,
            });
      }


      do_self_test(1,2,3);
      do_self_test(3,2,1);
      do_self_test(100.0,3.3,2);
      do_self_test(100.0,2,3.3);
      do_self_test(100.0,3.3,3.3);


      $effect(() => {
            let vin = parseFloat(vin_);
            let vout = parseFloat(vout_);
            let rlow = parseFloat(rlow_);
            let rhigh = parseFloat(rhigh_);

            setTimeout(() => {
                  output = calulate_series_resistance(vin, rhigh, rlow, vout);
            }, 1);
      });
</script>

<h3>Message:{output}</h3>

<Parameter bind:value={vin_} {data} key="vin" unit="V"></Parameter>
<Parameter bind:value={rhigh_} {data} key="rhigh" unit="Ω"></Parameter>
<Parameter bind:value={rlow_} {data} key="rlow" unit="Ω"></Parameter>
<Parameter bind:value={vout_} {data} key="vout" unit="V"></Parameter>
