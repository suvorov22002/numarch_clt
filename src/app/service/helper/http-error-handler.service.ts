import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerService {

  constructor() { }

  /**
   * Handle Http operation that failed.
   * Let app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
   handleError<T>(operation = 'operation', result?:T){
    return (error:any): Observable<T> => {
      console.log("Error append: ", error.error.message);
     // this._toast.showError(error.error.message);
      return throwError(error.error.message);
    };
  }
}
