export type RawQuestion = {
  category: string
  type: "multiple" | "boolean"
  difficulty: "easy" | "medium" | "hard"
  question: string
  correct_answer: string
  incorrect_answers: string[]
}

export type RawAPIResponse = {
  response_code: number
  results: RawQuestion[]
}

export type QuizQuestion = {
  id: number
  question: string
  options: string[]
  correctAnswer: string
  type: RawQuestion["type"]
  category: string
  difficulty: RawQuestion["difficulty"]
}
