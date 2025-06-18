import { VboxApiService } from './vbox-api.service';
import { Router } from '@angular/router';
import { environment } from './../../environments/environment';

import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { filter, tap, catchError, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiTokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private router: Router, public api: VboxApiService) {}

intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  const authToken = localStorage.getItem('accessToken');
  
    if (authToken) {
      request = this.addToken(request, authToken);
    }

    return next.handle(request).pipe(catchError(error => {
      console.log(error)
      if (error instanceof HttpErrorResponse && error.status === 401) {
        if (error.error.cause && error.error.cause.indexOf('JWT expired') === -1) {
          this.api.logout();
          return throwError(error);
        } else {
          return this.handle401Error(request, next);
        }
      } else {
        this.api.logout();
        return throwError(error);
      }
    }));
}

private addToken(request: HttpRequest<any>, token: string) {
  return request.clone({
    setHeaders: {
      'Authorization': `Bearer ${token}`
    }
  });
}

private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
  if (!this.isRefreshing) {
    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return this.api.refreshToken().pipe(
      switchMap((token: any) => {
        if(!token) return of(null);
        this.isRefreshing = false;
        this.refreshTokenSubject.next(token.RefreshToken);
        localStorage.setItem("accessToken", token.AccessToken);
        localStorage.setItem("refreshToken", token.RefreshToken);
        return next.handle(this.addToken(request, token.AccessToken));
      }));

  } else {
    return this.refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap(jwt => {
       
        return next.handle(this.addToken(request, jwt));
      }));
  }
}
}