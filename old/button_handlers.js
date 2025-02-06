
function btn_single_resisitor() {
    let inp = $("#expression").val()
    let voltage = parse_expression($("#resistor_calc_voltage").val())
    let current = parse_expression($("#resistor_calc_current").val())

    let resistance=parse_expression(inp)
    $("#result").text(resistance)

    if(voltage&&current){
        let resistance=voltage/current;
        let power=voltage*current;
        $("#result").text(`${resistance} Ohm. Power ${power} W`)
    }else
    if(voltage){
        let current=voltage/resistance;
        let power=voltage*current;
        $("#result").text(`${resistance} Ohm, Current ${current} A. Power ${power} W`)
    }else if(current){
        let voltage=current*resistance;
        let power=voltage*current;
        $("#result").text(`${resistance} Ohm, Voltage ${voltage} V. Power ${power} W`)    
    }else{
        $("#result").text("Please leave one field empty to calculate its value")
    
    }
}

function btn_calc_eqvivalen() {
    let num=parse_number($("#target_resistance").val());

    let bm = find_best_match(num);
    console.log(num,bm)
    
    let report = ""
    
    bm.forEach(r => {
        report += `<b>${r.value}Ω </b><p> error=${r.error}Ω, Using this combination: ${r.info}</p><br>`;
    })
    $("#best_match").html(report)
    if(bm.length==0)
        alert("Please add your resistors in the URL!")
}


function btn_calc_series() {
    function get_power_string(vin,vout,rlow,rhigh){
        let i=vin/(rlow*rhigh)
    
        let o={
            plow:stringify_number(vout*i)+"W",
            phigh:stringify_number((vin-vout)*i)+"W",
            current:stringify_number(i)+"A"
        };

        $("#rfield_rhigh").text(o.phigh)
        $("#rfield_rlow").text(o.plow)
        
        return `Current ${o.current}`
    }


    let rhigh = parse_expression($("#rhigh").val());
    let rlow = parse_expression($("#rlow").val());
    let vin = parse_expression($("#vin").val());
    let vout = parse_expression($("#vout").val());

    console.log("x")
    function value_not_provided(val) {
        return val == undefined
    }

    //vout*rhigh+vout*rlow=vin*rlow

    //rlow=(vout*rhigh)/(vin-vout)
    

    let result_id="";
    let result_val="COOL";
    if (value_not_provided(rhigh)) {
        console.log("calc rhigh")
         rhigh = (vin*rlow-rlow*vout)/vout

        result_id="rhigh"
        result_val=rhigh;
    }

    if (value_not_provided(rlow)) {
        console.log("calc rlow")
         rlow=(vout*rhigh)/(vin-vout)

        result_id="rlow"
        result_val=rlow;
    }

    if (value_not_provided(vin)) {
        console.log("vin ")
        result_id="vin";
         vin=(vout*rhigh+vout*rlow)/rlow;

        result_val=vin;
    }


    if (value_not_provided(vout)) {
        console.log("vout ")
         vout=vin/(rlow+rhigh)*rlow;

        result_id="vout"
        result_val=vout;
    }
    $("#div_result").text(get_power_string(vin,vout,rlow,rhigh))
    $("#"+result_id).attr("placeholder","Result: "+result_val)
    
}

function charge_time_in_sec_to_voltage(charge_voltage,target_voltage,capacitance,resistance){
    /*
    
    V(t)=V_0*e^(-t/(RC))
    Solve
    ln(V(t)/V_0)=-t/(RC)
    t=-RC*ln(V(t)/V_0)
    
    
    */
    return -resistance*capacitance*Math.log(target_voltage/charge_voltage)
}
function btn_calc_rc(){
    let voltage = parse_expression($("#rc_voltage").val())
    let capacitance = parse_expression($("#rc-capacitance").val(),type="capacitor")
    let resistance = parse_expression($("#rc-resistance").val())
    
    let s=`<b>${stringify_number(capacitance)}F charged to ${stringify_number(voltage)} discharged through a ${stringify_number(resistance)}Ω resistor</b>`
    let arr=[0.1,0.5,0.9];
    arr=arr.reverse()
    arr.forEach(mul=>{
        let target=mul*voltage;
        s+=`<br>${stringify_number(target)}V: after ${stringify_number(charge_time_in_sec_to_voltage(voltage,target,capacitance,resistance))}s`
    });

    $("#div_rc_result").html(s)
}