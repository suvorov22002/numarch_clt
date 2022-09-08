import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/service/helper/toast.service';
import { ShareService } from 'src/app/service/share.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ParamformComponent } from '../paramform/paramform.component';
import { ToolsService } from 'src/app/service/tools.service';

@Component({
  selector: 'app-url',
  templateUrl: './url.component.html',
  styleUrls: ['./url.component.css'],
  providers: [DialogService]
})
export class UrlComponent implements OnInit {

  datas: any;
  info: any = {};

  constructor(
    private _sharedservice:ToolsService,
    private _toast:ToastService,
    public dialogService: DialogService
  ) { }

  ngOnInit() {
    this.getallParam();
  }

  getallParam(){
    this.datas = [];
    this._sharedservice.getAllParams()
      .subscribe(param => {
        this.datas = param;
        console.log("params chargés");
      });
  }

  onParamSucces(res: any) {
    //this.afbcore.loading(false);
    if(res!=null) {
      this.datas = res;
    }
    else {
      //this.afbcore.showMessage('INFO', 'Aucune donnée trouvée!');
    }
    
  }

  onParamError(error) {
    //this.afbcore.loading(false);
    //this.afbcore.showMessage('DANGER', 'Une erreur est survenue veuillez réessayer!');
  }

  openAddDialog() {
    const ref = this.dialogService.open(ParamformComponent, {
      width: 'auto',
      closeOnEscape: false,
      header: 'INFORMATIONS PARAMETRAGE',
     // data: { obj:obj, from:'view-external' }
    });
  }

  edit(obj){
      let data = obj;
      const ref = this.dialogService.open(ParamformComponent, {
        width: 'auto',
        closeOnEscape: false,
        header: 'INFORMATIONS PARAMETRAGE',
      data: { obj:data }
    });
    ref.onClose.subscribe(res => {
      if(res == true)  {
        this.getallParam();
       // this.afbcore.showMessage('SUCCESS','Opération effectuée avec succès!')
        this._toast.showSuccess('SUCCESS','Opération effectuée avec succès!')
      }
    })
  }

  deleteOpe(data){

  }

}
