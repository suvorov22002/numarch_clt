import { Component, OnInit } from '@angular/core';
import { Properties } from 'src/app/modeles/properties';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Proprietes } from 'src/app/modeles/proprietes';
import { ShareService } from 'src/app/service/share.service';
import { ToolsService } from 'src/app/service/tools.service';

@Component({
  selector: 'app-view-document',
  templateUrl: './view-document.component.html',
  styleUrls: ['./view-document.component.css']
})
export class ViewDocumentComponent implements OnInit {

  datas:Array<any> = [];
  document: any = {};
  uti:string;

  constructor(
    private service: ToolsService,
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig
  ) { }

  ngOnInit() {
     this.datas = [];
     if(this.config.data != null && this.config.data != undefined ) this.document = this.config.data.obj;
     //console.log(JSON.stringify(this.document));
     this.getDocument(this.document);
    
  }

  getDocument(doc){
    this.service.getDocById(doc.id)
      .subscribe( value => {
           //console.log(JSON.stringify(value));
           if(value.proprietes != null){
             var prop = value.proprietes;
             var difProp = prop.split('/');
             var p:any;
             for(var i=0;i<difProp.length;i++){
                var res = difProp[i].split(';');
                p = {}
                p.attribut = res[0];
                p.valeur =  res[1];
                this.datas.push(p);
             }
             this.uti = this.document.uti;
           }
      });
  }

}
