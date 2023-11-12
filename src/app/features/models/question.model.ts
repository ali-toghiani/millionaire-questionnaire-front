export interface QuestionModel {
  id: number
  title: string
  answers: AnswerModel[]
  correct_answer_ids: number[]
}

export interface AnswerModel {
  id: number,
  label: string,
  value: string
}
