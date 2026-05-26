import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAssignmentStore from '../store/assignmentStore'

const CreateAssignment = () => {
  const navigate = useNavigate()
  const createAssignment = useAssignmentStore((s) => s.createAssignment)

  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [additionalInstructions, setAdditionalInstructions] = useState('')
  const [questionTypes, setQuestionTypes] = useState([
    { type: 'MCQ', numberOfQuestions: 5, marks: 2 },
  ])

  const addQuestionType = () => {
    setQuestionTypes([...questionTypes, { type: '', numberOfQuestions: 1, marks: 1 }])
  }

  const removeQuestionType = (index: number) => {
    setQuestionTypes(questionTypes.filter((_, i) => i !== index))
  }

  const updateQuestionType = (index: number, field: string, value: string | number) => {
    const updated = [...questionTypes]
    updated[index] = { ...updated[index], [field]: value }
    setQuestionTypes(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !dueDate || questionTypes.length === 0) return

    try {
      const assignment = await createAssignment({
        title,
        dueDate,
        questionTypes,
        additionalInstructions: additionalInstructions || undefined,
      })
      navigate(`/assignments/${assignment._id}`)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Assignment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Due Date</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
            className="w-full border rounded px-3 py-2" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Question Types</label>
          {questionTypes.map((qt, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input type="text" placeholder="Type (e.g. MCQ)" value={qt.type}
                onChange={(e) => updateQuestionType(i, 'type', e.target.value)}
                className="border rounded px-3 py-2 flex-1" required />
              <input type="number" placeholder="Count" value={qt.numberOfQuestions} min={1}
                onChange={(e) => updateQuestionType(i, 'numberOfQuestions', parseInt(e.target.value))}
                className="border rounded px-3 py-2 w-20" required />
              <input type="number" placeholder="Marks" value={qt.marks} min={1}
                onChange={(e) => updateQuestionType(i, 'marks', parseInt(e.target.value))}
                className="border rounded px-3 py-2 w-20" required />
              {questionTypes.length > 1 && (
                <button type="button" onClick={() => removeQuestionType(i)} className="text-red-500">✕</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addQuestionType} className="text-blue-600 text-sm">+ Add type</button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Additional Instructions</label>
          <textarea value={additionalInstructions} onChange={(e) => setAdditionalInstructions(e.target.value)}
            className="w-full border rounded px-3 py-2" rows={3} />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded w-full">
          Create & Generate
        </button>
      </form>
    </div>
  )
}

export default CreateAssignment
