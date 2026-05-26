import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useAssignmentStore from '../store/assignmentStore'
import useSocket from '../hooks/useSocket'

const AssignmentOutput = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { current, loading, fetchAssignment, regenerateAssignment } = useAssignmentStore()

  useSocket(id)

  useEffect(() => {
    if (id) fetchAssignment(id)
  }, [id, fetchAssignment])

  if (loading || !current) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (current.status === 'processing' || current.status === 'pending') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mb-4" />
        <p className="text-gray-500 text-sm">Generating question paper...</p>
      </div>
    )
  }

  if (current.status === 'failed') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full">
        <p className="text-red-500 font-medium mb-3">Generation failed</p>
        <button
          onClick={() => id && regenerateAssignment(id)}
          className="bg-[#1a1a1a] text-white px-5 py-2 rounded-full text-sm hover:bg-[#2a2a2a]"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Top Banner */}
      <div className="bg-[#1a1a1a] text-white rounded-2xl p-5 mb-6">
        <p className="font-semibold text-sm leading-relaxed">
          Certainly, Lakshya! Here are customized Question Paper for your CBSE Grade 8 Science classes on the NCERT chapters:
        </p>
        <button className="mt-3 flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
          <span>📄</span>
          Download as PDF
        </button>
      </div>

      {/* Question Paper */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Delhi Public School, Sector-4, Bokaro</h1>
          <p className="text-base font-semibold text-gray-700 mt-1">Subject: {current.title}</p>
          <p className="text-base font-semibold text-gray-700">Class: 5th</p>
        </div>

        {/* Time + Marks */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm font-semibold text-gray-900">Time Allowed: 45 minutes</p>
          <p className="text-sm font-semibold text-gray-900">
            Maximum Marks: {current.output?.totalMarks}
          </p>
        </div>

        {/* General Instruction */}
        <p className="text-sm font-semibold text-gray-900 mb-6">
          All questions are compulsory unless stated otherwise.
        </p>

        {/* Student Info Lines */}
        <div className="mb-8 space-y-1.5">
          <p className="text-sm text-gray-900">
            <span className="font-semibold">Name:</span>{' '}
            <span className="inline-block w-48 border-b border-gray-400" />
          </p>
          <p className="text-sm text-gray-900">
            <span className="font-semibold">Roll Number:</span>{' '}
            <span className="inline-block w-36 border-b border-gray-400" />
          </p>
          <p className="text-sm text-gray-900">
            <span className="font-semibold">Class: 5th Section:</span>{' '}
            <span className="inline-block w-24 border-b border-gray-400" />
          </p>
        </div>

        {/* Sections */}
        {current.output?.sections.map((section, sIdx) => (
          <div key={section._id || sIdx} className="mb-8">
            {/* Section Title */}
            <h2 className="text-lg font-bold text-gray-900 text-center mb-4">{section.title}</h2>

            {/* Section Info */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-900">{section.questionType}</p>
              <p className="text-sm text-gray-600 italic">
                {section.instruction}. Each question carries{' '}
                {section.questions[0]?.marks} marks
              </p>
            </div>

            {/* Questions */}
            <ol className="space-y-3">
              {section.questions.map((q) => (
                <li key={q._id || q.questionNumber} className="flex gap-2 text-sm text-gray-800">
                  <span className="shrink-0 w-6 text-right">{q.questionNumber}.</span>
                  <span>
                    <span className="font-medium">
                      [{q.difficulty === 'easy' ? 'Easy' : q.difficulty === 'moderate' ? 'Moderate' : 'Challenging'}]
                    </span>{' '}
                    {q.text} [{q.marks} Marks]
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ))}

        {/* End */}
        <p className="text-sm font-bold text-gray-900 border-t border-gray-200 pt-4 mt-6">
          End of Question Paper
        </p>

        {/* Answer Key */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Answer Key:</h2>
          <p className="text-sm text-gray-500 italic mb-4">
            Answer key generation is available with AI Teacher's Toolkit
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-center gap-3 mt-6">
        <button
          onClick={() => id && regenerateAssignment(id)}
          className="flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#2a2a2a] transition-colors"
        >
          ↻ Regenerate
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 border border-gray-200 px-6 py-2.5 rounded-full text-sm text-gray-700 hover:bg-gray-50"
        >
          ← Back to Assignments
        </button>
      </div>
    </div>
  )
}

export default AssignmentOutput