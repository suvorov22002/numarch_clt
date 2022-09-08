import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Params } from 'src/app/modeles/params';
import { ToastService } from 'src/app/service/helper/toast.service';
import { ShareService } from 'src/app/service/share.service';
import { ToolsService } from 'src/app/service/tools.service';

@Component({
  selector: 'app-paramform',
  templateUrl: './paramform.component.html',
  styleUrls: ['./paramform.component.css']
})
export class ParamformComponent implements OnInit {

  info: any = {};
  actifs = [
    { code: true, name: 'OUI' },
    { code: false, name: 'NON' }
  ]
  constructor(
    //private afbcore: AfbcoreService,
    private service: ToolsService,
    private _toast:ToastService,
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig
  ) { }

  ngOnInit() {
    //console.log(this.config);
    this.info.actif = false;
    if(this.config.data != null && this.config.data != undefined ) this.info = this.config.data.obj;
  }

  onSaveSuccess(res) {
    //this.afbcore.loading(false);
    this.ref.close(true);
   // this.afbcore.showMessage('SUCCESS', 'Opération effectuée avec succès!');
    this._toast.showSuccess("Opération effectuée avec succès!")
  }

  onError(error) {
   // this.afbcore.loading(false);
   // this.afbcore.showMessage('DANGER', 'Une erreur est survenue, veuillez réessayer!!');
   this._toast.showError('Une erreur est survenue, veuillez réessayer!!');
  }
  save() {
   // this.afbcore.loading(true);
   // this.afbcore.callPostService(this.service.apiHost, 'parameter/add', this.info, null, null)
   this.service.createParams(this.info)
    .subscribe(
      (res) => this.onSaveSuccess(res),
      (error) => this.onError(error)
    )
  }

}
