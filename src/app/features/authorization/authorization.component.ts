import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthorizationEnum} from "./enums/authorization.enum";
import {TranslateModule} from "@ngx-translate/core";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzFormModule} from "ng-zorro-antd/form";

@Component({
  selector: 'app-authorization',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, NzInputModule, NzIconModule, NzButtonModule, NzFormModule],
  templateUrl: './authorization.component.html',
  styleUrl: './authorization.component.scss'
})
export class AuthorizationComponent {

  mode: AuthorizationEnum = AuthorizationEnum.SING_UP;

  isLoading = false;
  passwordVisible = false;
  password?: string;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  })

  get authorizationMethod(): typeof AuthorizationEnum {
    return AuthorizationEnum
  }

  switchMode():void {
    this.mode = this.mode === AuthorizationEnum.LOGIN ? AuthorizationEnum.SING_UP : AuthorizationEnum.LOGIN;
  }

  submit(): void {
    if (this.isLoading){
      return;
    }

    this.isLoading = true;

    console.log(this.form.value);
  }
}
