<script>
      import Parameter from "./parameter.svelte";
      import { stringify_number } from "$lib/calc.js";

      let vin_ = $state();
      let vout_ = $state();
      let rlow_ = $state();
      let rhigh_ = $state();

      let output = $state(0);
      let data = $state({});

      function calulate_series_resistance(vin, rhigh, rlow, vout) {
 



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
                  console.log("Okays", okays);
                  if (okays < 3) {
                        data = JSON.parse(def_vals);
                        return "Please fill in tree fields";
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
                        console.log("Vin", vin);
                        console.log("Rlow", rlow);
                        console.log("Rhigh", rhigh,(vin * rlow), (rhigh + rlow),(vin * rlow) / (rhigh + rlow));

                        result_vout = (vin * rlow) / (rhigh + rlow);
                        console.log("Vout", result_vout);

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
                        result_rlow = vout*rhigh/(vin-vout);
                        data.rlow.placeholder =
                              "=" + stringify_number(result_rlow) + "Ω";
                  }

                  //For the resistors we show their power dissipation
                  let tmp = result_vin - result_vout;
                  let phihg = (tmp * tmp) / (result_rlow + result_rhigh);
                  tmp = result_vout;
                  let plow = (tmp * tmp) / (result_rlow + result_rhigh);
                  data.vin.extra = stringify_number(phihg + plow) + "W";
                  data.vin.extra +=
                        ", " +
                        stringify_number(
                              result_vin / (result_rhigh + result_rlow),
                        ) +
                        "A";
                  data.rhigh.extra = stringify_number(phihg) + "W";
                  data.rlow.extra = stringify_number(plow) + "W";
         
      }
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
