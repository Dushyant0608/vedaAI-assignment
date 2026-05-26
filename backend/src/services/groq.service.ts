import Groq from 'groq-sdk'
import { GROQ_API_KEY } from '../config/env'

const groq = new Groq({ apiKey: GROQ_API_KEY })

interface QuestionType {
  type: string
  numberOfQuestions: number
  marks: number
}

interface GenerateInput {
  title: string
  questionTypes: QuestionType[]
  additionalInstructions?: string
  fileContent?: string
}

interface GeneratedQuestion {
  questionNumber: number
  text: string
  difficulty: 'easy' | 'moderate' | 'hard'
  marks: number
}

interface GeneratedSection {
  title: string
  instruction: string
  questionType: string
  questions: GeneratedQuestion[]
}

interface GeneratedOutput {
  sections: GeneratedSection[]
  totalMarks: number
  totalQuestions: number
}

const buildPrompt = (input: GenerateInput): string => {
  const sectionDetails = input.questionTypes
    .map(
      (qt, i) =>
        `Section ${String.fromCharCode(65 + i)}: ${qt.numberOfQuestions} questions of type "${qt.type}", each worth ${qt.marks} marks`
    )
    .join('\n')

  return `You are an expert exam paper generator. Create a structured question paper based on the following:

Title: ${input.title}

Sections Required:
${sectionDetails}

${input.additionalInstructions ? `Additional Instructions: ${input.additionalInstructions}` : ''}

${input.fileContent ? `Reference Material:\n${input.fileContent}` : ''}

IMPORTANT: Respond ONLY with valid JSON matching this exact structure, no markdown, no backticks, no explanation:

{
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions",
      "questionType": "MCQ",
      "questions": [
        {
          "questionNumber": 1,
          "text": "Question text here",
          "difficulty": "easy",
          "marks": 2
        }
      ]
    }
  ],
  "totalMarks": 100,
  "totalQuestions": 50
}

Rules:
- difficulty must be one of: "easy", "moderate", "hard"
- Mix difficulties: ~40% easy, ~40% moderate, ~20% hard
- Each section title should be "Section A", "Section B", etc.
- Each section instruction should describe what to do (e.g., "Choose the correct option", "Answer in brief")
- totalMarks and totalQuestions must match the actual content
- Questions must be relevant, well-formed, and academically appropriate`
}

const parseResponse = (text: string): GeneratedOutput => {
  const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
  const parsed = JSON.parse(cleaned)

  if (!parsed.sections || !Array.isArray(parsed.sections)) {
    throw new Error('Invalid response: missing sections array')
  }

  for (const section of parsed.sections) {
    if (!section.title || !Array.isArray(section.questions)) {
      throw new Error('Invalid response: malformed section')
    }
    for (const q of section.questions) {
      if (!q.text || !q.difficulty || !q.marks) {
        throw new Error('Invalid response: malformed question')
      }
      if (!['easy', 'moderate', 'hard'].includes(q.difficulty)) {
        q.difficulty = 'moderate'
      }
    }
  }

  return {
    sections: parsed.sections,
    totalMarks: parsed.totalMarks || 0,
    totalQuestions: parsed.totalQuestions || 0,
  }
}

export const generateQuestionPaper = async (input: GenerateInput): Promise<GeneratedOutput> => {
  const prompt = buildPrompt(input)

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 4096,
  })

  const text = response.choices[0]?.message?.content
  if (!text) throw new Error('Empty response from Groq')

  return parseResponse(text)
}