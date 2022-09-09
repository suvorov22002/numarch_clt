import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AfbcoreService } from 'afbcore';
import { ToolsService } from 'src/app/service/tools.service';
import xml2js from 'xml2js';  

@Component({
  selector: 'app-reprise',
  templateUrl: './reprise.component.html',
  styleUrls: ['./reprise.component.css']
})
export class RepriseComponent implements OnInit {

  to_index:boolean = true;
  split_in:boolean = true;
  selectedType : any;
  imageFiles:any;
  extension:string;
  objImg:any;
  xmlItems: any;
  _map:any; //Map des fichiers chargés

  qrImageCollection: Array<any> = [];
  qrRImageCollection: Array<any> = [];

  @ViewChild('fileInput', {static:false}) fileInput: ElementRef;
  fileAttr = 'Choisir document';

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

  constructor(private afbcore: AfbcoreService, private toolService : ToolsService, private _http: HttpClient) { }

  ngOnInit() {
  }

  uploadFileEvtQr(imgFile: any) {
    
  
    this.qrImageCollection = [];
    this.selectedType = this.filteredTypes[0];
    this._map = new Map();
    this.to_index = true;
   
    //this.clearAttribute();
    //console.log("File type: " + imgFile.target.files.length);
    

    if (imgFile.target.files) {
  
      this.imageFiles = imgFile.target.files;
      Array.from(this.imageFiles).forEach((element: File) => {

        const reader = new FileReader();

        reader.onload = (e: any) => {
          
          var imgBase64Path;
          imgBase64Path = '';
          const lastDot = element.name.lastIndexOf('.');
          this.extension = element.name.substring(lastDot + 1);
          var fileNom = element.name.substring(0, lastDot);
          imgBase64Path = e.target.result;
          console.log("fileNom0: " + this.extension);
          var idx = fileNom.split('_')[1];
         
          if (this.extension === 'xml') {
            /*this.parseXML(imgBase64Path)
            .then((imgBase64Path) => {
              this.xmlItems = imgBase64Path;
            });*/
            this.loadXML();
          }
         



          fileNom = 'image-'+fileNom.split('_')[0]+this.formatFileNom(idx);
          console.log("fileNom: " +  JSON.stringify(this.xmlItems));

          this.clearAttribute();
          this.objImg.image = imgBase64Path;
          this.objImg.thumbImage = imgBase64Path;
          this.objImg.title = fileNom; //element.name;
          this.objImg.alt = "";
          this.objImg.state = false;
          
          console.log("fileNom: " + fileNom);
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
    }

    parseXML(data) {  
      return new Promise(resolve => {  
        var k: string | number,  
          arr = [],  
          parser = new xml2js.Parser(  
            {  
              trim: true,  
              explicitArray: true  
            });  
        parser.parseString(data, function (err, result) {  
          var obj = result.ContentType;  
          //console.log("OBJ ",JSON.stringify(obj));
          var prop = obj.Properties
        //  console.log("OBJ ",JSON.stringify(prop[0].Property));
          var props = prop[0].Property
          var objs : any
          objs = {}
          objs.prop = ''
          objs.val = ''
         
          for (k in props) {  
            var item = props[k];  
            console.log("ITEM",item.Name+' : '+item.Value)
            objs.prop = item.Name
            objs.val = item.Value
            arr.push({  
              objs
            });  
          }  
          resolve(arr);  
        });  
      });  
    } 

    loadXML() {
    this._http.get('/assets/VERESP_001.xml',
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'text/xml')
          .append('Access-Control-Allow-Methods', 'GET')
          .append('Access-Control-Allow-Origin', '*')
          .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
        responseType: 'text'
      })
      .subscribe((data) => {
        this.parseXML(data)
          .then((data) => {
            this.xmlItems = data;
          });
      });
  } 
  
}
