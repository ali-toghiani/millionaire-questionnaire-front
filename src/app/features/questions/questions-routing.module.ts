import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {QuestionsComponent} from "./questions.component";
import {AuthenticationGuard} from "./services/authentication.guard";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: QuestionsComponent,
    canActivate: [AuthenticationGuard],

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionsRoutingModule { }
