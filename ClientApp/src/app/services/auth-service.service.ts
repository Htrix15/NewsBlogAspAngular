import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { DataService } from './data.service';
import { Observable} from 'rxjs';
import { authType } from '../shared/my-types';
import { environment } from 'src/environments/environment';
import { AuthUser } from '../services-models/auth-user';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class AuthService {
    

    private patternsVK = {
        acessToken: new RegExp('#access_token=(.+?)&'),
        userId: new RegExp('user_id=(.+?)&'),
        email: new RegExp('email=(.+)')
    }    

    private patternsYandex = {
        code: new RegExp('#access_token=(.+?)&token_type')
    }
    private patternsGoogle = {
        code: new RegExp('#access_token=(.+?)&token_type')
    }

    private admin:boolean;
    private user:AuthUser;

    constructor(private dataService: DataService) { 

    }

    logon(user:User):Observable<boolean>{
        return new Observable((observer) => {
            this.dataService.postUserDatas<User, string>(user, "logon").subscribe(
                () =>{
                    this.admin = true;
                    observer.next(false);
                },
                ()=>{observer.next(true);}
              );
        });
    }
    
    logout(){
        this.dataService.getUserDatas("logout", null).subscribe();
        this.admin = false;
      
    }

    checkAdmin():Observable<boolean>{
        return new Observable((observer) => {
                this.dataService.getUserDatas("check-admin", null).subscribe(
                    () =>{   this.admin = true;  observer.next(true);},
                    () =>{   if(this.admin) {this.logout();}  observer.next(false)}
                )
        });
    }
    
    getUser():AuthUser{
        if(this.user){return (this.user);}
        else{
            try{
                let user:AuthUser = JSON.parse(sessionStorage.getItem("auth"));
                if(user!=null){
                    this.user = user;
                    return user;
                }
                return null;
            } catch{
                return null;
            }
        }
    }

    getAuthHref(service:authType):string{
        try{
            switch(service){
                case('vk'):{
                    let config = environment.configAuthVK;
                    return `${config.baseURL}?client_id=${config.clientId}&display=${config.display}&redirect_uri=${config.redirectUri}&scope=${config.scope}&response_type=${config.responseType}&v=${config.v}`;
                }
                case('ya'):{
                    let config = environment.configAuthYandex;
                    return `${config.baseURL}response_type=${config.response_type}&client_id=${config.ID}&redirect_uri=${config.CallbackURL}`;
                }
                case('google'):{
                    let config = environment.configAuthGoogle;
                    return `${config.authUri}?redirect_uri=${config.redirect_uris[0]}&response_type=${config.response_type}&client_id=${config.clientId}&scope=${config.scope}`;
                }
                default:{return null;}
            }
        } catch{
            console.error('auth config failed');
            return null;
        }
    }
    
    getUserAuth(url: string):Observable<AuthUser|string>{
        return new Observable((observer) => {
            let user = new AuthUser();
            if(url.includes("access_token") && url.includes("user_id") && url.includes("email")){ //VK
                let config = environment.configAuthVK;
                user.setToken(this.patternsVK.acessToken.exec(url)[1]);
                user.userId = this.patternsVK.userId.exec(url)[1];
                user.email = this.patternsVK.email.exec(url)[1];
                user.type = 'vk'
                this.dataService.getJSONP(`${config.JSONPbaseURL}method/${config.JSONPmethod}?user_id=${user.userId}&access_token=${user.getToken()}&v=${config.JSONPv}&callback=${config.JSONP_CALLBACK}`)
                .pipe(
                    map((VKResopns:any) => {
                        user.firstName = VKResopns.response[0].first_name; 
                        user.lastName  = VKResopns.response[0].last_name;
                    })).subscribe(()=>{
                        sessionStorage.setItem("auth",JSON.stringify(user));
                        observer.next(user);
                        },
                        (err:HttpErrorResponse) => observer.error(err.message));
            } else
            if(url.includes("#access_token=") && url.includes("/www.googleapis")){   
                let config = environment.configAuthGoogle;
                user.setToken(this.patternsGoogle.code.exec(url)[1]);
                this.dataService.getAuth(config.logonUrl, user.getToken()).subscribe(
                    (GoogleResponse:any) => {
                        user.email = GoogleResponse.email;
                        user.firstName = GoogleResponse.given_name;
                        user.lastName = GoogleResponse.name;
                        user.userId = GoogleResponse.id;
                        user.type = 'google';
                        sessionStorage.setItem("auth",JSON.stringify(user));
                        observer.next(user);
                    },
                    (err:HttpErrorResponse) => observer.error(err.message)
                    );
            } else 
            if(url.includes("#access_token=")){   
                let config = environment.configAuthYandex;
                user.setToken(this.patternsYandex.code.exec(url)[1]);
                this.dataService.getAuth(config.logonUrl ,user.getToken()).subscribe(
                    (YandexResponse:any) => {
                        user.email = YandexResponse.emails[0];
                        user.firstName = YandexResponse.first_name;
                        user.lastName = YandexResponse.last_name;
                        user.userId = YandexResponse.id;
                        user.type = 'ya';
                        sessionStorage.setItem("auth",JSON.stringify(user));
                        observer.next(user);
                    },
                    (err:HttpErrorResponse) => observer.error(err.message)
                    )
            } else {observer.next("no auth")}
        });
    }
}
