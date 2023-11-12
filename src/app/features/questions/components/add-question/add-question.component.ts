import {Component, OnDestroy} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzButtonModule} from "ng-zorro-antd/button";
import {RouterLink} from "@angular/router";
import {FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {AnswerModel, QuestionModel} from "../../models/question.model";
import {Subscription} from "rxjs";
import {QuestionHttpService} from "../../services/question-http.service";

@Component({
  selector: 'app-add-question',
  standalone: true,
  imports: [CommonModule, NzButtonModule, RouterLink, NzFormModule, NzGridModule, NzInputModule, ReactiveFormsModule, NzIconModule, NzCheckboxModule],
  templateUrl: './add-question.component.html',
  styleUrl: './add-question.component.scss'
})
export class AddQuestionComponent implements OnDestroy {

  form = new FormGroup(
    {
      title: new FormControl('', { validators: Validators.required, nonNullable: true}),
      point: new FormControl<number>(5,
        {
          validators: [
            Validators.required,
            Validators.min(5),
            Validators.max(20)
          ],
          nonNullable: true}
      ),
      answers: new FormArray<FormControl>([]),
      answer: new FormControl('')
    }
  )

  correctAnswerIds: number[] = [];

  subscriptions = new Subscription();

  constructor(
    private notification: NzNotificationService,
    private httpService: QuestionHttpService
  ) {
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  submit(): void {
    const { title, point, answers } = this.form.controls
    if (answers.value.length < 1){
      this.createNotification('error',
        'Invalid Form',
        'Create at least one answer'
      )
      return;
    }
    if (this.correctAnswerIds.length < 1){
      this.createNotification('error',
        'Invalid Form',
        'Select at least one answer as correct'
        )
      return;
    }

    if ( this.form.invalid ){
      this.createNotification('error',
        'Invalid Form',
        'Title and point are required'
      )
      console.log(this.form)
      return;
    }

    const data: QuestionModel = {
      id: 1,
      title: title.value,
      point: point.value,
      correct_answer_ids: this.correctAnswerIds,
      answers: this.mapAnswer(answers.value)
    }

    this.saveQuestion( data);
  }

  saveQuestion( data: QuestionModel ): void{
    this.subscriptions.add(
      this.httpService.postQuestion( data).subscribe(
        {
          next: res => {
            this.createNotification('success',
              'Success',
              'Question Submitted SuccessFully'
            )

            while (this.form.controls.answers.controls.length !== 0) {
              this.form.controls.answers.removeAt(0);
            }
            this.form.reset();
            this.correctAnswerIds = [];
          }
        }
      )
    )
  }

  mapAnswer( answers: string[]): AnswerModel[]{
    return answers.map( (item, index) => ({
      value: item,
      label: item,
      id: index
    }))
  }

  createNotification(type: 'success' | 'info' | 'warning' | 'error' | 'blank', title: string, content: string ): void {
    this.notification.create(
      type,
      title,
      content
    );
  }

  addAnswer(): void {
    const { value } = this.form.controls.answer;
    const { value: previousAnswers } = this.form.controls.answers;
    if (value && !previousAnswers.includes(value)){
      this.form.controls.answers.push(
        new FormControl( value )
      )
      this.form.controls.answer.reset();
    }
  }

  deleteAnswer( index: number): void {
    const {value} = this.form.controls.answers.value[index];
    this.form.controls.answers.removeAt(index);
    this.correctAnswerIds = this.correctAnswerIds.filter( item => item != index);
  }

  saveAnserIds( event: number[] ): void {
    this.correctAnswerIds = event;
  }
}
