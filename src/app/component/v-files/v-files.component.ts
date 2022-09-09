import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, Renderer2, VERSION, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AfbcoreService } from 'afbcore';
import { PageSizes, PDFDocument, PDFName, PDFRawStream } from 'pdf-lib';
import { Observable } from 'rxjs';
import { debounceTime, tap, switchMap, finalize, startWith, map } from 'rxjs/operators';
import { Bordereau } from 'src/app/modeles/bordereau';

import { Documents } from 'src/app/modeles/documents';
import { Parent } from 'src/app/modeles/parent';
import { Properties } from 'src/app/modeles/properties';
import { Proprietes } from 'src/app/modeles/proprietes';
import { TypeDocuments } from 'src/app/modeles/type-documents';
import { ToastService } from 'src/app/service/helper/toast.service';
import { ShareService } from 'src/app/service/share.service';
import { ToolsService } from 'src/app/service/tools.service';

//import {startWith} from 'rxjs/operators/startWith';
//import {map} from 'rxjs/operators/map';

@Component({
  selector: 'app-v-files',
  templateUrl: './v-files.component.html',
  styleUrls: ['./v-files.component.css'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class VFilesComponent implements OnInit {

   valor:string = 'test';
//  filteredCountries: Array<TypeDocuments> = [];
  
  @Input() page : any;

  searchTypes = new FormControl();
  filteredMovies: any;
  isLoading = false;
  errorMsg: string;
  filteredTypes: Observable<any[]>;

  name = 'Angular ' + VERSION.major;
  dataimage:any;
  imageFiles:any;
  image_in:boolean;
  auto_in:boolean;
  doc_in:boolean;
  prop_in:boolean;
  valid_in:boolean;
  instance:boolean; // controle si la pile de document dans map a deja été fusionnée
  s_file:File;
  blob_file:string;
  imgCollection1: Array<any> = [];
  objImg:any;
  l_obj:any;
  map:any;
  _map:any; //Map des fichiers chargés
  filter_map:any; // Map contenant tous les types de documents
  select_img:any;

  @ViewChild('fileInput', {static:false}) fileInput: ElementRef;
  fileAttr = 'Choisir document';
  
  types:Array<TypeDocuments> = [];
  typeDoc:TypeDocuments;
  obj:any;
  all_properties:Array<Properties> = [];
  all_propriete:Array<Proprietes> = [];
  document:Documents;
  __propriete:string;
  typ:Array<TypeDocuments> = [];
  hidden:boolean = true;
  sattach:number = 0;
  extension:string;

  color = 'warn';
  mode = 'indeterminate';
  value = 50;
  displayProgressSpinner = false;
  spinnerWithoutBackdrop = false;

  charge:number;
  bord:Bordereau;

  pdfSource =  "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  typepdf:boolean = false;
 
  mergeimage : any;
  mergeimage2 : any;
  imageSource : any

  constructor(
    private _sharedservice:ToolsService,
    private _toast: ToastService,
    private afbcore: AfbcoreService,
    private _router: Router,
    private render : Renderer2,
    private sanitizer: DomSanitizer,
    private toolService : ToolsService
  ) 
  { 
    
  }

  getSantizeUrl(url : string) {
    url = 'data:application/pdf;base64,' + url;
    //return this.sanitizer.bypassSecurityTrustUrl(url);
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  filterTypes(name: string) {
    return this.types.filter(state =>
      state.title.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  onEnter(evt: any){
    if (evt.source.selected) {
    alert("hello "+evt.source.value);
    }
  }

  ngOnInit() {
    
    this.obj = {};
    this.obj.type = null;
    this.l_obj = {};
    this.l_obj.name = "";
    this.map = new Map();
    this._map = new Map();
    this.filter_map = new Map();
    this.document = new Documents();
    this.__propriete = "";
    this.getAllTypDocuments();
    this.image_in = true;
    this.auto_in = true;
    this.prop_in = true;
    this.doc_in = true;
    this.valid_in = true;
    this.instance = false;
    this.typ = [];
    this.color = 'warn';
    this.imgCollection1 = [];
    this.objImg = {};
    this.objImg.image = "";
    this.objImg.thumbImage = "";
    this.objImg.title = "";
    this.objImg.alt = "";
    this.select_img = "";
    this.charge = 0;

   //this.countries = this.types;
   // this.getAllAcs();
    localStorage.clear;
  }

  uploadFileEvt(imgFile: any) {
    if (imgFile.target.files && imgFile.target.files[0]) {
      this.fileAttr = '';
      Array.from(imgFile.target.files).forEach((file: File) => {
        this.fileAttr += file.name + ' - ';
        this.s_file = <File>imgFile.target.files[0];
        //console.log("File type: "+this.s_file.size);
      });

      // HTML5 FileReader API
      let reader = new FileReader();
      reader.onload = (e: any) => {
        let image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          let imgBase64Path = e.target.result;
         // console.log(imgBase64Path);
        this.blob_file = imgBase64Path;
          this.dataimage = imgBase64Path;
        };
      };
      reader.readAsDataURL(imgFile.target.files[0]);
      this.image_in = false;
      // Reset if duplicate image uploaded again
      this.fileInput.nativeElement.value = "";
    } else {
      this.fileAttr = 'Choisir document';
    }
  }

  
  async uploadFileEvt1(imgFile: any) {
   // this.reloadCurrentRoute();
    this.imgCollection1 = [];
    this.valid_in = true;
    this.image_in = true;
    this.doc_in = true;
    this.prop_in = true;
    this.auto_in = true
    this.charge = 0;
    this.map.clear();
    localStorage.clear();

  //  console.log("File type: " + imgFile.target.files.length);
    
    if (imgFile.target.files) {
       this.imageFiles = imgFile.target.files;
       this.fileAttr = '';
       var valid_extension:boolean = true;
       var f = this.imageFiles[0];
       var fDot = f.name.lastIndexOf('.');
       var ext =  f.name.substring(fDot + 1);

      /* verification de l'unicité du type */
      Array.from(this.imageFiles).forEach((ele: File) => {
        console.log("this.imageFiles length: " + this.imageFiles.length + " | " + ele.name);
        const lastDot = ele.name.lastIndexOf('.');
        this.extension = ele.name.substring(lastDot + 1);

        if(this.extension != ext){
          //this._toast.showError('Bien vouloir charger les fichiers de même type!!\nPDF ou Images');
          this.afbcore.showMessage('DANGER', 'Bien vouloir charger les fichiers de même type!!\nPDF ou Images');
          valid_extension = false;
          return;
        }

      });
      if(!valid_extension){
        return;
      }

    //  console.log("File length: " + imgFile.target.files.length);
      if( this.imageFiles.length > 1){
        this.doc_in = false;
        this.valid_in = false;
      }
      else{
        this.image_in = false;
        this.loadFilterTypeDocx();
      }
        
      this.imgCollection1 = [];
      Array.from(this.imageFiles).forEach((element: File) => {
        console.log("File length why: " + this.imageFiles.length);
        const reader = new FileReader();
        this.afbcore.loading(true);
        reader.onload = async (e: any) => {
          
          var imgBase64Path;
          imgBase64Path = '';
          const lastDot = element.name.lastIndexOf('.');
          var fileNom = element.name.substring(0, lastDot);
          imgBase64Path = e.target.result;
          console.log("fileNom: " + fileNom);

          this.clearAttribute();
          this.objImg.image = imgBase64Path;
          this.objImg.thumbImage = imgBase64Path;
          this.objImg.title = fileNom; //element.name;
          this.objImg.alt = "";
        //  this.imgCollection1.push(this.objImg);

          this.fileAttr += element.name + ' - ';
          this.extension = element.name.substring(lastDot + 1);

// test d'extraction des images ****************************************

/*
          this.toolService.processExtract(imgBase64Path)
          .subscribe(res => {
            var ele = res.ltrx;
            console.log("EXTRACT: "+ele.length);
          });

    /*     
          const pdfDoc = await PDFDocument.load(imgBase64Path);
          
          // Define some variables we'll use in a moment
          const imagesInDoc = [];
          let objectIdx = 0;

          const pages = pdfDoc.getPages();
          console.log("PAGESxxxx: "+pages.length)

       //   pages[0].doc.context.indirectObjects

          const page  = pages[0];
          const pdfDoc2 = await PDFDocument.create();

          const [existingPage] = await pdfDoc2.copyPages(pdfDoc, [0])
          pdfDoc2.addPage(existingPage)


          const pdfBytes = await pdfDoc2.save();
          var bytes = new Uint8Array(pdfBytes);
          var blob = new Blob([bytes], {type: "image/jpg"});

          var convBlobBase64 = (blob) => new Promise((resolve, reject) => {
            const reader = new FileReader;
            reader.onerror = reject;
            reader.onload = () => {
              resolve(reader.result);
            };
            reader.readAsDataURL(blob);
          });

          const base64String2 = await convBlobBase64(blob);
          console.log("test  fgdgfbdf : "+base64String2);
          this.imageSource  = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' 
          + base64String2);
*/
  //        var image22 = this.mergeimage2.split(",")[1];

  //        this.imageSource = "data:image/png;base64,"+"image22";
          //this.imageSource = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${image22}`);
  //        console.log("test  fgdgfbdf : "+this.imageSource);

          

// fin test d'extraction des images *************************************

          console.log("Extension: "+this.extension);
          if(this.extension === 'pdf'){

            var encodedImg = imgBase64Path.split(",")[1];
          // console.log("encodedImg: "+encodedImg)



         


            var binary_string //= encodedImg.replace(/\\n/g, '');
            binary_string = window.atob(encodedImg);
            var len = binary_string.length;
            var bytes = new Uint8Array(len);
            for (var i=0; i<len;i++) {
              bytes[i] = binary_string.charCodeAt(i);
            }
         
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


            this.mergeimage = base64String;//this.toolService._base64ToArrayBuffer(imgBase64Path);
            this.objImg.image = this.mergeimage
     //       console.log("encodedImg: "+this.mergeimage)
            this.imgCollection1.push(this.objImg);
            this.typepdf = true;
          //  this.imgCollection1.push(this.objImg);
            if(!this._map.has(this.objImg.title)){
              this._map.set(this.objImg.title, imgBase64Path);
            }
          }
          else{
            this.imgCollection1.push(this.objImg);
            const image = new Image();
            image.src = e.target.result;
  
            image.onload = rs => {
             
              this.typepdf = false;
              const img_height = rs.currentTarget['height'];
              const img_width = rs.currentTarget['width'];
  
          //    this.imgCollection1.push(this.objImg);
              
              if(!this._map.has(this.objImg.title)){
                this._map.set(this.objImg.title, imgBase64Path);
              }
             // console.log("this.imgCollection1: "+this.objImg.title);
            };
          }
          this.afbcore.loading(false);
        };
        reader.readAsDataURL(element);
  
        // Reset if duplicate image uploaded again
        this.fileInput.nativeElement.value = "";
      });
     
    }else {
      this.fileAttr = 'Choisir document';
    }
  }

  clearAttribute() {
    this.objImg = {};
    this.objImg.image = ''
    this.objImg.thumbImage = '';
    this.objImg.title = ''
    this.objImg.alt = '';
  }

  reloadCurrentRoute() {
    let currentUrl = this._router.url;
    this._router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this._router.navigate([VFilesComponent]);
        console.log(currentUrl);
    });
  }

  loadDocx(){
    this.imgCollection1 = [];
    this.objImg = {};
    this.objImg.image = "";
    this.objImg.thumbImage = "";
    this.objImg.title = "";
    this.objImg.alt = "";
    this.imgCollection1.push(this.objImg);
   /* Array.from(this.imageFiles).forEach((element: File) => {
      console.log("File length: " + this.imageFiles.length);
      var reader = new FileReader();
    
      reader.onload = (e: any) => {
        var image = new Image();
        image.src = e.target.result;

        image.onload = rs => {
          var imgBase64Path = e.target.result;
        //  console.log("image: ",rs);

          this.fileAttr += element.name + ' - ';
     
          console.log("File type: "+element.name);
    
          var objjImg:any;
          objjImg = {};
          objjImg.image = imgBase64Path;
          objjImg.thumbImage = imgBase64Path;
          objjImg.title = element.name;
          objjImg.alt = "";
          this.imgCollection1.push(objjImg);
          
          if(!this._map.has(this.objImg.title)){
            this._map.set(this.objImg.title, imgBase64Path);
          }
          console.log("this.imgCollection1: "+this.imgCollection1[0].title);
        };
      };
      reader.readAsDataURL(element);
      this.fileInput.nativeElement.value = "";
    });*/
  }

  _filter(value: string): TypeDocuments[] {
    const filterValue = value.toLowerCase();
    return this.types.filter(option => option.title.toLowerCase().includes(filterValue));
  }
  
  getAllTypDocuments(){
    this._sharedservice.getAllTypeDocument()
      .subscribe(
        items => {
         // this.types = items;
          items.forEach(value => {
            if(value.name.startsWith('afbm') && !value.title.includes('Folder') && !value.title.includes('folder') && !value.isAspect){
              this.types.push(value);
              this.filter_map.set(value.name, value.title);
            }
          });
            
        });

        
       


/*

     this.searchTypes.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.errorMsg = "";
          this.types = [];
          this.isLoading = true;
        }),
        switchMap(value => this._sharedservice.getAllTypeDocument()
          .pipe(
            finalize(() => {
              console.log("value: ",value);
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe(data => {
        console.log(data);
        this.types = data;
        if (data == undefined) {
          this.errorMsg = data['Error'];
          this.types = [];
        } else {
          this.errorMsg = "";
          this.types = data;
        }

        console.log(this.types);
      });
*/

  }
 

  _onChangeTypeDoc(documents){
    
    console.log("this.obj.type ",documents.value);
    this.__propriete = "";
    this.all_properties = [];
    this.all_propriete = [];
    this.getAllProperties(documents.value);
    //console.log("this.obj.type ",documents.value);
  }

  onChangeTypeDoc(evt){
    //console.log("evt-source.o: ",evt);
    var cle_type = "";
    if (evt.source.selected && evt.isUserInput) {
      var str1 = new String( evt.source.value );
      for (let [key, value] of this.filter_map) {
        //console.log(key, value);        
        var index = str1.localeCompare(value);  
        if(index == 0){
         
          cle_type = key;
        } 
      }
      this.auto_in = true;
 
      if(cle_type.match('afbm:doc') !== null){
         this.auto_in = false;
      }
      this.__propriete = "";
      this.all_properties = [];
      this.all_propriete = [];
      var val;

      if(this.filter_map.has(evt.source.value)){
        val = evt.source.value;
        this.obj.type = val;
        
      }
      else{
        for (let [key, value] of this.filter_map) {
          //console.log(key, value);
          if(value === evt.source.value){
            //evt.source.value = key;
            val = key;
            this.obj.type = val;
            break;
            //this.getAllProperties(val);
          }
        }
      }

      if(cle_type.match('afbm:doc') !== null){
        this.obj.type = 'afbm:doc';
      }
      this.getAllProperties(val);
    }
  }

  onLoadDoc(img){
    this.loadFilterTypeDocx();
  //  console.log("img ",img);
    console.log("img ",img.value);
    var obj_docx:any;
    obj_docx = {};
    obj_docx.name = img.value
    obj_docx.doc = new Documents();
    obj_docx.doc.olname = img.value;
    //obj_docx.file = this._map.get(img.value)
    
    this.select_img = img.value;

    if(this._map.has(this.select_img)){
      // console.log("img file ",this._map.get(this.select_img));
       obj_docx.file = this._map.get(this.select_img) //recharge l'image
    }
    this.prop_in = true;
    if(!this.map.has(this.select_img)){
      this.map.set(this.select_img, obj_docx);
      console.log('NOT RETRIEVE')
    }
    else{
      var retObj = this.map.get(this.select_img);
      //console.log('RETRIEVE')
     // console.log("recorded properties: ",retObj.doc.proprietes);
     // console.log("recorded properties: ",retObj.name);
      // Des données peuvent avoir deja été remplies on recupère
      if(retObj.doc.proprietes != undefined){
        this.all_propriete = [];
        this.prop_in = false;
        var recProp = retObj.doc.proprietes.split("/");
        let smap = new Map();
        for(var i=0;i<recProp.length;i++){
           
            //console.log(recProp[i].split(";")[0]+" = "+recProp[i].split(";")[1]+" -- "+this.prop_in);
            var value = recProp[i].split(";")[1];
            var name = recProp[i].split(";")[0];
            smap.set(name,value);
            this._sharedservice.getPropertiesName(name)
            .subscribe(p => {
                var obj:Proprietes = new Proprietes();
                //console.log("valeur ",value);
                obj.valeur = smap.get(p.name);
                obj.properties = p;
                this.all_propriete.push(obj);
            });
            
         
        }
       
      }
     
      //this.getAllProperties(val);
    }
    this.image_in = false;
   
    
  }

  onLoadDoc1(img){
    this.loadFilterTypeDocx();
    console.log("img ",img);
    this.l_obj.name = img;
    var obj_docx:any;
    obj_docx = {};
    obj_docx.name = img
    obj_docx.doc = new Documents();
    //obj_docx.file = this._map.get(img.value)
    
    this.select_img = img;

    if(this._map.has(this.select_img)){
      // console.log("img file ",this._map.get(this.select_img));
       obj_docx.file = this._map.get(this.select_img)
    }
    this.prop_in = true;
    if(!this.map.has(this.select_img)){
      this.map.set(this.select_img, obj_docx);
      
    }
    else{
      var retObj = this.map.get(this.select_img);
     // console.log("recorded properties: ",retObj.doc.proprietes);
     // console.log("recorded properties: ",retObj.name);
      // Des données peuvent avoir deja été remplies on recupère
      if(retObj.doc.proprietes != undefined){
        this.all_propriete = [];
        this.prop_in = false;
        var recProp = retObj.doc.proprietes.split("/");
        let smap = new Map();
        for(var i=0;i<recProp.length;i++){
           
            //console.log(recProp[i].split(";")[0]+" = "+recProp[i].split(";")[1]+" -- "+this.prop_in);
            var value = recProp[i].split(";")[1];
            var name = recProp[i].split(";")[0];
            smap.set(name,value);
            this._sharedservice.getPropertiesName(name)
            .subscribe(p => {
                var obj:Proprietes = new Proprietes();
                //console.log("valeur ",value);
                obj.valeur = smap.get(p.name);
                obj.properties = p;
                this.all_propriete.push(obj);
            });
            
         
        }
       
      }
     
      //this.getAllProperties(val);
    }
    this.image_in = false;
   
    
  }

  loadFilterTypeDocx(){
    this.filteredTypes = new Observable<any[]>();
    this.searchTypes = new FormControl();
    this.filteredTypes = this.searchTypes.valueChanges
      .pipe(
        startWith(''),
        //map(state => state ? this.filterTypes(state) : this.types.slice())
        map(value => this._filter(value))
      );
  }

  getAllProperties(name:string){
    this.cleanStorage();
    localStorage.clear;
    let str_propriete;
    console.log("name "+name);
    this._sharedservice.getTypeDocuments(name)
      .subscribe(
        values =>{
          this.typeDoc = values;
          console.log("values) "+ values.propertie);
          str_propriete = this.typeDoc.propertie;
        //  console.log("str_propriete.substring(1) "+ str_propriete.substring(1));
        //Recherche les proprietes du parent

          // to implemented

        //recherche des aspects

        if(this.typeDoc.defaultAspects && this.typeDoc.defaultAspects != ""){
            var aspectSlit = this.typeDoc.defaultAspects.split("/")
            var _aspectSlit = [];
            for(var i=0;i<aspectSlit.length;i++){
            //   console.log("aspectSlit value: "+ aspectSlit[i]);
               if(aspectSlit[i].startsWith('afbm')){
                  _aspectSlit.push(aspectSlit[i]);
                 /* this._sharedservice.getTypeDocuments(aspectSlit[i].trim())
                    .subscribe( aspect => {
                     console.log("aspectSlit ret: "+ aspect.propertie); 
                   // if(aspect.name.startsWith('afbm'))
                        str_propriete = str_propriete + aspect.propertie;
                        console.log("str_propriete.substring(2) "+ str_propriete.substring(1));
                        localStorage.setItem('code', str_propriete.substring(1));
                        var splitter = str_propriete.split("/"); 

                        console.log("splitter length: "+ splitter.length);
                        for(var i=1;i<splitter.length;i++){
                          //console.log("splitter value: "+ splitter[i]);
                          if(splitter[i] != '')
                             this.get_propertiesName(splitter[i])
                        }

                        //console.log("this.all_properties.length ",this.all_properties.length)
              
                    });*/
               }
               
             }
          //   console.log("_aspectSlit length: "+ _aspectSlit.length+" P: "+str_propriete);
             if(_aspectSlit.length > 0){
                for(var i=0;i<_aspectSlit.length;i++){
                  this._sharedservice.getTypeDocuments(_aspectSlit[i].trim())
                  .subscribe( aspect => {
            //      console.log("aspectSlit ret: "+ aspect.propertie); 
                // if(aspect.name.startsWith('afbm'))
                      str_propriete = str_propriete + aspect.propertie;
                //      console.log("str_propriete.substring(2) "+ str_propriete.substring(1));
                      localStorage.setItem('code', str_propriete.substring(1));
                      var splitter = str_propriete.split("/"); 

                  //    console.log("splitter length: "+ splitter.length);
                      for(var i=1;i<splitter.length;i++){
                        //console.log("splitter value: "+ splitter[i]);
                        if(splitter[i] != '')
                          this.get_propertiesName(splitter[i])
                      }

                     // console.log("this.all_properties.length ",this.all_properties.length)
            
                  });
              }

              
             }
             else{
                localStorage.setItem('code', str_propriete.substring(1));
                var splitter = str_propriete.split("/"); 

            //    console.log("splitter length: "+ splitter.length);
                for(var i=1;i<splitter.length;i++){
                  //console.log("splitter value: "+ splitter[i]);
                  if(splitter[i] != '')
                    this.get_propertiesName(splitter[i])
                }

             }
             

          }
          else{
           // console.log("pas d'aspect: ");
              localStorage.setItem('code', str_propriete.substring(1));
              var splitter = str_propriete.split("/"); 

              for(var i=1;i<splitter.length;i++){
              // console.log("splitter value: "+ splitter[i]);
                if(splitter[i] != '')
                  this.get_propertiesName(splitter[i])
              }

          }

        
        }
      );
  }

  get_propertiesName(name:string){
    this._sharedservice.getPropertiesName(name)
      .subscribe(
        items => {
          if(items != null){
            this.all_properties.push(items);

            var obj:Proprietes = new Proprietes();
            obj.valeur = "";
            obj.properties = items;
            this.all_propriete.push(obj);
          }
         
          
          if(this.all_properties.length > 0){
            this.prop_in = false;
          }
        });
  }

  sendToAcs(){
    console.log('Send to ACS: '+this.obj.type);
   // console.log("this.obj.type ",this.obj.type);
    if( this.imgCollection1.length > 1 && this.charge > 1){
    
      for (let value of this.map.values()) {
        console.log('value.file: '+value.file);
        //this.displayProgressSpinner = true;
        this.afbcore.loading(true);
        if(value.doc.title != "" && value.doc.title != undefined)
          //this.saveToAcs(value.doc, value.file);
          this.saveToAcs(value.doc);
      }

    }
    else if( this.imgCollection1.length > 1 && this.charge == 0){
        this._toast.showError('Envoi multiple \nAucun document attaché');
        return;
    }
    else{
      var code = localStorage.getItem('code');
      if(code == null){
        this._toast.showError('Veuillez renseigner les proprietes');
        return;
      }
      var splitter = code.split("/"); 
      var isfill = true;
      for(var i=0;i<splitter.length;i++){
       var val = localStorage.getItem(splitter[i]);
       if(val == null || val == ''){
          isfill = false;
       }
       var compose = splitter[i] + ";" + val;
  
       this.__propriete = (this.__propriete == "" ? this.__propriete : this.__propriete+"/") + compose;
      }
      console.log(this.__propriete);
      if(!isfill){
        //this._toast.showError('Veuillez remplir tous les champs');
        this.afbcore.showMessage('DANGER', 'Veuillez remplir tous les champs');
        return;
      }
      //this.displayProgressSpinner = true;
      this.afbcore.loading(true);
      this.document.dateEnvoi = new Date();
      this.document.name = this.obj.type;
      this.document.traiter = true;
      this.document.proprietes = this.__propriete;
      this.document.uti = 'NUMARCH';
      this.document.categ = "CLASSIC";
      this.document.base64Str = this._map.get(this.objImg.title);
      this.document.olname = this.objImg.title;
    //  console.log(this.document.proprietes);
     // var blob = this._map.get(this.objImg.title);
    //  this.saveToAcs(this.document, blob);
      this.saveToAcs(this.document);

    }
    

    this.__propriete = "";
    this.document = new Documents();
    this.cleanStorage();
    localStorage.clear;
  }

  async sendRToAcs(){
    console.log('Report Send to ACS: '+this.obj.type);
     //console.log("imgCollection1.length ",this.imgCollection1.length);
     if( this.imgCollection1.length > 1 && this.charge > 1){
   
       for (let value of this.map.values()) {
        // console.log('value.file: '+value.doc.name);
        // this.displayProgressSpinner = true;
         this.afbcore.loading(true);
   
         if(value.doc.name != "" && value.doc.name != undefined){
         // console.log('this file: ');
          value.doc.traiter = false;
          this.saveRToAcs(value.doc);
         }
       }
     }
     else if( this.imgCollection1.length > 1 && this.charge == 0){
         //this._toast.showError('Envoi multiple \nAucun document attaché');
         this.afbcore.showMessage('DANGER', 'Envoi multiple \nAucun document attaché');
         this.instance = false;
         return;
     }
     else{
       var code = localStorage.getItem('code');
       if(code == null){
         //this._toast.showError('Veuillez renseigner les proprietes');
         this.afbcore.showMessage('DANGER', 'Veuillez renseigner les proprietes');
         this.instance = false;
         return;
       }
       var splitter = code.split("/"); 
       var isfill = true;
       for(var i=0;i<splitter.length;i++){
        var val = localStorage.getItem(splitter[i]);
        if(val == null || val == ''){
           isfill = false;
        }
        var compose = splitter[i] + ";" + val;
   
        this.__propriete = (this.__propriete == "" ? this.__propriete : this.__propriete+"/") + compose;
       }
       console.log(this.__propriete);
       if(!isfill){
        // this._toast.showError('Veuillez remplir tous les champs');
         this.afbcore.showMessage('DANGER', 'Veuillez remplir tous les champs');
         this.instance = false;
         return;
       }
       this.afbcore.loading(true);
       this.document.dateEnvoi = new Date();
       this.document.name = this.obj.type;
       this.document.traiter = false;
       this.document.proprietes = this.__propriete;
       this.document.uti = 'NUMARCH';
       this.document.categ = "CLASSIC";
      
       this.document.olname = this.objImg.title; 

    //   this.doImagesPdf();

       this.document.base64Str = this._map.get(this.objImg.title);
     // console.log("this merge: "+this.document.base64Str);

    
       this.saveRToAcs(this.document);
   
     }
     
 
     this.__propriete = "";
     this.document = new Documents();
     this.cleanStorage();
     localStorage.clear;
  }

 // saveToAcs(doc:Documents, blob_file:string){
  saveToAcs(doc:Documents){
    //console.log("blob_file ",blob_file);
        //this._sharedservice._sendToAcs(doc,blob_file)
        this._sharedservice._sendToAcs(doc)
          .subscribe( items => {
             console.log("Envoi vers ACS ",items.base64Str);
            this._sharedservice.sendToAcs(items)
            .subscribe(docx =>{
              console.log("Envoi vers Interne ",docx.traiter);
              this.obj = {};
              this.__propriete = "";
              this.all_properties = [];
              this.document = new Documents();
              this.cleanStorage();
              localStorage.clear;
              this.image_in = true;
              this.prop_in = true;
              this.fileAttr = 'Choisir document';
              this.fileInput.nativeElement.value = "";
              this.dataimage = "";
            });

            //this.displayProgressSpinner = false;
            this.afbcore.loading(false);
            //this._toast.showSuccess('Document Envoyé avec succes...');
            this.afbcore.showMessage('SUCCESS', 'Document Envoyé avec succes...');
           
        //    console.log("displayProgressSpinner ", this.displayProgressSpinner);
            this.obj = {};
            this.__propriete = "";
            this.all_properties = [];
            this.document = new Documents();
            this.cleanStorage();
            localStorage.clear;
            this.image_in = true;
            this.prop_in = true;
            this.fileAttr = 'Choisir document';
            this.fileInput.nativeElement.value = "";
            this.dataimage = "";
          }, (error)=>{
            console.log("An error occured " , error.message);
            this.afbcore.loading(false);
           // console.log("displayProgressSpinner ", this.displayProgressSpinner);
            this.afbcore.showMessage('DANGER', 'Document non envoyé');
            this.obj = {};
            this.__propriete = "";
            this.all_properties = [];
            this.document = new Documents();
            this.cleanStorage();
            localStorage.clear;
            this.image_in = true;
            this.prop_in = true;
            this.fileAttr = 'Choisir document';
            this.fileInput.nativeElement.value = "";
            this.dataimage = "";
            this.imgCollection1 = [];
          });
      
  }

  saveRToAcs(doc:Documents){
       
        this._sharedservice.sendToAcs(doc)
          .subscribe( items => {
            console.log("Envoi vers ACS ",items.reference);
            this.afbcore.loading(false);
          
            this.obj = {};
            this.__propriete = "";
            this.all_properties = [];
            this.document = new Documents();

            //Vide le visualisateur
            var len = this.imgCollection1.length;
            this.imgCollection1 = [];
            for(var i=0;i< len;i++){
              this.imgCollection1.push("");
            }

            this.cleanStorage();
            localStorage.clear;
            this.image_in = true;
            this.auto_in = true;
            this.prop_in = true;
            this.instance = false;
            this.fileAttr = 'Choisir document';
            this.fileInput.nativeElement.value = "";
            this.dataimage = "";
            //this._toast.showSuccess('Document Envoyé avec succes...');
            this.afbcore.showMessage('SUCCESS', 'Document Envoyé avec succes...');
          }, (error)=>{
            console.log("An error occured " , error.message);
            this.auto_in = true;
        /*    
            this.afbcore.loading(false);
            this.obj = {};
            this.__propriete = "";
            this.all_properties = [];
            this.document = new Documents();
            this.cleanStorage();
            localStorage.clear;
            this.image_in = true;
            this.prop_in = true;
            this.fileAttr = 'Choisir document';
            this.fileInput.nativeElement.value = "";
            this.dataimage = "";
        */    
            //this._toast.showError('Document non envoyé');
            this.afbcore.showMessage('DANGER', 'Document non Envoyé...');
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

  
  clearDocx(){
    this.image_in = true;
    this.prop_in = true;
    this.doc_in = true;
    this.valid_in = true;
    this.charge = 0;
    this.hidden = true;
    this.imgCollection1 = [];
    this.fileAttr = 'Choisir document';
  }

  autoDocx(){
    console.log('send doc for auto work ',this.imgCollection1.length)
   
    var code = localStorage.getItem('code');
    if(code == null){
      //this._toast.showError('Veuillez renseigner les proprietes');
      this.afbcore.showMessage('DANGER', 'Veuillez renseigner les proprietes');
      return;
    }
    var splitter = code.split("/"); 
    var isfill = true;
  /*
    for(var i=0;i<splitter.length;i++){
     var val = localStorage.getItem(splitter[i]);
     if(val == null || val == ''){
        isfill = false;
     }
     var compose = splitter[i] + ";" + val;

     this.__propriete = (this.__propriete == "" ? this.__propriete : this.__propriete+"/") + compose;
    }
    console.log(this.__propriete);
    if(!isfill){
      this._toast.showError('Veuillez remplir tous les champs');
      return;
    }
    */
    console.log(this.__propriete);
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
       this.document.categ = "CLASSIC";
    //   console.log('name: '+this.imgCollection1[l].title)
       this.document.base64Str = this._map.get(this.imgCollection1[l].title);
       this.document.olname = this.imgCollection1[l].title;

       lDocuments.push(this.document);
    }


    //this.saveAutoToAcs(this.document);
    this.saveAutoLToAcs(lDocuments);
  }

  saveAutoLToAcs(lDocuments:Array<Documents>){
    this._sharedservice.processAutoL(lDocuments)
      .subscribe(
        items => {
          var res = items.ltrx
          var _smap = new Map();
        //  console.log(JSON.stringify(res));
        //  this.displayProgressSpinner = false;
          this.afbcore.loading(false);

          res.forEach(element => {
            this.bord = new Bordereau();
          //  if(element.decode){
               console.log("Decode: ",element.decode+" "+localStorage.getItem('code'));
            //   var imgName = (((element.filename.split('.'))[0]).split('_'))[1] + "." + this.extension;
               var imgName = (((element.filename.split('.'))[0]).split('_'))[1];
               console.log("Filename: ",imgName);
               var data = element.eve +';'+ element.age +';'+ element.ncp +';'+ element.cle +';'+ element.dco +';'+ element.uti +';'+ element.mon + ';' + element.type;
               localStorage.setItem(imgName, element.decode);

             /** ----------------------------------------- */
               _smap = new Map();

               element.uti = element.uti == null ? '' : element.uti
               _smap.set("cm:name",element.uti);
               localStorage.setItem('cm:name', element.uti);

               element.ncp = element.ncp == null ? '' : element.ncp + "-" +element.cle
               _smap.set("afbm:trxAcc",element.ncp);
               localStorage.setItem('afbm:trxAcc', element.ncp);

               element.recip = element.recip == null ? '' : element.recip
               _smap.set("afbm:trxRecip",element.recip);
               localStorage.setItem('afbm:trxRecip', element.recip);
            
               element.type = element.type == null ? '' : element.type
               _smap.set("afbm:docType",element.type);
               localStorage.setItem('afbm:docType', element.type);

               element.eve = element.eve == null ? '' : element.eve
               _smap.set("afbm:docRef",element.eve);
               localStorage.setItem('afbm:docRef', element.eve);
            
               element.age = element.age == null ? '' : element.age
               _smap.set("afbm:unitCode",element.age);
               localStorage.setItem('afbm:unitCode', element.age);
            
               element.dco = element.dco == null ? '' : element.dco
               _smap.set("afbm:trxDate",element.dco);
               localStorage.setItem('afbm:trxDate', element.dco);
 
               element.mon = element.mon == null ? '' : element.mon
               _smap.set("afbm:trxAmount",element.mon);
               localStorage.setItem('afbm:trxAmount', element.mon);

                /** ------------------------------------------------ */
                  this.all_propriete = []; 
                /** --------------- RRR-------------------------- */
                
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
                  //console.log("Image en cours de traitement",  this.select_img);
                  var obj_docx:any;
                      obj_docx = {};
                      obj_docx.name = imgName;
                      

                  this.document = new Documents();
                  this.document.dateEnvoi = new Date();
                  this.document.name = this.obj.type;
                  this.document.traiter = false;
                  this.document.proprietes = this.__propriete;
                  this.document.olname = imgName;
                  this.document.uti = 'AUTO';
                  this.document.categ = "CLASSIC";
                  this.document.base64Str = this._map.get(imgName);
                  obj_docx.doc = this.document;

                  this.charge += 1;
              
                  this.map.set(imgName, obj_docx);
                 
                  this.hidden = false;
              //  }
  
              
          //  }
         });

         for (let [key, value] of _smap) {
          this._sharedservice.getPropertiesName(key)
          .subscribe(p => {
              var obj:Proprietes = new Proprietes();
              console.log("valeur ",value);
              obj.valeur = value;
              obj.properties = p;
              this.all_propriete.push(obj);
          });
        }


        }, (error)=>{
          console.log("An error occured " , error.message);
          //this.displayProgressSpinner = false;
          this.afbcore.loading(false);
        }
      );
  }
  saveAutoToAcs(doc:Documents){
       
    this._sharedservice.processAuto(doc)
      .subscribe( items => {
         console.log("Envoi vers ACS ",items.message);
         var res = items.ltrx
         var _smap = new Map();
        console.log(JSON.stringify(res));
        //this.displayProgressSpinner = false;
        this.afbcore.loading(false);
      //  const lastDot = element.name.lastIndexOf('.');
      //  const fileNom = element.name.substring(0, lastDot);
        res.forEach(element => {
           this.bord = new Bordereau();
           if(element.decode){
              console.log("Decode: ",element.decode+" "+localStorage.getItem('code'));
              var imgName = (((element.filename.split('.'))[0]).split('_'))[1] + "." + this.extension;
              console.log("Filename: ",imgName);
              var data = element.eve +';'+ element.age +';'+ element.ncp +';'+ element.cle +';'+ element.dco +';'+ element.uti +';'+ element.mon + ';' + element.type;
              localStorage.setItem(imgName, data);
            /** ----------------------------------------- */
              _smap = new Map();
              _smap.set("cm:name",element.uti);
              localStorage.setItem('cm:name', element.uti);

              _smap.set("afbm:trxAcc",element.ncp);
              localStorage.setItem('afbm:trxAcc', element.ncp);

              _smap.set("afbm:trxRecip",element.recip);
              localStorage.setItem('afbm:trxRecip', element.recip);

              _smap.set("afbm:docType",element.type);
              localStorage.setItem('afbm:docType', element.type);

              _smap.set("afbm:docRef",element.eve);
              localStorage.setItem('afbm:docRef', element.eve);

              _smap.set("afbm:unitCode",element.age);
              localStorage.setItem('afbm:unitCode', element.age);

              _smap.set("afbm:trxDate",element.dco);
              localStorage.setItem('afbm:trxDate', element.dco);

              _smap.set("afbm:trxAmount",element.mon);
              localStorage.setItem('afbm:trxAmount', element.mon);

              this.all_propriete = []; 
           }
        });

/** Try to construct list of all propereties */
       
    //    localStorage.setItem('code', '/cm:name/afbm:docType/afbm:docRef/afbm:unitCode/afbm:trxRecip/afbm:trxAcc/afbm:trxDate/afbm:trxAmount'); 
        for (let [key, value] of _smap) {
          this._sharedservice.getPropertiesName(key)
          .subscribe(p => {
              var obj:Proprietes = new Proprietes();
              console.log("valeur ",value);
              obj.valeur = value;
              obj.properties = p;
              this.all_propriete.push(obj);
          });
        }




        /*  cm:name/cm:content/afbm:docType/afbm:docRef
           var retObj = this.map.get(this.select_img);
     // console.log("recorded properties: ",retObj.doc.proprietes);
     // console.log("recorded properties: ",retObj.name);
      // Des données peuvent avoir deja été remplies on recupère
      if(retObj.doc.proprietes != undefined){
        this.all_propriete = [];
        this.prop_in = false;
        var recProp = retObj.doc.proprietes.split("/");
        let smap = new Map();
        for(var i=0;i<recProp.length;i++){
           
            //console.log(recProp[i].split(";")[0]+" = "+recProp[i].split(";")[1]+" -- "+this.prop_in);
            var value = recProp[i].split(";")[1];
            var name = recProp[i].split(";")[0];
            smap.set(name,value);
            this._sharedservice.getPropertiesName(name)
            .subscribe(p => {
                var obj:Proprietes = new Proprietes();
                //console.log("valeur ",value);
                obj.valeur = smap.get(p.name);
                obj.properties = p;
                this.all_propriete.push(obj);
            });
            
         
        }




        */
        
       /*
        this.obj = {};
        this.__propriete = "";
        this.all_properties = [];
        this.document = new Documents();
        this.cleanStorage();
        localStorage.clear;
        this.image_in = true;
        this.auto_in = true;
        this.prop_in = true;
        */
        this.fileAttr = 'Choisir document';
        this.fileInput.nativeElement.value = "";
        this.dataimage = "";
        //this._toast.showSuccess('Document Envoyé avec succes...');
        this.afbcore.showMessage('SUCCESS', 'Document Envoyé avec succes...');
      }, (error)=>{
        console.log("An error occured " , error.message);
        /*this.auto_in = true;
        this._toast.showError('Document non envoyé');
        this.obj = {};
        this.__propriete = "";
        this.all_properties = [];
        this.document = new Documents();
        this.cleanStorage();
        localStorage.clear;
        this.image_in = true;
        this.prop_in = true;*/
        this.fileAttr = 'Choisir document';
        this.fileInput.nativeElement.value = "";
        this.dataimage = "";
        //this.displayProgressSpinner = false;
        this.afbcore.loading(false);
      });
  
}

  attachDocx(){
    console.log("attachDocx: ",  this.select_img+" -- "+this.obj.type);
    var code = localStorage.getItem('code');
    console.log("attachDocx code: ",  code);
    if(code == null){
      //this._toast.showError('Veuillez renseigner les proprietes');
      this.afbcore.showMessage('DANGER', 'Veuillez renseigner les proprietes');
      return;
    }
    var splitter = code.split("/"); 
    var isfill = true;
    for(var i=0;i<splitter.length;i++){
     var val = localStorage.getItem(splitter[i]);
     if(val == null || val == ''){
        isfill = false;
     }
     var compose = splitter[i] + ";" + val;

     this.__propriete = (this.__propriete == "" ? this.__propriete : this.__propriete+"/") + compose;
    }
   
    if(!isfill){
     // this._toast.showError('Veuillez remplir tous les champs');
      this.afbcore.showMessage('DANGER', 'Veuillez remplir tous les champs');
      return;
    }

    if(this.map.has(this.select_img)){
      //console.log("Image en cours de traitement",  this.select_img);
      this.document = new Documents();
      this.document.dateEnvoi = new Date();
      this.document.name = this.obj.type;
      this.document.traiter = true;
      this.document.proprietes = this.__propriete;
      this.document.uti = 'NUMARCH';
      this.document.categ = "CLASSIC";
      this.document.base64Str = "";
      this.document.olname = this.select_img; 

      var o = this.map.get(this.select_img);
      console.log("o.doc.name: ",o.doc.name)
      if(o.doc.name == "" || o.doc.name == undefined)
        this.charge += 1;
      o.doc =  this.document;
      this.map.set(this.select_img, o);
     
      this.hidden = false;
    }

  //  for (let value of this.map.values()) {
  //    console.log(value.doc.proprietes);
  //  }

    //this.saveToAcs(this.document);
    
  }

  getAllAcs(){
    let __typ:TypeDocuments;
    let __type:Array<TypeDocuments> = []; //liste des types de documents recuperes à envoyer en bd
    let _parent:Array<any> = [];
    let __proprie:Array<Properties> = [];
    this._sharedservice.getAllACS()
      .subscribe(
        items => {
        //  console.log("Ret evidence: "+ items.length);
          this.typ = items;
          items.forEach(element => {
           
            console.log(JSON.stringify(element));
          __typ = new TypeDocuments();
          __typ = element;
        
          var key = [];
          key = Object.keys(element.properties);
          var str = ""; //properties name
          key.forEach(v => {
            str = str + "/" + element.properties[v].name;
            __proprie.push(element.properties[v]);
          });
          __typ.propertie = str;

          //recuperation du nom du parent
          const json = JSON.stringify(__typ.parent);
          const _obj = JSON.parse(json);
       //   console.log("parent name: ",_obj);
          if(_obj.hasOwnProperty('name')){
           // console.log("parent: "+_obj['name']);
            __typ.parent = _obj['name'];
            _parent.push(_obj);
          }
          else{
            __typ.parent = "";
          }

           //recuperation du nom de l'aspect
           const as_json = JSON.stringify(__typ.defaultAspects);
           const _as_obj = JSON.parse(as_json);
           //console.log("aspect name:",_as_obj);

          var __key = [];
          __key = Object.keys(_as_obj);
          var __str = ""; //properties name
          __key.forEach(v => {
            var ss = element.defaultAspects[v].name;
          //  if(ss.startsWith('afbm')){
              if(__str === ""){
                __str = __str + ss;
              }
              else{
                __str = __str + "/" + ss;
              }
          //  }
             
          });
       //   console.log("aspect name:",__str);

           if(__str === ""){
            __typ.defaultAspects = "";
           }
           else{
             __typ.defaultAspects = __str;
           }



          __type.push(__typ);
         
          });
/* 
        // send properties to BD
          __proprie.forEach(pp => {
            var __str = pp.dataType;
            pp = this._sharedservice.retrieveDateTypeFromAcs(__str, pp);
            console.log("Ppp " , pp);
            this._sharedservice.createProperties(pp)
              .subscribe(props =>{
                 //this._toast.showSuccess('Propriete Envoyé avec succes...');
                 console.log("Propriete Envoyé avec succes " , props);
              },
              (error)=> {
                console.log("An error occured " , error.message);
                this._toast.showError('Propriete non envoyé');
              }
              );
          });
 
          // send Type document to BD
           __type.forEach(value => {
                this._sharedservice.createTypeDoc(value)
                .subscribe(props =>{
                //  this._toast.showSuccess('Type document Envoyé avec succes...', props);
                  console.log('Type document Envoyé avec succes...', props);
                },
                (error)=> {
                  console.log("An error occured " , error.message);
                  this._toast.showError('Type document non envoyé');
                }
                );
            });

           //send parent to BD
           _parent.forEach(ve => {
                this._sharedservice.createParent(ve)
                .subscribe(props =>{
                  //this._toast.showSuccess('Type document Envoyé avec succes...', props);
                  console.log('Type document Envoyé avec succes...', props);
                },
                (error)=> {
                  console.log("An error occured " , error.message);
                  this._toast.showError('Type document non envoyé');
                }
                );
           });*/
        });

      
  }


  getColor(title){
    var user_color = '#000000';

    if(this.map.has(title)){
       
       var res = localStorage.getItem(title);
      // console.log('decode: ', res)
       if(res=='true')  user_color = '#187C04';
       else user_color = '#FF0000';
       
    }
    else{
      return user_color;
    }
  
     return user_color;
  }


  _base64ToArrayBuffer(base64) {
   
    var partSeparator = ",";
    if (base64) {
      const encodedImg = base64.split(partSeparator)[1];
    //  console.log("TO BYTES: "+encodedImg);
      var binary_string = window.atob(encodedImg);
      var len = binary_string.length;
      var bytes = new Uint8Array(len);
      for (var i=0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }

      return bytes.buffer;
    }
				  
  }

  async doImagesPdf() {

    this.afbcore.loading(true);
    //var base64 = this._map.get(key);
    //const jpgUrl = 'assets/images/numarch.jpg';
   
   // const pngUrl = 'assets/images/archivage.png';
    var jpgUrl;

  //  for (let [key, value] of this.mapNum) {
      var listDoc;
    //  listDoc = this.mapNum.get(key);
    var pdfDoc;
   
    var imgCollectionCopy = [];
     var key;
     for(var i=0;i< this.imgCollection1.length;i++){

          //Create pdf
          pdfDoc = await PDFDocument.create();
          
          if(this.extension != 'pdf') {

            // var kk = (((listDoc[i].filename.split('.'))[0]).split('_'))[1];
            //  var orig64 = this._map.get(kk);
            jpgUrl = this.imgCollection1[i].image;
          
            const jpgImageBytes = await fetch(jpgUrl).then((res) => res.arrayBuffer());
          //  const pngImageBytes = await fetch(pngUrl).then((res) => res.arrayBuffer());

            //Embed images bytes
            const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
          //  const pngImage = await pdfDoc.embedPng(pngImageBytes);

            // Get the dimension of the image scaled down do 25% of its original size
            const jpgDims = jpgImage.scale(0.35);
        
            // Add a blank page to the document
            var page = pdfDoc.addPage(PageSizes.A4);
            // Draw the JPG image in the center of the page
            page.drawImage(jpgImage, {
              x: page.getWidth() / 2 - jpgDims.width /2,
              y: page.getHeight() /2 - jpgDims.height /2,
              width: jpgDims.width,  //575
              height: jpgDims.height, //815
            })
          }
          else {
            const altDoc = await PDFDocument.load(this.imgCollection1[i].image);
            const allPages = await pdfDoc.copyPages(altDoc, altDoc.getPageIndices());
            allPages.forEach((page) => pdfDoc.addPage(page));
          }
          

            key = this.imgCollection1[i].title;
            
    //   }  end for

      
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
            this._map.set(key, base64String);
          //  console.log("base64String: "+this.imgCollection1[i].title)

          var kimgName = key;
          console.log("kimgName: "+kimgName)
           
          if( this.imgCollection1.length > 1 && this.charge > 1){
              var docx = this.map.get(kimgName);
              console.log("B64-docx: "+JSON.stringify(docx)); 
              docx.doc.base64Str = base64String;
             this.map.set(kimgName, docx);
          }

           
           
           
       
           
            var ob;
            ob = {};
            ob.filename = "";
            ob.olfilename = "";
            ob.image = base64String
            ob.filename = kimgName;
            ob.olfilename = base64String;
            imgCollectionCopy.push(ob);
        






          //  console.log("this.mergeimage: "+this.mergeimage)

         //  var link=document.createElement('a');
         //   link.href=window.URL.createObjectURL(blob);
         //   link.download="bordereau.pdf";
         //   link.click();

    }
    this.imgCollection1 = [];
    this.imgCollection1 = imgCollectionCopy;

    this.instance = true;
    this.typepdf = true;
    this.afbcore.loading(false);
  }

  sendToFusion() {

    if(this.imgCollection1.length < 1) {
      this.afbcore.showMessage('DANGER','Aucun document chargé.')
      return
    }

    for (let value of this.map.values()) {
      if(value.doc.proprietes == "") {
        this.afbcore.showMessage('DANGER', 'Vous essayer de traiter des documents sans propriétés...');
        return;
      }
    }

    this.afbcore.loading(true);
    //this.doMerge();
    this.doImagesPdf();
  }

}
