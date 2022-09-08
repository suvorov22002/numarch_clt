import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private _toast: ToastrService) { }

  showError(message:string , options?){
    this._toast.error(message , "Error" , options);
  }

  showSuccess(message:string , options?){
    this._toast.success(message , "success" , options);
  }
}
