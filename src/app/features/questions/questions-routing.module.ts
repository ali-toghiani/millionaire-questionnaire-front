import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {QuestionsComponent} from "./questions.component";
import {AuthenticationGuard} from "./services/authentication.guard";
import {AddQuestionComponent} from "./components/add-question/add-question.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: QuestionsComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'add',
    pathMatch: 'full',
    component: AddQuestionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionsRoutingModule { }
