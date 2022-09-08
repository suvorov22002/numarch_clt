import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Properties } from '../modeles/properties';
import { CrudService } from './crud.service';
import { AppConfigService } from './helper/app-config.service';
import { HttpErrorHandlerService } from './helper/http-error-handler.service';
import { LogService } from './helper/log.service';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService extends CrudService<Properties>{
 
  getPath(): string {
    return "/properties";
  }

  constructor(
    _client : HttpClient,
    _log : LogService,
    _errorHandler : HttpErrorHandlerService,
    _config : AppConfigService,
  ) {
    super(_client, _log, _errorHandler);
   }
}
