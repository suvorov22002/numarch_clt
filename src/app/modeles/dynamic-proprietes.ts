import { FormControl } from "@angular/forms";
import { ShareService } from "../service/share.service";
import { Properties } from "./properties";
import { Proprietes } from "./proprietes";

export abstract class DynamicProprietes {

    public prop:Proprietes;
    public props:Array<Proprietes> = [];
    public control:FormControl;
    public loaded:boolean = false;
    private timeout_interval:number = 1000;
    private timeout_id;
    url:string;

    constructor(
        protected _sharedservice:ShareService
    )
    {
     // this.url = this._config.get().API_BASE_URL + this._evidences.getPath();
      this.prop = new Proprietes();
      this.props = [];
      this.prop.valeur = "";
      this.prop.properties = new Properties();
      this.control = new FormControl('');
    }

    init():any{
        return Promise.all([Promise.resolve(this.prop.properties.name)]).then((result)=>{
         //   console.log("Init result: "+result[0]);
        // console.log("PROPriETIE: "+this.prop.properties.dataType+" | "+this.prop.valeur)
            this.loaded = true;
            console.log("Init Storage "+localStorage.getItem('code'));
        
              // init form control
              if (this.prop.properties.dataType == "DATE") {
                this.control = new FormControl(new Date(this.prop.valeur) , []);
              }
              else {
                this.control = new FormControl(this.prop.valeur , []);
              }
            //  this.control = new FormControl(this.prop.valeur , []);
              this.control.valueChanges.subscribe(value => {
                //console.log("control value changes" , value , this.control.valid ,this.control.parent);
                if(this.control.valid){
                    this.prop.valeur = value;
                    this.prop.properties.name = result[0];
                //    console.log("ithis.prop.properties.name : " , this.prop.properties.name);
                    localStorage.setItem(this.prop.properties.name, this.prop.valeur);
                    this.autoSave();
                }else if(this.control.invalid){
                    console.log("invalid : " , this.control.errors);
                }
            })
    
          })
    }

    autoSave(){
        console.log("autosaved");
        this.cancelSave();
        this.timeout_id = setTimeout(()=>this.save() , this.timeout_interval)
    }
  
    cancelSave(){
        if(this.timeout_id){
            clearTimeout(this.timeout_id)
        }
        
    }
  
    save(){
      this.props.push(this.prop);
    //  console.log("Save "+this.props.length);
      //localStorage.setItem('code', this._code);
    //  this.props.forEach(function (value) {
    //    console.log(value);
    //   });
    //   var code = localStorage.getItem('code');
    //   var splitter = code.split("/"); 
    //   for(var i=0;i<splitter.length;i++){
    //    console.log("code: "+splitter[i] + " , Storage valeur: "+localStorage.getItem(splitter[i]));
    //   }
      
    }

}
