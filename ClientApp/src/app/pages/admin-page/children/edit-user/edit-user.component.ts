import { Component, OnInit } from '@angular/core';
import { ChangeUser } from 'src/app/models/change-user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  public login: ChangeUser;
  public password: ChangeUser;

  public formLogin: FormGroup;
  public formPassword: FormGroup;

  private checkLoginSubscribe: Subscription; 
  private checkPasswordSubscribe: Subscription; 

  constructor(private dataService: DataService) { }
  
  ngOnInit(): void {
      this.formLogin = new FormGroup({
          oldLogin: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(15)]),
          newLogin: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(15)]),
        });
      this.formPassword = new FormGroup({
          oldPassword: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(15)]),
          newPassword: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(15)]),
        });
  }

  submitLogin(){
      let loginData = new ChangeUser(
          this.formLogin.controls.oldLogin.value,
          this.formLogin.controls.newLogin.value
      );
      this.checkLoginSubscribe = this.dataService.putUserDatas<ChangeUser, null>(loginData,"login").subscribe();
  }

  submitPassword(){
      let passwordData = new ChangeUser(
          this.formPassword.controls.oldPassword.value,
          this.formPassword.controls.newPassword.value
      );
      this.checkPasswordSubscribe = this.dataService.putUserDatas<ChangeUser, null>(passwordData,"password").subscribe();
  }

  ngOnDestroy(){
    if(this.checkLoginSubscribe){this.checkLoginSubscribe.unsubscribe()}
    if(this.checkPasswordSubscribe){this.checkPasswordSubscribe.unsubscribe()}
  }
}
