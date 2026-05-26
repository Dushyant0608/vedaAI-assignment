import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import useAssignmentStore from '../store/assignmentStore'
import useSocket from '../hooks/useSocket'

const AssignmentOutput = () => {
  const { id } = useParams<{ id: string }>()
  const { current, loading, fetchAssignment, regenerateAssignment } = useAssignmentStore()

  useSocket(id)

  useEffect(() => {
    if (id) fetchAssignment(id)
  }, [id, fetchAssignment])

  if (loading || !current) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link to="/" className="text-blue-600 mb-4 block">← Back</Link>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{current.title}</h1>
        <div className="flex gap-2">
          <span className={`text-xs px-2 py-1 rounded ${
            current.status === 'completed' ? 'bg-green-100 text-green-700' :
            current.status === 'failed' ? 'bg-red-100 text-red-700' :
            current.status === 'processing' ? 'bg-blue-100 text-blue-700' :
            'bg-yellow-100 text-yellow-700'
          }`}>{current.status}</span>
          {current.status === 'completed' && (
            <button onClick={() => id && regenerateAssignment(id)}
              className="text-sm bg-gray-200 px-3 py-1 rounded">Regenerate</button>
          )}
        </div>
      </div>

      {current.status === 'processing' && (
        <div className="text-center py-12 text-gray-500">Generating question paper...</div>
      )}

      {current.status === 'failed' && (
        <div className="text-center py-12 text-red-500">
          Generation failed.
          <button onClick={() => id && regenerateAssignment(id)} className="text-blue-600 ml-2">Retry</button>
        </div>
      )}

      {current.status === 'completed' && current.output && (
        <div className="space-y-6">
          <div className="border-b pb-4">
            <p className="text-sm text-gray-500">Total Marks: {current.output.totalMarks} | Total Questions: {current.output.totalQuestions}</p>
          </div>

          {current.output.sections.map((section) => (
            <div key={section._id || section.title} className="border rounded-lg p-4">
              <h2 className="text-lg font-semibold">{section.title}</h2>
              <p className="text-sm text-gray-500 mb-3">{section.instruction} ({section.questionType})</p>

              <div className="space-y-3">
                {section.questions.map((q) => (
                  <div key={q._id || q.questionNumber} className="flex justify-between items-start">
                    <p className="flex-1">
                      <span className="font-medium">Q{q.questionNumber}.</span> {q.text}
                    </p>
                    <div className="flex gap-2 ml-4 shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        q.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                        q.difficulty === 'hard' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>{q.difficulty}</span>
                      <span className="text-xs text-gray-500">{q.marks}m</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AssignmentOutput
