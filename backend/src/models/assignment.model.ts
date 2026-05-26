import mongoose from 'mongoose'

const questionTypeSchema = new mongoose.Schema({
  type: { type: String, required: true },
  numberOfQuestions: { type: Number, required: true },
  marks: { type: Number, required: true },
})

const questionSchema = new mongoose.Schema({
  questionNumber: { type: Number },
  text: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'moderate', 'hard'] },
  marks: { type: Number },
})

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },       // Section A, Section B
  instruction: { type: String },                  // Attempt all questions
  questionType: { type: String },                 // Short Answer Questions
  questions: [questionSchema],
})

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    fileUrl: { type: String },
    dueDate: { type: Date, required: true },
    questionTypes: [questionTypeSchema],
    additionalInstructions: { type: String },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    output: {
      sections: [sectionSchema],
      totalMarks: { type: Number },
      totalQuestions: { type: Number },
    },
  },
  { timestamps: true }
)

const Assignment = mongoose.model('Assignment', assignmentSchema)

export default Assignment