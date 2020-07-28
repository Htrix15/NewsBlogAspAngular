import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import {tap} from 'rxjs/operators'; 
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { MessagesService } from '../services/messages.service';
import { AuthService } from '../services/auth-service.service';
import { MyMessage } from '../services-models/my-message';

@Injectable()
export class GetErrorsInterceptor implements HttpInterceptor{
    constructor(private messageService: MessagesService, private router: Router, private auth: AuthService ){}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        return next.handle(req)
         .pipe( 
            tap((event)=>{
                if(event instanceof HttpResponse){
                        if(req.method=="POST" && !(req.url.endsWith("logon")) ){
                            this.messageService.setOKPostMessage();
                        };
                        if(req.method=="PUT"){
                            this.messageService.setOKPutMessage();
                        }
                        if(req.method=="DELETE"){
                            this.messageService.setOKDelMessage();
                        }
                        if(req.url.endsWith("logon")){
                            this.messageService.setOKLogoninMessage();
                        }
                        if(event.headers.has('auth') && event.headers.get('auth') == 'logoff'){
                            this.auth.logout();
                            this.router.navigate(['/admin/logon']);
                        }
                }
                },
                (event: HttpErrorResponse)=>{
                        if(event.status == 401 ){
                            if(!req.url.endsWith('check-admin')){
                                this.messageService.setMessage(new MyMessage(true, `Ошибка авторизации (code: ${event.status.toString()})`));
                                this.auth.logout();
                                this.router.navigate(['/admin/logon']);
                            }
                        } else {
                            this.messageService.setMessage(new MyMessage(true, `${event.headers.get("error")} (code: ${event.status.toString()})`));
                        }
                    }
                )
          ); 
    }  
}
