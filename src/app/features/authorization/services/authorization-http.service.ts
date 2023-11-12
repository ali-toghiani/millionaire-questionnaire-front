import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { UserModel} from "../../../models/user.model";
import {environmet} from "../../../environments/environment-dev";

@Injectable({
  providedIn: 'root'
})
export class AuthorizationHttpService {

  constructor(
    private http: HttpClient
  ) { }

  signup( userData: UserModel): Observable<any>{
    const url = `${environmet.baseApiUrl}/users`;
    return this.http.post( url, userData)
  }

  login( userData: UserModel): Observable<UserModel>{
    const url = `${environmet.baseApiUrl}/users`;
    return this.http.get<UserModel>( url, {params:{...userData}})
  }
}
