import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {QuestionModel} from "../models/question.model";
import {HttpClient} from "@angular/common/http";
import {environmet} from "../../../environments/environment-dev";
import {UserModel} from "../../../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class QuestionHttpService {

  constructor(
    private http: HttpClient
  ) { }

  getQuestion( id: number): Observable<QuestionModel>{
    const url = `${environmet.baseApiUrl}/questions/${id}`;
    return this.http.get<QuestionModel>( url );
  }

  updateUserScore( score: number): Observable<any> {
    const user: UserModel = (JSON.parse(localStorage.getItem('user') as string) as unknown as UserModel);
    const url = `${environmet.baseApiUrl}/users/${user.id}`;
    const data = {
      ...user,
      scores: [...(user.scores) as number[], score]
    };
    localStorage.setItem('user', JSON.stringify(data))
    return this.http.put( url , data)
  }

  postQuestion( data: QuestionModel ): Observable<any>{
    const url =`${environmet.baseApiUrl}/questions/1`;
    return this.http.put( url, data);
  }
}
