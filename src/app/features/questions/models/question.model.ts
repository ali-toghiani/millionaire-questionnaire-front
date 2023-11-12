import {AnswerStatusEnum} from "../enums/question.enum";

export interface QuestionModel {
  id: number
  title: string
  answers: AnswerModel[]
  correct_answer_ids: number[]
  point: number
}

export interface AnswerModel {
  id: number,
  label: string,
  value: string,
  status?: AnswerStatusEnum
}
