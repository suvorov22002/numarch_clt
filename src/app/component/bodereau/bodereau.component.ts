import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { AfbcoreService } from 'afbcore';
import { Documents } from 'src/app/modeles/documents';
import { Proprietes } from 'src/app/modeles/proprietes';
import { TypeDocuments } from 'src/app/modeles/type-documents';
import { ToolsService } from 'src/app/service/tools.service';
import mergeImages from 'merge-images';
import { PDFDocument } from 'pdf-lib';
import { PageSizes } from 'pdf-lib';
//import { PDFDocumentFactory, PDFDocumentWriter, drawText } from 'pdf-lib';

//import * as fs from 'fs';
//import { promises as fsPromises } from 'fs';
//import * as path from 'path';
//import {readFile, writeFile, unlink} from "fs";
declare var $:any;

declare var myExtObject: any;

@Component({
  selector: 'app-bodereau',
  templateUrl: './bodereau.component.html',
  styleUrls: ['./bodereau.component.css']
})
export class BodereauComponent implements OnInit {

  logoPath = 'assets/images/numarch.jpg';
  logoPath2 = 'assets/images/archivage.png';
  mergeimage : any;
  tabmerge : any = [];

  qrImageCollection: Array<any> = [];
  qrRImageCollection: Array<any> = [];
  qrNImageCollection: Array<any[]> = [];
  all_qrpropriete : Array<any> = [];
  types:Array<TypeDocuments> = [];

  allFileIn: Array<any> = [];

  filter_map:any; // Map contenant tous les types de documents
  _map:any; //Map des fichiers chargés
  _mapC:any; //Map des fichiers chargés
  map:any; //Map des documents chargés
  mapNum:any; //Map des fichiers traité
  mapSplit:any; //Map de decoupage
  __propriete:string;
  typeDoc:TypeDocuments;
  image_in:boolean;
  instance:boolean; // controle si la pile de document dans map a deja été fusionnée
  typepdf:boolean = false;
  split_in:boolean = true;
  to_index:boolean = true;
  hidden:boolean = true;
  document:Documents;
  imageFiles:any;
  objImg:any;
  extension:any;
  searchTypes = new FormControl('');
 // searchTypes = new FormControl();

 currButtonIndex : number;
 charge : number;


  selectedType : any;
  filteredTypes = [
    { code: 'NULL', name: '' },
    { code: 'VERESP', name: 'Versement especes' },
    { code: 'RETESP', name: 'Retrait espèces' },
    { code: 'REMCHQ', name: 'Remise cheque' },
    { code: 'ACHDEV', name: 'Achat de devise' },
    { code: 'AUTNCP', name: 'Autorisation en compte' },
    { code: 'AUTRFC', name: 'Autre Flash Cash' },
    { code: 'BONCAI', name: 'Bon de Caisse' },
    { code: 'CAUTIO', name: 'Bordereau de caution' },
    { code: 'CHGESP', name: 'Change espèce' },
    { code: 'CHQBAN', name: 'Chèque Banque' },
    { code: 'CHQCRT', name: 'Chèque certifié' },
    { code: 'CLOCPT', name: 'Cloture compte' },
    { code: 'DATDAT', name: 'Bordereau DAT' },
    { code: 'DEPTER', name: 'Bordereau Dépot à Terme' },
    { code: 'DOMICI', name: 'Bordereau Domiciliation' },
    { code: 'ENVOFT', name: 'Envoi Flash Transfert' },
    { code: 'ENVOMG', name: 'Envoi Money Gram' },
    { code: 'FDCRDT', name: 'Frais Dossier Crédit' },
    { code: 'FRAISA', name: 'Frais Attestations diverses' },
    { code: 'FRSDIV', name: 'Frais Diverses' },
    { code: 'MADMAS', name: 'Bordereau MAD' },
    { code: 'OPECAI', name: 'Autres Opérations de caisse' },
    { code: 'OPECHQ', name: 'Autres Opérations de chèque' },
    { code: 'OPPOFC', name: 'Opposition Flash Cash' },
    { code: 'ORDRAP', name: 'Ordre de rapatriement' },
    { code: 'ORDTRF', name: 'Ordre de transfert' },
    { code: 'PROCUR', name: 'Bordereau Procuration' },
    { code: 'RECPFT', name: 'Reception Flash Transfert' },
    { code: 'RECPMG', name: 'Reception Money Gram' },
    { code: 'REMBFC', name: 'Remboursement Flash Cash' },
    { code: 'REMDOC', name: 'Remise Documentaire' },
    { code: 'REMIFC', name: 'Remise Flash Cash' },
    { code: 'REPRFC', name: 'Reprise Flash Cash' },
    { code: 'RETCOF', name: 'Retrait Coffre' },
    { code: 'RETDEV', name: 'Retrait Devise' },
    { code: 'RSRVFD', name: 'Réservation de fonds' },
    { code: 'TRFAVI', name: 'Transfert AVI' },
    { code: 'TRXBAN', name: 'Transaction banalisée' },
    { code: 'VERDEV', name: 'Versement Devise' },
    { code: 'VIREMT', name: 'Virement' },
    { code: 'VIRMUL', name: 'Virement multiple' },
    { code: 'VIRPER', name: 'Virement permanent' },
    { code: 'VNTDEV', name: 'Vente devise' },
    { code: 'FRSDIV', name: 'Frais Diverses' },
    { code: 'VNTEFC', name: 'Vente Flash Cash' }
  ];

  profiles = [
    {id:'dev', name:'Developer'},
    {id:'man', name:'Manager'},
    {id:'dir', name:'Directore'}
  ];
  selectedProfile : any;

  @ViewChild('fileInput', {static:false}) fileInput: ElementRef;
  fileAttr = 'Choisir document';

  constructor(private _sharedservice:ToolsService,private afbcore: AfbcoreService,private toolService : ToolsService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.qrImageCollection = [];
    this.qrNImageCollection = [];
    this.all_qrpropriete = [];
    this._map = new Map();
    this._mapC = new Map();
    this.mapNum = new Map();
    this.map = new Map();
    this.mapSplit = new Map();
    this.image_in = true;
    this.instance = false;
    this.typepdf = false;
    this.split_in = true;
    this.to_index = true;
    this.selectedType = this.filteredTypes[0];
    this.charge = 0;
    this.hidden = true;
    //this.selectedProfile = this.profiles[1];
    this.clearAttribute();

    this.getAllProperties('afbm:docx');
/*
    this.tabmerge.push(this.logoPath);
    this.tabmerge.push(this.logoPath2);

    mergeImages(this.tabmerge)
     .then( b64 => {
      console.log("B64: "+b64); 
      this.mergeimage = b64;
    });*/

     //this.getFilefromFolder();
    this.readFile();
   

  }

  sendRToAcs(){
    console.log('Report Send to ACS: ');
    

     if(this.qrRImageCollection.length){

       for (let value of this.map.values()) {
      //   console.log('value.file.to.send: '+value.doc.proprietes);
        // this.displayProgressSpinner = true;
         this.afbcore.loading(true);
   
         if(value.doc.proprietes != "" && value.doc.name != "" && value.doc.name != undefined){
      //    console.log('this file: '+value.doc.olname);
          value.doc.traiter = false;
          this.saveRToAcs(value.doc);
         }
       }
     }

     this.__propriete = "";
     this.document = new Documents();
     this.cleanStorage();
     localStorage.clear;

 
    
   
  }

   async doMerge() {

    var listeMerge = [];
    var mergOb;
    var ordObj;
    var width_max;
    var height_max;


    for (let [key, value] of this.mapNum) {
      var listDoc;
      listDoc = this.mapNum.get(key);
      listeMerge = [];
    
      mergOb = {};
      mergOb.src = ''
      mergOb.x = 0;
      mergOb.y = 0;

      ordObj = {};
      ordObj.width = 1228;
      ordObj.height = 1717;

      width_max = 1;
      height_max = 1;

        for(var i=0;i< listDoc.length;i++){
            
            var kk = (((listDoc[i].filename.split('.'))[0]).split('_'))[1];
            var orig64 = this._map.get(kk);
          //  console.log("orig64: "+orig64); 
         
          ordObj.height =  ordObj.height + 1717;
         
          mergOb.src = orig64;

          let dimension : any = await this.getDimension(orig64);
         // console.log("dimension: "+JSON.stringify(dimension));

          var fusData = {src:orig64, x:mergOb.x, y:mergOb.y};
          
          listeMerge.push(fusData);

         // mergOb.x =  mergOb.x + 52; 650
          mergOb.y = mergOb.y + dimension.height + 20;

          if(dimension.width > width_max) {
            width_max = dimension.width;
          }

          height_max = height_max + dimension.height;
        }

         // fusion des images dans un document
  
      mergeImages(listeMerge, {width:width_max, height:height_max})
      .then( b64 => {
      //  console.log("B64: "+b64); 
        //this.mergeimage = b64;
        var kimgName = (((key.split('.'))[0]).split('_'))[1];
        var docx = this.map.get(kimgName);
      //  console.log("B64: "+JSON.stringify(docx)); 
        docx.doc.base64Str = b64;
        this.map.set(kimgName, docx);
        this.mergeimage = b64;
      
        this.qrRImageCollection = [];
        var ob;
        ob = {};
        ob.filename = "";
        ob.olfilename = "";
       
        ob.filename = kimgName;
        ob.olfilename = b64;
        this.qrRImageCollection.push(ob);

        this.afbcore.loading(false);
      });

      this.instance = true;
    }

 

  }

  async doImagesPdf() {

    //const jpgUrl = 'assets/images/numarch.jpg';
   
   // const pngUrl = 'assets/images/archivage.png';
    var jpgUrl;

   
    this.afbcore.loading(true);
    for (let [key, value] of this.mapNum) {
      var listDoc;
      listDoc = this.mapNum.get(key);

      //Create pdf
      const pdfDoc = await PDFDocument.create();
      

      for(var i=0;i< listDoc.length;i++){
           var kk = (((listDoc[i].filename.split('.'))[0]).split('_'))[1];
            var orig64 = this._map.get(kk);
           
            jpgUrl = 'data:image/jpg;base64,' +orig64;

            const jpgImageBytes = await fetch(jpgUrl).then((res) => res.arrayBuffer());
          //  const pngImageBytes = await fetch(pngUrl).then((res) => res.arrayBuffer());

           
            //Embed images bytes
            const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
          //  const pngImage = await pdfDoc.embedPng(pngImageBytes);

            // Get the dimension of the image scaled down do 25% of its original size
            const jpgDims = jpgImage.scale(0.35);
          //  const pngDims = pngImage.scale(0.5);

          //  console.log("jpgDims.width: "+jpgDims.width);
          //  console.log("jpgDims.height: "+jpgDims.height)

            // Add a blank page to the document
            var page = pdfDoc.addPage(PageSizes.A4);

          //  console.log("jpage.width: "+page.getWidth());
          //  console.log("jpage.getHeight(): "+page.getHeight())

            // page=[number, number]
            /*
            const newPage1 = pdfDoc.addPage(PageSizes.A7);
            const newPage2 = pdfDoc.addPage(PageSizes.Letter);
            const newPage3 = pdfDoc.addPage([500, 750]);
            */

            // Draw the JPG image in the center of the page
            page.drawImage(jpgImage, {
              x: page.getWidth() / 2 - jpgDims.width /2,
              y: page.getHeight() /2 - jpgDims.height /2,
              width: jpgDims.width,  //575
              height: jpgDims.height, //815
            })
            // Draw the PNG image in the center of the page
          /*
            page.drawImage(pngImage, {
              x: page.getWidth() / 2 - pngDims.width /2+75,
              y: page.getHeight() /2 - pngDims.height /2,
              width: pngDims.width,
              height: pngDims.height,
            })
            */


           
      }

      
            // Serialize the PDFDocument to bytes 
            const pdfBytes = await pdfDoc.save();

            var bytes = new Uint8Array(pdfBytes);
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
        //    console.log("base64String: "+kimgName)

          //  this.mergeimage =base64String;


            var kimgName = (((key.split('.'))[0]).split('_'))[1];

            console.log("base64String: "+kimgName)
            var docx = this.map.get(kimgName);
            console.log("B64: "+JSON.stringify(docx)); 
            docx.doc.base64Str = base64String;
            docx.doc.olname = kimgName;
          //  console.log("B67: "+docx.doc.olname+" -- "+kimgName); 
            this.map.set(kimgName, docx);
           
          
            this.qrRImageCollection = [];
            var ob;
            ob = {};
            ob.filename = "";
            ob.olfilename = "";
          
            ob.filename = kimgName;
            ob.olfilename = base64String;
            this.qrRImageCollection.push(ob);

            this.split_in = true;
          //  console.log("this.mergeimage: "+this.mergeimage)

         //   var link=document.createElement('a');
         //   link.href=window.URL.createObjectURL(blob);
         //   link.download="bordereau.pdf";
         //   link.click();

    }

    this.to_index = true;
    this.instance = true;
    this.typepdf = true;
    this.afbcore.loading(false);
  }

  sendToFusion(){
    
    for (let value of this.map.values()) {
      if(value.doc.proprietes == "") {
        this.afbcore.showMessage('DANGER', 'Vous essayer de traiter des documents sans propriétés...');
        return;
      }
    }

    //this.afbcore.loading(true);
    //this.doMerge();
    this.doImagesPdf();
  }

  saveRToAcs(doc:Documents){
       
    this._sharedservice.sendToAcs(doc)
      .subscribe( items => {
        console.log("Envoi vers ACS ",items.reference);
        this.afbcore.loading(false);
      
      
        this.__propriete = "";
        this.all_qrpropriete = [];
        this.document = new Documents();

        //Vide le visualisateur
        var len = this.qrRImageCollection.length;
        this.qrRImageCollection = [];
        for(var i=0;i< len;i++){
          this.qrRImageCollection.push("");
        }

        this.qrImageCollection = [];
        for(var ii=0;ii< this.qrImageCollection.length;ii++){
          this.qrImageCollection.push("");
        }


        this.cleanStorage();
        localStorage.clear;
        
        this.charge = 0;
        this.hidden = true;
        this.fileAttr = 'Choisir document';
        this.fileInput.nativeElement.value = "";
        this.afbcore.showMessage('SUCCESS', 'Document Envoyé avec succes...');
      }, (error)=>{
      //  console.log("An error occured " , error.message);
        this.afbcore.showMessage('DANGER', 'Document non Envoyé...');
      });
  
}


  sendToAcs(){}

  onLoadQRDoc(img, index){
  //  console.log("RET img: "+img);
    localStorage.setItem("CURRENT_FILE", img);
  //  myExtObject.func1();
    this.currButtonIndex = index;
    localStorage.setItem("currButtonIndex", index);
  //  console.log("this.instance: "+this.instance);
  //  for (let [key, value] of this.mapNum) {
  //    console.log("KEY: "+key);
  //    console.log('this.mapNum: ', this.mapNum.get(key));
  //  }
  //  for (let [key, value] of this.map) {
  //    console.log("KEY: "+key);
  //    console.log('this.map: ', this.map.get(key));
 //   }
    this.mapSplit = new Map();
    var lElmt = [];
    lElmt = this.mapNum.get(img);
    if (lElmt === undefined) {
      this.afbcore.showMessage('DANGER', 'Veuillez indexer d\'abord');
      return;
    }

    var imgName = (((img.split('.'))[0]).split('_'))[1]; //clé à rechercher
  //  console.log("RET imgName: "+imgName);
    var qrDoc = this.map.get(imgName); // Document reference de la liste (contains all metadata)
    console.log("RET qrDoc: "+JSON.stringify(qrDoc));
    var prop =  qrDoc.doc.proprietes;
//    console.log("RET qrDoc: "+prop)
    
    if(prop == '') {
      
    //  console.log("RET CODE: "+localStorage.getItem('code'));
      this.cleanStorage2();

      this.split_in = false;
      _smap = new Map();
      _smap.set("afbm:trxUser",'');
      _smap.set("afbm:trxAcc",'');
      _smap.set("afbm:docType",'');
      _smap.set("afbm:docRef",'');
      _smap.set("afbm:unitCode",'');
      _smap.set("afbm:trxDate",'');
      _smap.set("afbm:trxAmount",'');

        this.all_qrpropriete = []; //Reinitialisation de la liste des propriétés et ajout des valeurs
        for (let [key, value] of _smap) {
          this._sharedservice.getPropertiesName(key)
          .subscribe(p => {
          //  console.log(':::::::::::::::::::::::::::::::::::::::::::::::  '+p);
            if (p != null) {
              var obj:Proprietes = new Proprietes();
              //  console.log("valeur ",value);
                obj.valeur = value;
                obj.properties = p;
                this.all_qrpropriete.push(obj);
            }
          });
          //break;
        }
    }
    

    var _smap = new Map();
    var splitter = prop.split("/"); 
  //  console.log('splitter: ',JSON.stringify(splitter));
    var isfill = true;
    this.__propriete = "";
    var compose;

    for(var i=0;i<splitter.length;i++){
      compose = splitter[i].split(";"); // propriete;valeur
      _smap.set(compose[0],compose[1]);
    }

    this.selectedType = this.extractType(_smap.get("afbm:docType")); 

    this.all_qrpropriete = []; //Reinitialisation de la liste des propriétés et ajout des valeurs
    for (let [key, value] of _smap) {
      this._sharedservice.getPropertiesName(key)
      .subscribe(p => {

        if (p != null) {
          var obj:Proprietes = new Proprietes();
          //  console.log("valeur ",value);
            obj.valeur = value;
            obj.properties = p;
            this.all_qrpropriete.push(obj);
        }
         
      });
      //break;
    }

    if(this.instance) {
      var kimgName = qrDoc.doc.olname
      var kimg64 = qrDoc.doc.base64Str


      this.qrRImageCollection = [];
      var ob;
      ob = {};
      ob.filename = "";
      ob.olfilename = "";
    
      ob.filename = kimgName;
      ob.olfilename = kimg64;
      this.qrRImageCollection.push(ob);
    }
    else {
      this.qrRImageCollection = [];
      lElmt.forEach(element => {
        imgName = (((element.filename.split('.'))[0]).split('_'))[1];
        
        var url = 'data:image/jpg;base64,' + this._map.get(imgName);
      //  element.olfilename = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        element.olfilename = url;
  
        this.qrRImageCollection.push(element)
      });
    }

   
  }

  // charger toutes les pièces comptables du repertoires de depot
  /**
   *  @author : suvorov
   *  @copyright : March 01/2022
   *  Cette méthode va identifier les pièces avec qrCOde lisible et ceux avec qrCode non lisible et 
   *  les grouper dans deux map différentes afin de les afficher.
   */
  loadAllQrImgDir() {

  }

  onChangeTypeQR(event){

  }

  getAllQRDocuments(){
    this._sharedservice.getAllTypeDocument()
      .subscribe(
        items => {
         // this.types = items;
          items.forEach(value => {
            if(value.name.match('afbm:docx') != null){
              this.types.push(value);
              this.filter_map.set(value.name, value.title);
            }
          });
            
        });
  }

  getAllProperties(name: string){
    this.cleanStorage();
    localStorage.clear;
    let str_propriete;
  //  console.log("name "+name);
    this._sharedservice.getTypeDocuments(name)
      .subscribe(
        values =>{
          this.typeDoc = values;
        //  console.log("values) "+ values.propertie);
          str_propriete = this.typeDoc.propertie;
      
           // console.log("pas d'aspect: ");
              localStorage.setItem('code', str_propriete.substring(1));
              var splitter = str_propriete.split("/"); 
            //  console.log("splitter.length: "+splitter.length);
              for(var i=1;i<splitter.length;i++){
            //   console.log("splitter value: "+ splitter[i]);
                if(splitter[i] != '')
                  this.get_propertiesName(splitter[i])
              }
        }
      );
  }

  get_propertiesName(name:string){
    this._sharedservice.getPropertiesName(name)
      .subscribe(
        items => {
          if(items != null){
           // this.all_qrpropriete.push(items);

            var obj:Proprietes = new Proprietes();
            obj.valeur = "";
            obj.properties = items;
            this.all_qrpropriete.push(obj);
          }
  
          if(this.all_qrpropriete.length > 0){
            //this.prop_in = false;
          }
        });
  }

  cleanStorage(){
    var code = localStorage.getItem('code');
    if(code != null){
      var splitter = code.split("/"); 
      for(var i=0;i<splitter.length;i++){
        localStorage.setItem(splitter[i], '');
        localStorage.removeItem(splitter[i]);
      }
      localStorage.setItem('code','');
      localStorage.removeItem('code');
    }
    
  }

  cleanStorage2(){
    var code = localStorage.getItem('code');
    if(code != null){
      var splitter = code.split("/"); 
      for(var i=0;i<splitter.length;i++){
        localStorage.setItem(splitter[i], '');
        localStorage.removeItem(splitter[i]);
      }
    }
    
  }

  async uploadFileEvtQr1(imgFile: any) {

    this.split_in = true;

    if (imgFile.target.files) {

      this.afbcore.loading(true);
      this.to_index = true;
     
      var blob = imgFile.target.files[0];

      var convBlobBase64 = (blob) => new Promise((resolve, reject) => {
        const reader = new FileReader;
        reader.onerror = reject;
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(blob);
      });

      const base64String = await convBlobBase64(blob);
      //console.log("EXTRACT base64String: "+base64String);
      this.toolService.processExtract(base64String)
          .subscribe(res => {
            this.allFileIn = res.ltrx;
          //  console.log("EXTRACT: "+this.allFileIn.length);
 

            this.extractor();

            this.afbcore.loading(false);
          });
    }

  }

  uploadFileEvtQr(imgFile: any) {
    
  
    this.qrImageCollection = [];
    this.qrNImageCollection = [];
    this.all_qrpropriete = [];
    this._map = new Map();
    this.mapNum = new Map();
    this.map = new Map();
    this.selectedType = this.filteredTypes[0];
    this.to_index = true;
   
    this.clearAttribute();
    //console.log("File type: " + imgFile.target.files.length);
    

    if (imgFile.target.files) {
  
      this.imageFiles = imgFile.target.files;
      Array.from(this.imageFiles).forEach((element: File) => {

        const reader = new FileReader();

        reader.onload = (e: any) => {
          
          var imgBase64Path;
          imgBase64Path = '';
          const lastDot = element.name.lastIndexOf('.');
          var fileNom = element.name.substring(0, lastDot);
          imgBase64Path = e.target.result;

          var idx = fileNom.split('-')[1];
         

          fileNom = 'image-'+this.formatFileNom(idx);
        //  console.log("fileNom: " + imgBase64Path);

          this.clearAttribute();
          this.objImg.image = imgBase64Path;
          this.objImg.thumbImage = imgBase64Path;
          this.objImg.title = fileNom; //element.name;
          this.objImg.alt = "";
          this.objImg.state = false;
          
          this.qrImageCollection.push(this.objImg);
          
          if(!this._map.has(this.objImg.title)){
            this._map.set(this.objImg.title, imgBase64Path);
          }

           
          
          this.fileAttr += element.name + ' - ';
          this.extension = element.name.substring(lastDot + 1);

        };
        reader.readAsDataURL(element);

        this.fileInput.nativeElement.value = "";
       
      });

    }
  }

  clearAttribute() {
  //  console.log('Clear Attribute');
    this.objImg = {};
    this.objImg.image = ''
    this.objImg.thumbImage = '';
    this.objImg.title = ''
    this.objImg.alt = '';
    this.objImg.state = false;
    this.objImg.width = 0;
    this.objImg.height = 0;
    this.image_in = true;
    this.instance = false;
    this.typepdf = false;
    
  }

  orderCollectFile(collection) {
   
   
  //  Array.from(collection).forEach((element:any) => {
  //    console.log("Array to sort: "+JSON.stringify(element.title));
  //  });
    //this.qrImageCollection
    //var sortedArray: string[] = collection.sort((n1,n2) => {
      this.qrImageCollection = collection.sort((n1,n2) => {
        if (n1.title > n2.title) {
            return 1;
        }

        if (n1.title < n2.title) {
            return -1;
        }

        return 0;
    });

  //  Array.from(this.qrImageCollection).forEach((element:any) => {
  //    console.log("sorted Array: "+JSON.stringify(element.title));
  //  });
  }


  extractor() {

    this.qrImageCollection = [];
    this.qrNImageCollection = [];
    this.all_qrpropriete = [];
    this._map = new Map();
    this.mapNum = new Map();
    this.map = new Map();

    this.clearAttribute();
    var idx = 0;
   

    //console.log("fileNomCASE: " + this.allFileIn[0]);

    Array.from(this.allFileIn).forEach((element: string) => {

      var imgBase64Path;
      imgBase64Path = element;
      var fileNom;
     
      fileNom = 'image-'+this.formatFileNom(idx);
      idx++;
      //console.log("fileNom: " + fileNom);

      this.clearAttribute();

      this.objImg.image = imgBase64Path;
      this.objImg.thumbImage = imgBase64Path;
      this.objImg.title = fileNom; //element.name;
      this.objImg.alt = "";
      this.objImg.state = false;
      
      this.qrImageCollection.push(this.objImg);
      
      if(!this._map.has(this.objImg.title)){
        this._map.set(this.objImg.title, imgBase64Path);
      }
     
    });

  }

  numerize() {
    this.afbcore.loading(true);

    this.typepdf = false;
  //  console.log("send doc for auto work: "+ this.qrImageCollection.length);
    if(this.qrImageCollection.length < 1){
      this.afbcore.loading(false);
      this.afbcore.showMessage('DANGER', 'Aucun document chargé');
      return;
    }
    this.orderCollectFile(this.qrImageCollection);


   
    var lDocuments:Array<Documents> = [];

    for(var l=0;l<this.qrImageCollection.length;l++){
       this.document = new Documents();
       this.document.dateEnvoi = new Date();
       this.document.name = 'afbm:docx';
       this.document.traiter = false;
       this.document.proprietes = this.__propriete;
       this.document.uti = 'AUTO';
       this.document.categ = "QRCODE";
    //   console.log('name: '+this.imgCollection1[l].title)
       this.document.base64Str = this._map.get(this.qrImageCollection[l].title);
    //   this.tabmerge.push(this.document.base64Str);

       this.document.olname = this.qrImageCollection[l].title;

       lDocuments.push(this.document);
    }

   //pour test, à enlever
  //  console.log("this.tabmerge "+this.tabmerge.length);
  //  mergeImages(this.tabmerge)
  //   .then( b64 => {
  //    console.log("B64: "+b64); 
  //    this.mergeimage = b64;
  //  });
  //  this.afbcore.loading(false);

    this.saveAutoLToAcs(lDocuments);

  }

  autoDocx(){
    console.log('send doc for auto work ',this.qrImageCollection.length)
   /*
    var code = localStorage.getItem('code');
    if(code == null){
      //this._toast.showError('Veuillez renseigner les proprietes');
      this.afbcore.showMessage('DANGER', 'Veuillez renseigner les proprietes');
      return;
    }
    var splitter = code.split("/"); 
    var isfill = true;
  
   // this.displayProgressSpinner = true;
    this.afbcore.loading(true);
    var lDocuments:Array<Documents> = [];

    for(var l=0;l<this.imgCollection1.length;l++){
       this.document = new Documents();
       this.document.dateEnvoi = new Date();
       this.document.name = this.obj.type;
       this.document.traiter = false;
       this.document.proprietes = this.__propriete;
       this.document.uti = 'AUTO';
    //   console.log('name: '+this.imgCollection1[l].title)
       this.document.base64Str = this._map.get(this.imgCollection1[l].title);
       this.document.olname = this.imgCollection1[l].title;

       lDocuments.push(this.document);
    }

    //this.saveAutoToAcs(this.document);
    this.saveAutoLToAcs(lDocuments);
   */
  }

  saveAutoLToAcs(lDocuments:Array<Documents>){
    console.log('lDocuments auto work ')
    this.qrRImageCollection = [];
    this.mapNum.clear();
    //this.mapNum = new Map();
    var _mapC = new Map();
    this._sharedservice.processAutoLb(lDocuments)
    .subscribe( items =>{
        var res = items.ltrx
        this.qrNImageCollection = res;
        var _smap = new Map();
        this.hidden = false;
        this.charge = 0;

        var nn = this.qrNImageCollection.length;
        if(nn > 0){

          //Traitement du dernier element du lot
          this.qrNImageCollection[nn-1].forEach(element => {
        //  this.qrNImageCollection[0].forEach(element => {
            var imgName = (((element.filename.split('.'))[0]).split('_'))[1];
        //    console.log("Filename: ",imgName);
          //  console.log("Base64 Filename: ",this._map.get(imgName));
            var url = 'data:image/jpg;base64,' + this._map.get(imgName);
            //           data:image/jpeg;base64,
   


          //  element.olfilename = this.sanitizer.bypassSecurityTrustResourceUrl(url);
            element.olfilename = url;
          //  console.log("Base64 Filename: ", element.olfilename);
            this.qrRImageCollection.push(element)
            this.currButtonIndex = nn-1
          });

        //  console.log("code: ",localStorage.getItem('code'));
          this.qrImageCollection = [];
          this.map = new Map();
          this.qrNImageCollection.forEach(elemt => {

          //  var imgName = (((element.filename.split('.'))[0]).split('_'))[1];
          //  element.olfilename = this._map.get(imgName);
          //  console.log(JSON.stringify(elemt));
            this.clearAttribute();

            var ltab = elemt.length; // longueur de la liste
            var pieceComptable = elemt[ltab-1]; //dernier element de la liste
          //  console.log('pieceComptable------ ',JSON.stringify(pieceComptable));
           
            var btilte = pieceComptable.filename;
           
          //  var imgName = (((btilte.filename.split('.'))[0]).split('_'))[1];

          //  elemt.olfilename = this._map.get(imgName);//
            //stocke le resultat dans une map
            if(!this.mapNum.has(btilte)){
              this.mapNum.set(btilte, elemt); //chaque entrée contient un bloc de document comptable
            }

            this.objImg.image = "";
            this.objImg.thumbImage = "";
            this.objImg.title = btilte; //element.name;
            this.objImg.alt = "";

            if(ltab > 3) {
              this.objImg.state = false;
              this.charge = this.charge + 1;
            }
            else {
              if(elemt[ltab-1].decode){
                this.objImg.state = true;
              }
              else{
                this.objImg.state = false;
                this.charge = this.charge + 1;
              }
            }
            
            this.qrImageCollection.push(this.objImg); //Collection de document deja traités à envoyer vers le serveur
            

            //**** Recuperation des valeurs des proprietes */
          
            var imgName = (((btilte.split('.'))[0]).split('_'))[1];
        //    console.log("Filename: ",imgName);
            var data = pieceComptable.eve +';'+ pieceComptable.age +';'+ pieceComptable.ncp +';'+ pieceComptable.cle +';'+ pieceComptable.dco +';'+ pieceComptable.uti +';'+ pieceComptable.mon + ';' + pieceComptable.type;
            localStorage.setItem(imgName, pieceComptable.decode);

            _smap = new Map();

         
           
            pieceComptable.uti = pieceComptable.uti == null ? '' : pieceComptable.uti
            _smap.set("afbm:trxUser",pieceComptable.uti);
            localStorage.setItem('afbm:trxUser', pieceComptable.uti);

            pieceComptable.ncp = pieceComptable.ncp == null ? '' : pieceComptable.ncp + "-" +pieceComptable.cle
            _smap.set("afbm:trxAcc",pieceComptable.ncp);
            localStorage.setItem('afbm:trxAcc', pieceComptable.ncp);

        //    pieceComptable.cle =pieceComptable.cle == null ? '' : pieceComptable.cle
        //    _smap.set("afbm:accKey",pieceComptable.cle);
        //    localStorage.setItem('afbm:accKey', pieceComptable.cle);

        //    pieceComptable.recip = pieceComptable.recip == null ? '' : pieceComptable.recip
        //    _smap.set("afbm:trxRecip",pieceComptable.recip);
        //    localStorage.setItem('afbm:trxRecip', pieceComptable.recip);
         
            pieceComptable.type = pieceComptable.type == null ? '' : pieceComptable.type
            _smap.set("afbm:docType",pieceComptable.type);
            localStorage.setItem('afbm:docType', pieceComptable.type);

            pieceComptable.eve = pieceComptable.eve == null ? '' : pieceComptable.eve
            _smap.set("afbm:docRef",pieceComptable.eve);
            localStorage.setItem('afbm:docRef', pieceComptable.eve);
         
            pieceComptable.age = pieceComptable.age == null ? '' : pieceComptable.age
            _smap.set("afbm:unitCode",pieceComptable.age);
            localStorage.setItem('afbm:unitCode', pieceComptable.age);
         
            pieceComptable.dco = pieceComptable.dco == null ? '' : pieceComptable.dco
            _smap.set("afbm:trxDate",pieceComptable.dco);
            localStorage.setItem('afbm:trxDate', pieceComptable.dco);

            pieceComptable.mon = pieceComptable.mon == null ? '' : pieceComptable.mon
            _smap.set("afbm:trxAmount",pieceComptable.mon);
            localStorage.setItem('afbm:trxAmount', pieceComptable.mon);
          //  console.log('this._smap.length: ',JSON.stringify(_smap));
            var code = localStorage.getItem('code');
            var splitter = code.split("/"); 
            var isfill = true;
            this.__propriete = "";

            for(var i=0;i<splitter.length;i++){
              var val = localStorage.getItem(splitter[i]);
              var compose = splitter[i] + ";" + val; // propriete;valeur
        
              this.__propriete = (this.__propriete == "" ? this.__propriete : this.__propriete+"/") + compose;
            }

        //    if(this.map.has(this.select_img)){
        //      console.log("Image en cours de traitement",  this.__propriete);
              var obj_docx:any;
                  obj_docx = {};
                  obj_docx.name = imgName;
                  

              this.document = new Documents();
              this.document.dateEnvoi = new Date();
              this.document.name = 'afbm:doc';
              this.document.traiter = false;
              this.document.proprietes = this.__propriete;
              this.document.olname = imgName;
              this.document.uti = 'AUTO';
              this.document.base64Str = this._map.get(imgName);
              this.document.categ = "QRCODE";
              obj_docx.doc = this.document;

            //  console.log("valeur ",  imgName);
              _mapC.set(imgName, obj_docx);
             
             
            
              this.selectedType = this.extractType(pieceComptable.type); // recupération du type de document
             // console.log(this.searchTypes.)
          });

            this.all_qrpropriete = []; //Reinitialisation de la liste des propriétés et ajout des valeurs
            for (let [key, value] of _smap) {
              this._sharedservice.getPropertiesName(key)
              .subscribe(p => {
                  var obj:Proprietes = new Proprietes();
                //  console.log("-------valeur******** ",JSON.stringify(p)+" ___ "+key);
                  if( p != null) {
                    obj.valeur = value;
                    obj.properties = p;
                    this.all_qrpropriete.push(obj);
                  }
                  
              });
              //break;
            }

            this.map = _mapC;
        //    for (let [key, value] of this.map) {
        //      console.log('this._mapC: ', this.map.get(key));
        //    }
           
          //  this.selectedType = this.filteredTypes[0];
         //   this.selectedProfile = this.profiles[2];
         //   console.log(JSON.stringify(this.selectedType));
         //   console.log('this.all_qrpropriete: ',this.map.length);
         
         
         
        }
       
        this.to_index = false;
        this.image_in = false;
        this.split_in = false;
        this.afbcore.loading(false);

        this.afbcore.showMessage('SUCCESS', nn+" dossiers trouvés.");
    }
    , (error)=>{
      console.log("An error occured " , error.message);
      this.image_in = true;
      this.to_index = true;
      this.afbcore.loading(false);
    });
  }

  getColor(title){
    var user_color = '#000000';

    if(!title){
      user_color = '#FF0000'; 
     
    }
    else{
      user_color = '#187C04';
    }
  
     return user_color;
  }

  extractType(code) : any {

    for(var i=0;i< this.filteredTypes.length;i++){
      if (this.filteredTypes[i].code.match(code) != null){
        return this.filteredTypes[i];
      }
    }

  }

  getDimension(image : string) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.src = image;

      img.onload = () => {
        resolve({width:img.width, height:img.height})
      }
    })
  }

  onChecked(obj: any, isChecked) {
   //console.log("objChecked: "+JSON.stringify(obj));
   
    if(isChecked.target.checked){
     // console.log("obj, isChecked: "+obj.filename+" __ "+isChecked.target.checked);
      this.mapSplit.set(obj.filename, obj)
    }
    else {
      if(this.mapSplit.has(obj.filename)){
        var mapInter = new Map();

        for (let [key, value] of this.mapSplit) {
           if (key != obj.filename) {
              mapInter.set(key, value);
           }
        }
        this.mapSplit = new Map();
        this.mapSplit = mapInter;
      }
    }
    
    //console.log("Taille: ", this.mapSplit.size);
  }

  split() {

    var btilte = "";
    var mapLength = this.mapSplit.size;
    var elemt = [];
    var l_elemt = [];

    if (mapLength == 0) {
      this.afbcore.showMessage('DANGER', 'Aucune image selectionnée.');
      return;
    }
   
    var cur_file = localStorage.getItem("CURRENT_FILE");

  //  console.log("Taille Collection IN: ", mapLength);
   // console.log("Collection IN: "+JSON.stringify(this.qrImageCollection));

    if(this.mapNum.has(cur_file)){
     // console.log("PILE DEDANS");
      var elem = this.mapNum.get(cur_file)

      for(var i=0;i< elem.length;i++){
       // console.log("file IN: "+elem[i].filename);
        if(!this.mapSplit.has(elem[i].filename)) {
          l_elemt.push(elem[i]);
        }
      }
    }
    this.mapNum.set(cur_file, l_elemt);

    // Mise à jour du statut de limage traité
    this.qrImageCollection.forEach(
      elem => {
       // console.log("STATE: ",elem.title);
        if(elem.title == cur_file) {
          if (l_elemt.length < 4) {
            elem.state = true;
            this.charge = this.charge - 1
            if(this.charge < 1) {
              this.hidden = true
            }
          }
        }
      
      }
    );
  //  console.log("*****************************");
  //  var el = this.mapNum.get(cur_file)

  //  for(var i=0;i< el.length;i++){
  //    console.log("file out-in: "+el[i].filename);
     
  //  }
    
    // Retrait des anciens elements dans la liste des pièces comptables 

    //for (let [key, value] of this.mapNum) {
    //  console.log(key);
   // }
   var n = 0;
  //  console.log("i+++++++++++++++++++++++++: ");
    for (let [key, value] of this.mapSplit) {

      n++;
    //  console.log("i++++: ", i);
      elemt.push(value);
    //  console.log(key);
      if(n == mapLength) {
        btilte = key;
      //  console.log("KEYY<+++++> "+key)

      var imgName = (((btilte.split('.'))[0]).split('_'))[1];

      var obj_docx:any;
      obj_docx = {};
      obj_docx.name = imgName;
      
  
      this.document = new Documents();
      this.document.dateEnvoi = new Date();
      this.document.name = 'afbm:doc';
      this.document.traiter = false;
      this.document.proprietes = "";
      this.document.olname = imgName;
      this.document.uti = 'AUTO';
      this.document.base64Str = this._map.get(imgName);
      this.document.categ = "QRCODE";
      obj_docx.doc = this.document;
  
      //  console.log("valeur ",  imgName);
      this.map.set(imgName, obj_docx);

      }
     
    }

//-----------------------------------------------------
   

//-----------------------------------------------------
    // Ajout des nouveaux elements dans la map des pièces comptables
    if(!this.mapNum.has(btilte)){
     // console.log("KEYY+++++ "+btilte)
      this.mapNum.set(btilte, elemt); //chaque entrée contient un bloc de document comptable
    }

      var objImg;
      objImg = {};
      objImg.image = "";
      objImg.thumbImage = "";
      objImg.title = btilte; //element.name;
      objImg.alt = "";
      objImg.state = false;

      this.qrImageCollection.push(objImg); //Collection de document deja traités à envoyer vers le serveur
      
      this.onLoadQRDoc(cur_file,  localStorage.getItem("currButtonIndex"));

      this.charge = this.charge + 1;
    //  console.log("Taille Collection OUT: ", this.qrImageCollection.length);
    //  console.log("Collection out: "+JSON.stringify(this.qrImageCollection));

  }

  attachDocx(){
    console.log("attachDocx: ");
    var code = localStorage.getItem('code');
  //  console.log("attachDocx code: ",  code);
    if(code == null){
      //this._toast.showError('Veuillez renseigner les proprietes');
      this.afbcore.showMessage('DANGER', 'Veuillez renseigner les proprietes');
      return;
    }
    var splitter = code.split("/"); 
    var isfill = true;
    for(var i=0;i<splitter.length;i++){
     var val = localStorage.getItem(splitter[i]);
  //   console.log("val code: ",  val);
     if(val == null || val == ''){
        isfill = false;
     }
     var compose = splitter[i] + ";" + val;

     this.__propriete = (this.__propriete == "" ? this.__propriete : this.__propriete+"/") + compose;
    }
   
    if(!isfill){
      this.afbcore.showMessage('DANGER', 'Veuillez remplir tous les champs');
      return;
    }

    var cur_file = localStorage.getItem("CURRENT_FILE");
    var imgName = (((cur_file.split('.'))[0]).split('_'))[1];

    if(this.map.has(imgName)){
      //console.log("Image en cours de traitement",  this.select_img);
      this.document = new Documents();
      this.document.dateEnvoi = new Date();
      this.document.name = 'afbm:doc';
      this.document.traiter = true;
      this.document.proprietes = this.__propriete;
      this.document.uti = 'NUMARCH';
      this.document.categ = "QRCODE";

      var o = this.map.get(imgName);
    //  console.log(o.doc.name)
     // if(o.doc.name == "" || o.doc.name == undefined)
      //  this.charge += 1;
      o.doc =  this.document;
      this.map.set(imgName, o);
     
      this.split_in = false;
       // Mise à jour du statut de limage traité
      this.qrImageCollection.forEach(
        elem => {
          //console.log("Mise à jour state: "+elem.title+" | "+imgName)
          if(elem.title == cur_file) {
            //console.log("Mise à jour state: "+elem.title)
              elem.state = true;
              this.charge = this.charge - 1;
              if (this.charge < 1) this.hidden = true;
          
          }
        }
      );
    }

  }

  formatFileNom(num:any){
   
    if (num < 10) {
      return '000'+ Number(num);
    }
    else if (num < 100) {
      return '00'+ Number(num);
    }
    else if (num < 1000) {
      return '0'+ Number(num);
    }
    else {
      return  Number(num);
    }

  }

  readFile() {
    console.log("++++ TEST FILE++++");
    
    
  }

  onSupp(title) {
   
      if ( confirm(title+" ;Voulez vous supprimer ce dossier ?") == false) {
        return;
      } else {
        
        
        var imgName = (((title.split('.'))[0]).split('_'))[1];

        if(this.map.has(imgName)){
            //alert("delete, "+imgName);
            var mapInter = new Map();

            for (let [key, value] of this.map) {
              if (key != imgName) {
                  mapInter.set(key, value);
              }
            }
            this.map = new Map();
            this.map = mapInter;



            var mapNumInter = new Map();

            for (let [ikey, ivalue] of this.mapNum) {
              if (ikey != title) {
                mapNumInter.set(ikey, ivalue);
              }
            }
            this.mapNum = new Map();
            this.mapNum = mapNumInter;


            // Mise à jour du statut de limage traité
            var qrImageCollectionInter = [];
          // console.log("ctaille avant:" + this.qrImageCollection.length)
            this.qrImageCollection.forEach(
              elem => {
                //console.log("compraison: "+elem.title+" | "+title)
                if(elem.title != title) {
                  qrImageCollectionInter.push(elem)
                }
                else {
                  if(!elem.state) {
                    this.charge = this.charge - 1;
                    if (this.charge < 1) this.hidden = true

                  }
                }
              
              }
            );

            this.qrImageCollection = []
            this.qrImageCollection = qrImageCollectionInter

        

              //Vide le visualisateur
          
            this.qrRImageCollection = [];
            this.currButtonIndex = -1;


            //console.log("ctaille apres:" + this.qrImageCollection.length)
        }

   }

  }

  onUpdate(title) {
    console.log("Update:" + title)

     // Mise à jour du statut de limage traité
     this.qrImageCollection.forEach(
      elem => {
       // console.log("Mise à jour state: "+elem.title+" | "+title)
        if(elem.title == title) {
          //console.log("Mise à jour state: "+elem.title)
          if (!elem.state){
            elem.state = true;
            this.charge = this.charge - 1;
            if (this.charge < 1) this.hidden = true;
          }
        }
      }
    );
  }
    

}
