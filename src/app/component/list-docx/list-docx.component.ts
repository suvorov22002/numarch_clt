import { Component, OnInit } from '@angular/core';
import { AfbcoreService } from 'afbcore';
import { DialogService } from 'primeng/dynamicdialog';
import { Documents } from 'src/app/modeles/documents';
import { Extract } from 'src/app/modeles/extract';
import { ShareService } from 'src/app/service/share.service';
import { ToolsService } from 'src/app/service/tools.service';
import { ViewDocumentComponent } from '../view-document/view-document.component';

@Component({
  selector: 'app-list-docx',
  templateUrl: './list-docx.component.html',
  styleUrls: ['./list-docx.component.css'],
  providers: [DialogService]
})
export class ListDocxComponent implements OnInit {

  datas:Array<Documents> = [];
  cols:any[];
  result : any;

  constructor(private _sharedservice:ToolsService,public dialogService: DialogService, private afbcore: AfbcoreService) { }

  ngOnInit() {
    this.refillAllDocx();

    this.cols = [
      
      { field: 'reference', header: 'Reference' },
      { field: 'date', header: 'Date envoi' },
      { field: 'document', header: 'Nom document' },
      { field: 'description', header: 'Description' },
      { field: 'utilisateur', header: 'Utilisateur' },
      { field: 'lien', header: 'Lien' }
    ]
  }

  refillAllDocx(){
    this._sharedservice.getAllDocxSend()
      .subscribe(value => {
        this.datas = value;
        
      });
  }

  view(obj){
    let data = obj;
      const ref = this.dialogService.open(ViewDocumentComponent, {
        width: '50%',
        closeOnEscape: false,
        header: 'METADONNEES DOCUMENTS '+data.reference,
      data: { obj:data }
    });
    ref.onClose.subscribe(res => {
      if(res == true)  {
        //this.getallParam();
       // this.afbcore.showMessage('SUCCESS','Opération effectuée avec succès!')
      //  this._toast.showSuccess('SUCCESS','Opération effectuée avec succès!')
      }
    })
  }

  sendToAlfresco(obj){
    
    let data = obj;
  //  console.log(data.reference);
    this.afbcore.loading(true);
    
    this._sharedservice.sendManualToAcs(data.reference)
      .subscribe(value => {
        this.result = value;
        console.log(JSON.stringify(this.result));
        console.log(this.result.codeResponse);
        console.log(this.result.message);
        console.log(this.result.error);
        this.afbcore.loading(false);
        if(this.result.codeResponse == 500) {
          this.afbcore.showMessage('DANGER', this.result.message+"; "+this.result.error);
        }
        
      });

  }
}
