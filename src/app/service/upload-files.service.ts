import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {

  private baseUrl = 'http://localhost:8086/rest/api/numarch/file';
 // serverUrl: string = "https://file.io";
 private path = '/assets/images/'

  constructor(private http:HttpClient) { }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    console.log('file:'+file.name);
    formData.append('file', file);
    const req = new HttpRequest('POST', `${this.path}`, formData, {
  //  const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
    
  }

  create(file: any):Observable<any>{
    const formData: FormData = new FormData();
    console.log('file:'+file.name);
    formData.append('file', file);
  //  return this.http.post<any>(`${this.baseUrl}/upload` , formData)
    return this.http.post<any>(`${this.path}` , formData)
      .pipe(
        tap(_ => console.log("Create object") ),
        catchError(this.processError)
      )
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
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

}
