import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http'
import {environment} from './../../environments/environment'
import { Domains } from '../models/domainModel';
import { Observable, throwError } from 'rxjs';
import { ErrorResponse } from '../models/errorResponse';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  constructor(private _http: HttpClient) { }
  public _url = environment.apiurl
  getData(): Observable<Domains>{
    return this._http.get<Domains>(this._url+'/v1')
  }

  login(formData){
    return this._http.post(this._url+'/users/login',formData)
  }

  latestError(): Observable<ErrorResponse>{
    return this._http.get<ErrorResponse>(this._url+'/v1/get-latest-error').pipe(
      (res)=>{
        return res
      }
    )
  }

  refreshSite(){
    return this._http.get(this._url + '/v1/refresh', {responseType: 'text'})
  }
}
