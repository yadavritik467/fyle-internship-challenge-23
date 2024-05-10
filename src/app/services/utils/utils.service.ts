import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(private readonly toastr: ToastrService) {}
  createParams(params: { [key: string]: string | number | boolean }) {
    let httpParams = new HttpParams();

    for (const key in params) {
      httpParams = httpParams.set(key, params[key]);
    }

    return httpParams;
  }

  showError(message: string) {
    this.toastr.error(message, 'Error');
  }
}
