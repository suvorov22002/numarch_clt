import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AfbcoreService } from 'afbcore';
import { NgxPermissionsService } from 'ngx-permissions';

import { ShareService } from './share.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {

  url: any;

  constructor(private service:ShareService, 
    private http:HttpClient,
    private afbcore:AfbcoreService) { }

  init(){
    
    let url = null;
    let headers = new HttpHeaders();
    headers = headers.set("Authorization", "Basic " + btoa(this.afbcore.userName + ":" + this.afbcore.password))
    console.log("afbcore.userName: "+this.afbcore.userName+" - afbcore.password: "+this.afbcore.password);
   
     
    return new Promise<void>((resolve, reject) =>
      {
        this.http.get("/api/jsonws/afbliferayservice.afbparamgeneraux/get-afb-param-generauxs", {headers:headers})
        .toPromise()
        .then(
          (res:any) => {
            console.log(JSON.stringify(res));
            this.service.apiHost = res[0].adresseIP + "/numarch-service/rest/api/numarch";
            this.url = res[0].adresseIP;
          //  this.service.apiEReport = res[0].adresseGedProcess;
            console.log("init app done on link: "+this.service.apiHost);
            resolve(res);
          }
        )
        .catch(
          error => {
            //this.service.apiHost = "192.168.11.75:8080/numarch-service/rest/api/numarch";
            console.log('Initializer failed');
          }
        )
      }
    )

  }
}
