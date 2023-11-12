import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzCardModule} from "ng-zorro-antd/card";
import {QuestionModel} from "../models/question.model";
import {QuestionHttpService} from "./services/question-http.service";
import {finalize, Subscription} from "rxjs";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {FormsModule} from "@angular/forms";
import {NzButtonModule} from "ng-zorro-antd/button";

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzCheckboxModule,
    FormsModule,
    NzButtonModule
  ],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.scss'
})
export class QuestionsComponent implements OnInit, OnDestroy {
  round = 0;
  score = 0;

  readonly NUMBER_OF_QUESTIONS = 5;
  questionIds: number[] = []

  question: QuestionModel | undefined;
  subscriptions = new Subscription();

  isLoading = false;

  selectedAnswerIds: number[] = [];

  log(value: any): void {
    console.log(value);
  }
  constructor(
    private httpService: QuestionHttpService
  ) {
  }

  ngOnInit() {
    this.questionIds = this.generateUniqueRandomNumbers(this.NUMBER_OF_QUESTIONS, 12);

    this.startRound(0);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  startRound( round: number ){
    const questionId = this.questionIds.pop();
    if (!questionId) {
      return;
    }
    this.subscriptions.add(
      this.httpService.getQuestion( 2 )
        .pipe( finalize(() => { this.isLoading = false;}))
        .subscribe(
          {
            next: res => {
              this.round += 1;
              this.question = res;
            },
            error: err => {
              console.error( err );
            }
          }
        )
    )
  }
  generateUniqueRandomNumbers(count: number, maxNumber: number): number[] {
    const uniqueNumbers: Set<number> = new Set();

    while (uniqueNumbers.size < count) {
      const randomNumber = Math.floor(Math.random() * (maxNumber + 1));
      uniqueNumbers.add(randomNumber);
    }

    return Array.from(uniqueNumbers);
  }
  updateSelectedAnswerIds( event: number[]): void {
    this.selectedAnswerIds = event;
  }

  actionClicked(): void{
    console.log(this.selectedAnswerIds);
  }
}
