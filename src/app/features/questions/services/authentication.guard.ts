import { Injectable } from '@angular/core';
import {
  Router,
  UrlTree
} from "@angular/router";
import {Observable} from "rxjs";
import {environmet} from "../../../environments/environment-dev";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {FeaturesPathsEnum} from "../../../enums/features-paths.enum";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard
{

  constructor(private router: Router, private notification: NzNotificationService) { }
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const key = localStorage.getItem(environmet.localStorageAuthorizationKey);

    const isAuthorized = (key != null && (key === 'true'));

    if (!isAuthorized){
      this.notification.create(
        'error',
        'Unauthorized',
        'Please Re-login'
      );
      this.router.navigate([`/${FeaturesPathsEnum.AUTHORIZATION}`])
    }

    return isAuthorized;
  }
}
