export interface QuestionType {
  type: string
  numberOfQuestions: number
  marks: number
  _id?: string
}

export interface Question {
  questionNumber: number
  text: string
  difficulty: 'easy' | 'moderate' | 'hard'
  marks: number
  _id?: string
}

export interface Section {
  title: string
  instruction: string
  questionType: string
  questions: Question[]
  _id?: string
}

export interface Assignment {
  _id: string
  title: string
  fileUrl?: string
  dueDate: string
  questionTypes: QuestionType[]
  additionalInstructions?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  output?: {
    sections: Section[]
    totalMarks: number
    totalQuestions: number
  }
  createdAt: string
  updatedAt: string
}
