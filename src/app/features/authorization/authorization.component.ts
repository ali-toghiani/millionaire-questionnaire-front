import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthorizationEnum} from "./enums/authorization.enum";

@Component({
  selector: 'app-authorization',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './authorization.component.html',
  styleUrl: './authorization.component.scss'
})
export class AuthorizationComponent {

  mode: AuthorizationEnum = AuthorizationEnum.SING_UP;

}
