import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AfbcoreService } from 'afbcore';
import { NgxPermissionsService } from 'ngx-permissions';
import { ShareService } from 'src/app/service/share.service';
import { ToolsService } from 'src/app/service/tools.service';
import { environment } from 'src/environments/environment';

declare const Liferay: any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  obj: any;
  logoPath: any;
  roles: any[];
  query: any;
  apiMngLoad: boolean = false;
  queryID: any;

  constructor(
    private router: Router,
    private routeParams: ActivatedRoute,
    private service: ToolsService,
    private permissionsService: NgxPermissionsService,
    private afbcore: AfbcoreService,
    private share:ShareService
  ) {
  //  this.postDaata();
    //console.log('Environnement name: '+environment.name);
    //console.log("permission: ",JSON.stringify(this.share.permission));
    this.routeParams.queryParams.subscribe(params => {
      console.log("params: ",JSON.stringify(params));
      this.query = params['r']; // recuperaton des roles du user dans l'url
      this.queryID = params['id']; // recuperation du userID
      this.query = atob(this.query); // decodage des roles present dans l'url
      localStorage.setItem('role_numarch',this.query); // sauvegarde des roles dans la session
      localStorage.setItem('userId',this.queryID); // sauvegarde du userID dans la session
     });
    //si les roles ne sont pas present dans l'url on recupere les roles dans la session
      if(this.query == undefined || this.query == null) this.query = localStorage.getItem('role_numarch');

    //  this.logoPath = '/o/numarch-0.0.0/numarch/assets/images/archivage.png';

    //  let imgUrl = this.logoPath;

   }

  ngOnInit() {
   
    const perm = [
      "NUMARCH_PROCESS",
      "NUMARCH_PARAM",
      "NUMARCH_VISUAL",
      "NUMARCH_QRCODE",
      "NUMARCH_SIMPLE",
      'NUMARCH_ADMIN'
   
    ]
    this.permissionsService.loadPermissions(perm);

  //  this.roles = this.share.stringToTable(this.query); // on récupere les roles du user connecté
  //  this.permissionsService.loadPermissions(this.roles); // on charge les roles du user connecté dans le module
  }

  postDaata() {
    //this.apimanager.getApiManager();
    this.afbcore.postModule(environment.name, 
     environment.name, 
     environment.name, "", this.logoPath, 
     true, "",this.share.permission, Liferay); 
  }

}
