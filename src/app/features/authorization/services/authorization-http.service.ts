import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserModel} from "../model/user.model";
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

  login( userData: UserModel): Observable<any>{
    const url = `${environmet.baseApiUrl}/users`;
    return this.http.get( url, {params:{...userData}})
  }
}
