import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DynamicProprietes } from 'src/app/modeles/dynamic-proprietes';
import { Properties } from 'src/app/modeles/properties';
import { Proprietes } from 'src/app/modeles/proprietes';
import { ShareService } from 'src/app/service/share.service';
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-properties-form',
  templateUrl: './properties-form.component.html',
  styleUrls: ['./properties-form.component.css'],
  providers: [DatePipe]
})
export class PropertiesFormComponent  extends DynamicProprietes implements OnInit {

  @Input('properties')
  properties;

  obj:Proprietes;
  datValue = new Date();

  maxlength:number = 100;
  minLength:number = 3;
  type:any;
  date:string;
  testForm: FormGroup;

  

  constructor( protected _sharedservice:ShareService,private datePipe: DatePipe) {
    super(_sharedservice);
  }

  ngOnInit() {
    //this.obj = new Proprietes();
    //this.full_documents(this.properties);
    this.obj = this.properties;
    this.prop = this.obj;
    //console.log("Day: ", this.obj.properties);
    if (this.obj.properties != null) {
      if (this.obj.properties.dataType === 'DATE') {
        if(this.obj.valeur != ''){
        //  console.log("Console date: ", this.obj.valeur+' '+this.obj.valeur.length);
         // console.log("Day: ", this.obj.valeur.substring(0,2));
         // console.log("Month: ", this.obj.valeur.substring(2,4));
         // console.log("Day: ", this.obj.valeur.substring(4,8));
          var convDate = this.obj.valeur.substring(4,8) + '-' + this.obj.valeur.substring(2,4) + '-' + this.obj.valeur.substring(0,2);
        //  this.prop.valeur = new Date(convDate.toString())+''
          this.prop.valeur = convDate;
         // this.control = new FormControl(new Date(convDate.toString()));
  
          //return;
        }
       
      }
    }
    


    
    this.init();
  }
/*
  full_documents(p:Properties){
    this.obj = new Proprietes();
    this.obj.valeur = "";
    this.obj.properties = p; 
    //console.log("properties : " , p.name);
  }
*/
  full_documents(p:Proprietes){
    this.obj = p;
    //console.log("properties : " , p);
  }

  getErrorMessage(){
    return 'Veuillez remplir le champ';
  }


}
