import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HttpErrorHandlerService } from './helper/http-error-handler.service';
import { LogService } from './helper/log.service';
import { ShareService } from './share.service';

@Injectable({
  providedIn: 'root'
})
export abstract class CrudService<T> {

  constructor(
    protected _client:HttpClient,
    protected _log:LogService,
    protected _errorHandler:HttpErrorHandlerService,
  ) { }

  abstract getPath():string|string;
  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      timeout: '600000'
    })
  }

  list(url:string, _path?:string):Observable<T[]>{
  //list(filter?:{}, _path?:any):Observable<T[]>{
    let params = new HttpParams();
    let filter = {};
  //  if(filter){
  //    for(let id in Object.getOwnPropertyNames){
  //      let key = Object.getOwnPropertyNames(filter)[id];
  //      params = params.set(key, filter[key]);
  //    }
  //  }
    if(_path == undefined) _path = "";
    return this._client.get<T[]>(url + _path, {params:params})
      .pipe(
        tap( _ => console.log()),
        catchError(this._errorHandler.handleError<T[]>('list of all filter '+filter, 
        []))
      );
  }

  get(url:string, id:string|string|number):Observable<T>{
    return this._client.get<T>(url + "/" + id)
      .pipe(
        tap(_ => console.log()),
        catchError(
          this._errorHandler.handleError<T>('Get '+id)
        )
      );
  }

  update(url:string, obj:T ):Observable<T>{
    return this._client.put<T>(url , obj)
      .pipe(
        tap(_ => console.log("Update object" + obj)),
        catchError(this._errorHandler.handleError<T>('Update object '+obj))
      )
  }

  create(url:string, obj:T):Observable<T>{
   // console.log("Url post evidence: "+url+" Obj: "+obj);
    return this._client.post<T>(url , obj)
      .pipe(
        tap(_ => this._log.log("Create object") ),
        //catchError(this._errorHandler.handleError<T>('Create new obj '+obj))
        catchError(this.processError)
      )
  }

  createAuto(url:string, obj:any):Observable<any>{
    //console.log("Url post evidence: "+url+" Obj: "+obj);
    return this._client.post<any>(url , obj, this.httpOptions)
      .pipe(
        tap(_ => this._log.log("Create object") ),
        //catchError(this._errorHandler.handleError<T>('Create new obj '+obj))
        catchError(this.processError)
      )
  }

  delete(url:string, id:string | string | number):Observable<T>{
    return this._client.delete<T>(url+"/"+id)
    .pipe(
      tap(_ => this._log.log("Delete obj") ),
      catchError(this.processError)
    )
  }

  processError(err) {
    let message = '';
    if(err.error instanceof ErrorEvent) {
     message = err.error.message;
    } else {
     message = `Error Code: ${err.status}\nMessage: ${err.message}`;
    }
    console.log(message);
  
    return throwError(err.status);
 }

 getIPAddress()

  {

    this._client.get("http://127.0.0.1").subscribe((res:any)=>{

      return res.ip;

    });

  }
}
