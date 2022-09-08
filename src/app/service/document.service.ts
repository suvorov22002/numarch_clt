import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { Documents } from '../modeles/documents';
import { ObjectAcs } from '../modeles/object-acs';
import { CrudService } from './crud.service';
import { AppConfigService } from './helper/app-config.service';
import { HttpErrorHandlerService } from './helper/http-error-handler.service';
import { LogService } from './helper/log.service';
import { ShareService } from './share.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentService extends CrudService<Documents>{
  
  getPath(): string {
    return "/document";
  }

  constructor(
    _client : HttpClient,
    _log : LogService,
    _errorHandler : HttpErrorHandlerService,
    _config : AppConfigService
  ) {
    super(_client, _log, _errorHandler);
   }

   createACS(url,  doc, s_file){
    const formData: FormData = new FormData();
    formData.append('document', doc);
    formData.append('file', s_file);
    
      return this._client.post<Document>(url , formData)
      .pipe(
        tap(_ => this._log.log("Create object") ),
        catchError(this.processError)
      )
   }

   _createACS(url,  obj:ObjectAcs){
      return this._client.post<Documents>(url , obj)
      .pipe(
        tap(_ => this._log.log("Create object") ),
        catchError(this.processError)
      )
   }
}
