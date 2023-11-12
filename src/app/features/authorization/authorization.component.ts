import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthorizationEnum} from "./enums/authorization.enum";
import {TranslateModule} from "@ngx-translate/core";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzFormModule} from "ng-zorro-antd/form";
import {AuthorizationHttpService} from "./services/authorization-http.service";
import {finalize, Subscription} from "rxjs";
import { UserModel } from "../../models/user.model";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {environmet} from "../../environments/environment-dev";
import {Router} from "@angular/router";
import {FeaturesPathsEnum} from "../../enums/features-paths.enum";

@Component({
  selector: 'app-authorization',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
    NzFormModule,
  ],
  templateUrl: './authorization.component.html',
  styleUrl: './authorization.component.scss'
})
export class AuthorizationComponent implements OnInit, OnDestroy {

  mode: AuthorizationEnum = AuthorizationEnum.SING_UP;

  isLoading = false;
  passwordVisible = false;
  password?: string;

  form = new FormGroup({

    email: new FormControl('', {
      validators:[Validators.required, Validators.email],
      nonNullable:true
    } ),

    password: new FormControl('', {
      validators:[Validators.required, Validators.minLength(8)],
      nonNullable: true
    })

  })

  subscriptions = new Subscription();


  constructor(
    private httpService: AuthorizationHttpService,
    private notification: NzNotificationService,
    private router: Router
  ) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  get authorizationMethod(): typeof AuthorizationEnum {
    return AuthorizationEnum
  }

  switchMode():void {
    this.mode = this.mode === AuthorizationEnum.LOGIN ? AuthorizationEnum.SING_UP : AuthorizationEnum.LOGIN;
  }

  submit(): void {
    if (this.isLoading || this.form.invalid){
      return;
    }

    this.isLoading = true;

    if (this.mode === AuthorizationEnum.SING_UP){
      this.signup();
    } else {
      this.login();
    }
  }
  signup(): void {
    const { email, password } = this.form.value;const min = 1000; // Minimum 4-digit number
    const max = 9999; // Maximum 4-digit number

    const random4DigitNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    const data = {
      id: random4DigitNumber.toString(),
      email,
      password,
      scores: []
    }
    this.subscriptions.add(
      this.httpService.signup( data as UserModel)
        .pipe(
          finalize(()=> {this.isLoading = false;})
        )
        .subscribe(
          {
            next: res => {
              this.mode = AuthorizationEnum.LOGIN;
              this.createNotification('success',
                'Signup Succeeded',
                'Use your Credentials to Login',
              )
            },
            error: err => {
              this.createNotification('error',
                'Signup Failed',
                err.error.error,
              )
            }
          }
        )
    )
  }

  login(): void {
    this.subscriptions.add(
      this.httpService.login( this.form.value as UserModel)
        .pipe(
          finalize(()=> {this.isLoading = false;})
        )
        .subscribe(
          {
            next: res => {
              this.createNotification('success',
                'Login Succeeded',
                'You Are being redirected ...'
              )
              localStorage.setItem( environmet.localStorageAuthorizationKey, 'true');
              localStorage.setItem( 'user', JSON.stringify(res));
              this.router.navigate(['/' + FeaturesPathsEnum.QUESTIONS]);
            },
            error: err => {
              this.createNotification('error',
                'Login Failed',
                err.error.error,
              )
            }
          }
        )
    )
  }

  createNotification(type: 'success' | 'info' | 'warning' | 'error' | 'blank', title: string, content: string ): void {
    this.notification.create(
      type,
      title,
      content
    );
  }
}
