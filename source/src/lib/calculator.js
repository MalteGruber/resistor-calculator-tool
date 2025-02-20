
export class Calculator {

    constructor(data) {
        this.data = data
        this.input_vals = {};
        this.results = {}
        this.calculators = {};
        this.extra_cb = {};
    }

    register_input(key, placeholder, name, calc_cb, extra_cb) {
        this.data[key] = { placeholder, extra: undefined, name, result: undefined };
        this.input_vals[key] = undefined;
        this.calculators[key] = calc_cb;
        this.extra_cb[key] = extra_cb;
    }

    reset_results() {
        for (let key in this.input_vals) {
            this.data[key].result = undefined;
            this.data[key].extra = undefined;

            // this.data[key].placeholder="LOL"
        }
    }

    _on_all_values_known() {
        for (let k in this.data) {            
            if (this.extra_cb[k]) {
                this.data[k].extra = this.extra_cb[k](this.results);
            }
        }
    }

    _calculate_result_for(key_of_missing) {
        let missing_input_val = this.calculators[key_of_missing](this.input_vals);
        this.results[key_of_missing] = missing_input_val;
        this.data[key_of_missing].result=missing_input_val
        this._on_all_values_known();
        return missing_input_val;
    }

    on_change_callback(key, input_val) {

      
        this.input_vals[key] = input_val;
        if(input_val){
            this.results[key] = input_val;
        }

        /*Check how many input_vals we have now with valid values*/
        let keys_for_missing_input_vals = Object.keys(this.input_vals).filter(k => this.input_vals[k] == undefined)

        if (keys_for_missing_input_vals.length == 1) {
            this._calculate_result_for(keys_for_missing_input_vals[0])
        } else {
            this.reset_results();
        }
    }
    _reset_for_test(){
        for (let key in this.input_vals) {
            this.data[key].result = undefined;
            this.data[key].extra = undefined;
            this.results[key]=undefined
            this.input_vals[key]=undefined;
            this.data[key].extra=undefined;
            this.data[key].result=undefined;
        }
    }
    //Obj={values:{key:val},extras:{key:[val]}}
    _test_input_field(obj,key_for_missing){
        let cnt=0;
        this._reset_for_test();
        //First we calculate all but one value
        for (let key in obj.values){
            if(key==key_for_missing){
                continue;
            }
            let value=obj.values[key]
            this.on_change_callback(key,value);
            cnt+=1;
        }
        function close_enough(a,b){
            if((a==undefined)||(b==undefined))
            console.error("Got undefined: a=",a,"b=",b,Math.abs(a-b))
            return Math.abs(a-b)<0.00001;
        }

        let expected_val=obj.values[key_for_missing];
        let calc_val=this.results[key_for_missing];
        if(!close_enough(expected_val,calc_val)){
    
            console.error("Failed for ",key_for_missing,calc_val,"expected",expected_val)


            return false;
        }
        //Next we calculate any extra's
        for (let key in obj.values){
          //  console.log("Testing extras for",key,JSON.stringify(this.data[key].extra))
            let extra=this.data[key].extra;
            if(extra){
                if (!obj.extras[key]){
                    console.error("Could not find extra tester for",key)
                    return false;
                }
                if(obj.extras[key].length!=extra.length){
                    console.error("Different extra lenghts for test",key)

                }
                for(let i=0;i<extra.length;i++){
                    
                
                    if(!close_enough(obj.extras[key][i].val,extra[i].val)){
                        console.error("Extra VAL not correct for",key,JSON.stringify(this.data[key].extra),"expected",JSON.stringify(obj.extras[key]))
                        return false;
                    }
                    if(obj.extras[key][i].unit!=extra[i].unit)
                    {
                        console.error("Extra UNIT not correct for",key,JSON.stringify(this.data[key].extra),"expected",JSON.stringify(obj.extras[key]))

                        return false;
                    }

                }
            }
            
            
        }
        return true;
    }

    self_test(obj){
        this.reset_results();
        for(let key in obj.values){
            if(this._test_input_field(obj,key)==false){
                console.error("Self test failed for field",key,JSON.stringify(obj))
                this._reset_for_test();
                return false;
            }

        }
        this._reset_for_test();
        return true;
        

    }
}