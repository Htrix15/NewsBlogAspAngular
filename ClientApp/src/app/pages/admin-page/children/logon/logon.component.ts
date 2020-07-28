import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { User } from 'src/app/models/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-logon',
  templateUrl: './logon.component.html',
  styleUrls: ['./logon.component.scss']
})

export class LogonComponent implements OnInit {
  public form: FormGroup;
  public logoffCheck: boolean;
  private logonSubscribe: Subscription; 
  private authSubscribe: Subscription; 
  private checkAdminSubscribe: Subscription; 


  constructor(private dataService: DataService, private authService: AuthService) { 
    this.logoffCheck = true;
  }

  ngOnInit() {
    this.form = new FormGroup({
      login: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
    
    this.checkAdminSubscribe = this.authService.checkAdmin().subscribe(
      (yesAdmin)=>{ if(yesAdmin){this.logoffCheck = false;}
        else {this.logoffCheck = true; this.authService.logout();}},
      ()=> {this.logoffCheck = true; this.authService.logout();}
    )
  }

  submit(){
    if(this.form.controls.login.value.trim() && this.form.controls.password.value.trim()){
      let user = new User(this.form.controls.login.value,this.form.controls.password.value)
      this.authSubscribe = this.authService.logon(user).subscribe(
        (yesAuth)=>{ 
          this.logoffCheck = yesAuth;
        },
        ()=> this.logoffCheck = true
      );
    }
  }

  logout(){
    this.authService.logout();
    this.form.reset();
    this.logoffCheck = true;   
  }

  ngOnDestroy(){
    if(this.logonSubscribe){this.logonSubscribe.unsubscribe();}
    if(this.authSubscribe){this.authSubscribe.unsubscribe();}
    if(this.checkAdminSubscribe){this.checkAdminSubscribe.unsubscribe();}
  }

}
