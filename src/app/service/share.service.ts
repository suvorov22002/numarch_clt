import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AfbcoreService } from 'afbcore';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConfigService } from './helper/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  userObserver =  new BehaviorSubject<any>(null); // {1}
  notification = new BehaviorSubject<number>(0); // {1}
  initParam: any;


  apiHost: String;
  apiEReport: String; 
  apiMngLoad = new BehaviorSubject<boolean>(false); 
  tabRoles: any[];

  permission = [
   "NUMARCH_PROCESS",
   "NUMARCH_PARAM",
   "NUMARCH_VISUAL",
   "NUMARCH_QRCODE",
   "NUMARCH_SIMPLE",
   'NUMARCH_ADMIN'

 ]
  
  

  constructor(
    private _config:AppConfigService,
    private http:HttpClient,
    private afbcore:AfbcoreService
  ) {
    
   }



   pushFileToStorage(file: File): Observable<HttpEvent<{}>> {
      const data: FormData = new FormData();
      data.append('file', file);
      const newRequest = new HttpRequest('POST', this.apiHost+'/document/efile', data, {
      reportProgress: true,
      responseType: 'text'
      });
      return this.http.request(newRequest);
    }

  
   getUsers() {
      let headers = new HttpHeaders({
        timeout: '600000',
      });
     
      let username = 'test';
      let password = 'test';
      
      headers = headers.set("Authorization", "Basic " + btoa(username + ":" + password))
      return this.http.get('/api/jsonws/afbliferayservice.afb_module/get-users', { headers: headers })
        .pipe(map((res: any) => {
          return res;
        }))
    }
  
    loadAll() {
      return this.afbcore.getUSerByScreenName()
    }

    stringToTable(str: any) {
      console.log('str ' + str);
      this.tabRoles = [];
      if(str != null) {
        for(let s of str.split(';')) {
          this.tabRoles.push(s);
        }
      }
      console.log(this.tabRoles);
      return this.tabRoles;
    }
}
