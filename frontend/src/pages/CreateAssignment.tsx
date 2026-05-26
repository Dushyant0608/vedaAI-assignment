import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAssignmentStore from '../store/assignmentStore'

const QUESTION_TYPE_OPTIONS = [
  'Multiple Choice Questions',
  'Short Questions',
  'Long Questions',
  'Diagram/Graph-Based Questions',
  'Numerical Problems',
  'True/False',
  'Fill in the Blanks',
  'Match the Following',
]

const CreateAssignment = () => {
  const navigate = useNavigate()
  const createAssignment = useAssignmentStore((s) => s.createAssignment)

  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [additionalInstructions, setAdditionalInstructions] = useState('')
  const [questionTypes, setQuestionTypes] = useState([
    { type: 'Multiple Choice Questions', numberOfQuestions: 4, marks: 1 },
    { type: 'Short Questions', numberOfQuestions: 3, marks: 2 },
  ])
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null)

  const totalQuestions = questionTypes.reduce((sum, qt) => sum + qt.numberOfQuestions, 0)
  const totalMarks = questionTypes.reduce((sum, qt) => sum + qt.numberOfQuestions * qt.marks, 0)

  const addQuestionType = () => {
    const usedTypes = questionTypes.map((qt) => qt.type)
    const available = QUESTION_TYPE_OPTIONS.find((t) => !usedTypes.includes(t))
    if (available) {
      setQuestionTypes([...questionTypes, { type: available, numberOfQuestions: 1, marks: 1 }])
    }
  }

  const removeQuestionType = (index: number) => {
    if (questionTypes.length <= 1) return
    setQuestionTypes(questionTypes.filter((_, i) => i !== index))
  }

  const updateField = (index: number, field: string, value: string | number) => {
    const updated = [...questionTypes]
    updated[index] = { ...updated[index], [field]: value }
    setQuestionTypes(updated)
    setDropdownOpen(null)
  }

  const increment = (index: number, field: 'numberOfQuestions' | 'marks') => {
    const updated = [...questionTypes]
    updated[index] = { ...updated[index], [field]: updated[index][field] + 1 }
    setQuestionTypes(updated)
  }

  const decrement = (index: number, field: 'numberOfQuestions' | 'marks') => {
    const updated = [...questionTypes]
    if (updated[index][field] > 1) {
      updated[index] = { ...updated[index], [field]: updated[index][field] - 1 }
      setQuestionTypes(updated)
    }
  }

  const handleSubmit = async () => {
    if (!title || !dueDate || questionTypes.length === 0) return

    try {
      const assignment = await createAssignment({
        title,
        dueDate,
        questionTypes: questionTypes.map((qt) => ({
          type: qt.type,
          numberOfQuestions: qt.numberOfQuestions,
          marks: qt.marks,
        })),
        additionalInstructions: additionalInstructions || undefined,
      })
      navigate(`/assignments/${assignment._id}`)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
          <h1 className="text-xl font-bold text-gray-900">Create Assignment</h1>
        </div>
        <p className="text-sm text-gray-500 ml-[18px]">Set up a new assignment for your students</p>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-1 mb-6">
        <div className="h-1 flex-1 bg-gray-900 rounded-full" />
        <div className="h-1 flex-1 bg-gray-200 rounded-full" />
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-3xl">
        {/* Section Title */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900">Assignment Details</h2>
          <p className="text-sm text-gray-500">Basic information about your assignment</p>
        </div>

        {/* Title Input */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter assignment title"
            className="w-full border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-white"
          />
        </div>

        {/* File Upload */}
        <div className="mb-5">
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center">
            <div className="text-gray-400 text-2xl mb-2">☁</div>
            <p className="text-sm text-gray-700 font-medium">Choose a file or drag & drop it here</p>
            <p className="text-xs text-gray-400 mt-1">JPEG, PNG, upto 10MB</p>
            <button
              type="button"
              className="mt-3 px-4 py-1.5 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50"
            >
              Browse Files
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">Upload images of your preferred document/image</p>
        </div>

        {/* Due Date */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Due Date</label>
          <div className="relative">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-white appearance-none"
            />
          </div>
        </div>

        {/* Question Types */}
        <div className="mb-5">
          {/* Header Row */}
          <div className="flex items-center mb-3">
            <span className="text-sm font-semibold text-gray-900 flex-1">Question Type</span>
            <span className="text-sm font-semibold text-gray-900 w-[120px] text-center">No. of Questions</span>
            <span className="text-sm font-semibold text-gray-900 w-[100px] text-center">Marks</span>
          </div>

          {/* Question Type Rows */}
          <div className="space-y-3">
            {questionTypes.map((qt, i) => (
              <div key={i} className="flex items-center gap-2">
                {/* Dropdown */}
                <div className="flex-1 relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(dropdownOpen === i ? null : i)}
                    className="w-full border border-gray-200 rounded-full px-4 py-2.5 text-sm text-left flex justify-between items-center bg-white hover:border-gray-300"
                  >
                    <span>{qt.type}</span>
                    <span className="text-gray-400 text-xs">∨</span>
                  </button>
                  {dropdownOpen === i && (
                    <div className="absolute top-12 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 max-h-48 overflow-auto">
                      {QUESTION_TYPE_OPTIONS.filter(
                        (opt) => !questionTypes.some((q, idx) => idx !== i && q.type === opt)
                      ).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => updateField(i, 'type', opt)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                            qt.type === opt ? 'bg-gray-50 font-medium' : ''
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeQuestionType(i)}
                  className="text-gray-400 hover:text-gray-600 text-lg w-6 flex items-center justify-center"
                >
                  ✕
                </button>

                {/* No. of Questions Stepper */}
                <div className="flex items-center border border-gray-200 rounded-full w-[120px]">
                  <button
                    type="button"
                    onClick={() => decrement(i, 'numberOfQuestions')}
                    className="w-8 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center text-sm font-medium">{qt.numberOfQuestions}</span>
                  <button
                    type="button"
                    onClick={() => increment(i, 'numberOfQuestions')}
                    className="w-8 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600"
                  >
                    +
                  </button>
                </div>

                {/* Marks Stepper */}
                <div className="flex items-center border border-gray-200 rounded-full w-[100px]">
                  <button
                    type="button"
                    onClick={() => decrement(i, 'marks')}
                    className="w-8 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center text-sm font-medium">{qt.marks}</span>
                  <button
                    type="button"
                    onClick={() => increment(i, 'marks')}
                    className="w-8 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Question Type */}
          <button
            type="button"
            onClick={addQuestionType}
            className="flex items-center gap-2 mt-3 text-sm text-gray-700"
          >
            <span className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-lg">+</span>
            Add Question Type
          </button>

          {/* Totals */}
          <div className="text-right mt-3 space-y-0.5">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Total Questions : </span>{totalQuestions}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Total Marks : </span>{totalMarks}
            </p>
          </div>
        </div>

        {/* Additional Instructions */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Additional Information (For better output)
          </label>
          <div className="relative">
            <textarea
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
              placeholder="e.g Generate a question paper for 3 hour exam duration..."
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 bg-white resize-none h-24"
            />
            <span className="absolute bottom-3 right-3 text-gray-400">🎙</span>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex justify-between items-center mt-6 max-w-3xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50"
        >
          ← Previous
        </button>
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#2a2a2a] transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  )
}

export default CreateAssignment