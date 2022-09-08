import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AfbcoreService } from 'afbcore';
import { environment } from 'src/environments/environment';
import { DataType } from '../enumeration/data-type.enum';
import { Documents } from '../modeles/documents';
import { ObjectAcs } from '../modeles/object-acs';
import { Properties } from '../modeles/properties';
import { CrudService } from './crud.service';
import { DocumentService } from './document.service';
import { ParamsService } from './params.service';
import { ParentService } from './parent.service';
import { PropertiesService } from './properties.service';
import { ShareService } from './share.service';
import { TypeDocumentsService } from './type-documents.service';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {

  url: string = "";
  url_1:string = "";
  url_3:string = "";
  url_2:string = "";
  url_4:string = "";
  uri:string = "http://192.168.11.36:8080/alfresco/service";

  constructor(
    private _typedoc:TypeDocumentsService,
    private _propservice:PropertiesService,
    private _docservice:DocumentService,
    private _parentservice:ParentService,
    private _paramservice:ParamsService,
    private _objservice:CrudService<any>,
    private http:HttpClient,
    private afbcore:AfbcoreService,
    private  service:ShareService
  ) {
   this.service.apiHost = environment.API_BASE_URL;
  console.log("URL apiHost: "+this.service.apiHost);
    this.url = this.service.apiHost + this._typedoc.getPath();
    this.url_1 = this.service.apiHost + this._propservice.getPath();
    this.url_2 = this.service.apiHost + this._docservice.getPath();
    this.url_3 = this.service.apiHost + this._parentservice.getPath();
    this.url_4 = this.service.apiHost + this._paramservice.getPath();
   }

    // Liste de tous les types de documents
    getAllTypeDocument(){
      console.log("URL TYPEDOC: "+this.url);
      return this._typedoc.list(this.url, "/getall")
   }

   // Type de documents par name
   getTypeDocuments(name){
      return this._typedoc.get(this.url+"/findbyname", name);
   }

   // Liste des properties par name
   getPropertiesName(name){
      return this._propservice.get(this.url_1 + "/findbyname", name)
   }

   //Envoi des documents vers ACS
   sendToAcs(doc){
      return this._docservice.create(this.url_2 + "/add",  doc)
   }

   //Envoi manuel des documents vers ACS
   sendManualToAcs(ref){
      return this._docservice.get(this.url_2 + "/findbyref",  ref)
   }

   //Envoi d'une piece comptable
   processAuto(doc){
         return this._docservice.createAuto(this.url_2 + "/addtrx",  doc)
   }
  
     //Envoi des pieces comptables
   processAutoL(ldoc){
      return this._docservice.createAuto(this.url_2 + "/addtrxs",  ldoc)
   }

   processAutoLb(ldoc){
      return this._docservice.createAuto(this.url_2 + "/addftrxs",  ldoc)
   }

   processExtract(data){
      return this._docservice.createAuto(this.url_2 + "/get-img",  data)
   }

    //Envoi des pieces comptables
   getDocById(id){
      return this._docservice.get(this.url_2 + "/findbyid",  id)
   }

   //Envoi des documents vers ACS
   //_sendToAcs(doc:Documents,s_file:string){
   _sendToAcs(doc:Documents){
     let obj:ObjectAcs = new ObjectAcs();
     obj.doc = doc;
     //obj.file = s_file;
    // return this._docservice._createACS(this.url_2 + "/sendToAcs",  obj)
     return this._docservice.create(this.url_2 + "/sendToAcs" , doc)
   }

   /** recuperer les types de document d'ACS */
   getAllACS(){
      return this._objservice.list(this.uri, "/api/dictionary")
   }

   /** create type de documents */
   createTypeDoc(doc){
      return this._typedoc.create(this.url + "/add" , doc)
   }

   /** create properties */
   createProperties(prop){
      return this._propservice.create(this.url_1 + "/add" , prop)
   }

   /** create parent */
   createParent(parent){
      return this._parentservice.create(this.url_3 + "/add" , parent)
   }

   /** read ACS */
   _retrieveDateTypeFromAcs(datatype:string, prop:Properties){
      if(datatype.includes('text')){
         prop.dataType = DataType.TEXT;
      }
      else if(datatype.includes('boolean')){
         prop.dataType = DataType.COMBOBOX;
      }
      else if(datatype.includes('date')){
         prop.dataType = DataType.DATE
      }
      else if(datatype.includes('content')){
         prop.dataType = DataType.CONTENT
      }
      else if(datatype.includes('int') || datatype.includes('long') || datatype.includes('float')){
         prop.dataType = DataType.NUMBER
      }
      else{
         prop.dataType = DataType.TEXT;
      }

      return prop;
   }

   getAllDocxSend(){
      return this._docservice.list(this.url_2, "/getall")
   }

   getAllParams(){
      return this._paramservice.list(this.url_4, "/getall")
   }

   /** Add one parameter */
   createParams(param){
      return this._paramservice.create(this.url_4 + "/add" , param)
   }


   async _base64ToArrayBuffer(base64) {
      var encodedImg = base64.split(",")[1];
     // console.log("encodedImg: "+encodedImg)
      var binary_string //= encodedImg.replace(/\\n/g, '');
      binary_string = window.atob(encodedImg);
      var len = binary_string.length;
      var bytes = new Uint8Array(len);
      for (var i=0; i<len;i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
   //   console.log("encodedImg: "+bytes.buffer)
   //   return bytes.buffer;
      var blob = new Blob([bytes], {type: "application/pdf"});
      var convBlobBase64 = (blob) => new Promise((resolve, reject) => {
         const reader = new FileReader;
         reader.onerror = reject;
         reader.onload = () => {
         resolve(reader.result);
         };
         reader.readAsDataURL(blob);
      });

      const base64String = await convBlobBase64(blob);
      console.log("encodedImg: "+base64String)
      return base64String;
   }

}
