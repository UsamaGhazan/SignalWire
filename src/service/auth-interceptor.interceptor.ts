import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const idToken = localStorage.getItem("f_token");
    const layout=localStorage.getItem("layoutStatus");
    if (idToken && layout=="flytrap") {
      request = request.clone({
          setHeaders: {
              'Content-Type': 'application/json; charset=utf-8',
              Accept: 'application/json',
              'x-access-token': idToken
          }
      });
    } else {
      request = request.clone({
        setHeaders: {
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json",
        },
      });
    }
    return next.handle(request);
  }
}
