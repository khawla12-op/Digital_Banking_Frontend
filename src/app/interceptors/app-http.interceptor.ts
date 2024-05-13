import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {AuthService} from "../services/auth.service";
import {Observable} from "rxjs";

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor{
  constructor(private authService:AuthService) {}
  intercept(request:HttpRequest<unknown>,next:HttpHandler):Observable<HttpEvent<unknown>>{
    if (!request.url.includes("auth/login")) {
      let newRequest=request.clone({
        headers:request.headers.set("Authorization","Bearer "+this.authService.accessToken),

      })
      return next.handle(newRequest);
    }else return next.handle(request);

  }
}
