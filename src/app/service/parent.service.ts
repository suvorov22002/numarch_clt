import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Parent } from '../modeles/parent';
import { CrudService } from './crud.service';
import { AppConfigService } from './helper/app-config.service';
import { HttpErrorHandlerService } from './helper/http-error-handler.service';
import { LogService } from './helper/log.service';

@Injectable({
  providedIn: 'root'
})
export class ParentService extends CrudService<Parent>{

  getPath(): string {
    return "/parent";
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
