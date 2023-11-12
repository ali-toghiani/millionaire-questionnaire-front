import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionsRoutingModule } from './questions-routing.module';
import {NzCardModule} from "ng-zorro-antd/card";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    QuestionsRoutingModule,
    NzCardModule
  ]
})
export class QuestionsModule { }
