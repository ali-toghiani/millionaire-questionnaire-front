import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzCardModule} from "ng-zorro-antd/card";
import {QuestionModel} from "./models/question.model";
import {QuestionHttpService} from "./services/question-http.service";
import {finalize, Subscription} from "rxjs";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {FormsModule} from "@angular/forms";
import {NzButtonModule} from "ng-zorro-antd/button";
import {AnswerStatusEnum} from "./enums/question.enum";
import {NzIconModule} from "ng-zorro-antd/icon";
import {UserModel} from "../../models/user.model";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzCheckboxModule,
    FormsModule,
    NzButtonModule,
    NzIconModule,
    RouterLink,
  ],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.scss'
})
export class QuestionsComponent implements OnInit, OnDestroy {
  round = 0;
  score = 0;
  maxScore = 0;

  isFinishedGame = false;

  readonly NUMBER_OF_QUESTIONS = 5;
  questionIds: number[] = []

  question: QuestionModel = {} as QuestionModel;
  subscriptions = new Subscription();

  isLoading = false;

  selectedAnswerIds: number[] = [];

  isReviewMode = false;

  user: UserModel = {} as UserModel;

  constructor(
    private httpService: QuestionHttpService
  ) {
  }

  ngOnInit() {
    this.questionIds = [ ...this.generateUniqueRandomNumbers(this.NUMBER_OF_QUESTIONS, 12), 1];
    this.getUserInfo();
    this.startNextRound();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getUserInfo(): void {
    this.user = JSON.parse(localStorage.getItem('user') as string)
  }

  startNextRound( ){
    const questionId = this.questionIds.pop();
    if (!questionId) {
      return;
    }
    this.subscriptions.add(
      this.httpService.getQuestion( questionId )
        .pipe( finalize(() => { this.isLoading = false;}))
        .subscribe(
          {
            next: res => {
              this.round += 1;
              this.question = res;
              this.maxScore += this.question.point;
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
      const randomNumber = Math.floor(Math.random() * (maxNumber - 1) + 2);
      uniqueNumbers.add(randomNumber);
    }

    return Array.from(uniqueNumbers);
  }
  updateSelectedAnswerIds( event: number[]): void {
    this.selectedAnswerIds = event;
  }

  actionClicked(): void{
    if (this.isReviewMode){
      this.isLoading = true;
      this.isReviewMode = false;
      this.selectedAnswerIds = [];

      if (this.round === this.NUMBER_OF_QUESTIONS){
        this.isFinishedGame = true;
        this.finishGame();
        return;
      }
      this.startNextRound()
    } else {
      this.revealAnswers();
    }
  }

  finishGame(): void {
    this.updateUserScore();
  }

  updateUserScore(): void {
    this.subscriptions.add(
      this.httpService.updateUserScore( this.score ).subscribe(
        {
          next: res => {
            console.log(res)
            this.getUserInfo();
          },
          error: err => {
            console.log(err);
          }
        }
      )
    )
  }


  replay(): void {
    this.round = 0;
    this.score = 0;
    this.maxScore = 0;
    this.isFinishedGame = false;
    this.isLoading = false;
    this.questionIds = [ ...this.generateUniqueRandomNumbers(this.NUMBER_OF_QUESTIONS, 12), 1];

    this.startNextRound();
  }

  revealAnswers(): void {
    this.isLoading = false;
    this.isReviewMode = true;
    let roundScore = 0;
    this.question?.answers.map( (answer, index) => {
      let tempStatus:AnswerStatusEnum | undefined;
      const { correct_answer_ids, point } = this.question;
      if ( correct_answer_ids.includes(this.question.answers[index].id)){
        if (this.selectedAnswerIds.includes(this.question.answers[index].id)){
          tempStatus = AnswerStatusEnum.CORRECT_SELECTED;
          roundScore += point / correct_answer_ids.length;

        } else {
          tempStatus = AnswerStatusEnum.CORRECT_UNSELECTED;
        }
      }
      else if (this.selectedAnswerIds.includes(this.question.answers[index].id)){
        tempStatus = AnswerStatusEnum.INCORRECT;
        roundScore -= point / correct_answer_ids.length;
      }
      this.question.answers[index].status = tempStatus;
    })
    this.score += roundScore;
  }

  get answerStatusEnum(): typeof AnswerStatusEnum{
    return AnswerStatusEnum;
  }
}
