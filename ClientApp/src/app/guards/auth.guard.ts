import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth-service.service";
import { MessagesService } from "../services/messages.service";
import { Injectable } from "@angular/core";
import { MyMessage } from "../services-models/my-message";

@Injectable()
export class AuthGuard implements CanActivate,  CanActivateChild {

private guard:Observable<boolean>;

constructor(private authService: AuthService, private messagesService: MessagesService, private router: Router ) { 
  this.guard = new Observable<boolean>
    ((observer) => {
      this.authService.checkAdmin().subscribe(
          (result)=>{
            if(result) {
              observer.next(true);
            } else{
              this.messagesService.setMessage(new MyMessage(true,"не админам нельзя!"));
              this.router.navigate(['/admin/logon']);
            }
            },
          ()=>{  
            this.messagesService.setMessage(new MyMessage(true,"не админам нельзя!"));
            this.router.navigate(['/admin/logon']);}
        );
    });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.guard;
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> 
  {
    return this.guard;
  }

}

