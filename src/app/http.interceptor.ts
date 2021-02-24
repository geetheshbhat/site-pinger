import {ErrorHandler, Injectable} from '@angular/core';
import {HttpInterceptor, HttpEvent, HttpRequest, HttpResponse, HttpHandler, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {map, filter, tap, retry, catchError} from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor{
    constructor (private _router : Router) {}
    intercept( HttpRequest : HttpRequest <any> , next : HttpHandler): Observable<HttpEvent<any>>{
        const authToken = localStorage.getItem('itemKey')
        const authReq = HttpRequest.clone({
            headers: HttpRequest.headers.set('Authorization', 'Bearer '+authToken)
          });
        return next.handle(authReq)
        .pipe(
            retry(1),
            catchError( (error : HttpErrorResponse)=>{
                let errorMessage = ''
                
                if (error.error instanceof ErrorEvent){

                    errorMessage = error.error.message
                }
                else if (error.status == 401){
                    localStorage.removeItem('itemKey')
                    this._router.navigate(['/'])
                    console.log('unauthorized');
                    

                } 
                else {
                    errorMessage = `Error Code : ${error.status} \n Message: ${error.message}`
                }

                return throwError(errorMessage)
            })
            )
    }
}

