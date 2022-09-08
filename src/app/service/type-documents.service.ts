import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TypeDocuments } from '../modeles/type-documents';
import { CrudService } from './crud.service';
import { AppConfigService } from './helper/app-config.service';
import { HttpErrorHandlerService } from './helper/http-error-handler.service';
import { LogService } from './helper/log.service';
import { ShareService } from './share.service';

@Injectable({
  providedIn: 'root'
})
export class TypeDocumentsService extends CrudService<TypeDocuments>{
  
  getPath(): string {
    return "/typedocument";
  }

  constructor(
    _client : HttpClient,
    _log : LogService,
    _errorHandler : HttpErrorHandlerService,
    _config : AppConfigService
  ) {
    super(_client, _log, _errorHandler);
   }
}
