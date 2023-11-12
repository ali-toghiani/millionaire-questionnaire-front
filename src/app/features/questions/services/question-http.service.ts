import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {QuestionModel} from "../../models/question.model";
import {HttpClient} from "@angular/common/http";
import {environmet} from "../../../environments/environment-dev";

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
}
