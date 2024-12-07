
<script>
    import Parameter from "./parameter.svelte";
    import {stringify_number} from "./calc.svelte";

    let vin,vout,rlow,rhigh;
    let placeholder={"vin":"Hihg voltage","rhigh":"High resistance","rlow":"Low resistance","vout":"Output voltage"};
    
    let data ={}

    function calulate_series_resistance(vin,rhihg,rlow,vout){



          let def_vals=JSON.stringify({
          vin:{placeholder:"Vin",extra:"",name:"Vin"},
          rhigh:{placeholder:"Vout",extra:"",name:"Rhigh"},
          rlow:{placeholder:"10|4+2",name:"Rlow"},
          vout:{placeholder:"Rhihg",extra:"",name:"Vout"}
           });
          console.log("CALCCCC");

          function ok(val){
                return val!==undefined && val!==null && val!=="";
          }

          let okays=0;
          if(ok(vin)){
                okays++;
          }
          if(ok(rhigh)){
                okays++;
          }
          if(ok(rlow)){
                okays++;
          }
          if(ok(vout)){
                okays++;
          }
          if(okays<3){
                data = JSON.parse(def_vals);
                return "Please fill in tree fields";

          }
          if(okays==4){
                return "Please leave one field empty";
          }

          let result_vin=vin;
          let result_rhigh=rhigh;
          let result_rlow=rlow;
          let result_vout=vout;


          /*Calulate the voltage divider for each case*/
          if(!ok(vin)){
                /*Here vin is missing, so we calculate it*/
                result_vin=vout*(rhigh+rlow)/rhigh;
                data.vin.placeholder="="+stringify_number(result_vin)+"V";
          }
          if(!ok(vout)){
                /*Here vout is missing, so we calculate it*/
                result_vout=vin*rhigh/(rhigh+rlow);
                data.vout.placeholder="="+stringify_number(result_vout)+"V";
          }
          if(!ok(rhigh)){
                /*Here rhigh is missing, so we calculate it*/
                result_rhigh=(vin-vout)*rlow/vout;
                data.rhigh.placeholder="="+stringify_number(result_rhigh)+"Ω";
          }
          if(!ok(rlow)){
                /*Here rlow is missing, so we calculate it*/
                result_rlow=(vin-vout)*rhigh/vout;
                data.rlow.placeholder="="+stringify_number(result_rlow)+"Ω";
          }

          //For the resistors we show their power dissipation
          let tmp=result_vin-result_vout;
          let phihg=tmp*tmp/(result_rlow+result_rhigh);
          tmp=result_vout;
          let plow=tmp*tmp/(result_rlow+result_rhigh);
          data.vin.extra=stringify_number(phihg+plow)+"W";
          data.vin.extra+=", "+stringify_number(result_vin/(result_rhigh+result_rlow))+"A";
          data.rhigh.extra=stringify_number(phihg)+"W";
          data.rlow.extra=stringify_number(plow)+"W";

    }

    $:output=calulate_series_resistance(vin,rhigh,rlow,vout);


</script>


<h3>Message:{output}</h3>


<Parameter bind:value={vin} data={data} key="vin" unit="V"> </Parameter>
<Parameter bind:value={rhigh} data={data} key="rhigh" unit="Ω"> </Parameter>
<Parameter bind:value={rlow} data={data} key="rlow" unit = "Ω"></Parameter> 
<Parameter bind:value={vout} data={data} key="vout" unit = "V"></Parameter> 

