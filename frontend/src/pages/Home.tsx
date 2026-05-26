
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import useAssignmentStore from '../store/assignmentStore'

const Home = () => {
  const { assignments, loading, fetchAssignments, deleteAssignment } = useAssignmentStore()

  useEffect(() => {
    fetchAssignments()
  }, [fetchAssignments])

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assignments</h1>
        <Link to="/create" className="bg-blue-600 text-white px-4 py-2 rounded">
          + Create Assignment
        </Link>
      </div>

      {assignments.length === 0 ? (
        <p className="text-gray-500">No assignments yet. Create one to get started.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignments.map((a) => (
            <div key={a._id} className="border rounded-lg p-4">
              <Link to={`/assignments/${a._id}`}>
                <h3 className="font-semibold">{a.title}</h3>
                <p className="text-sm text-gray-500">Due: {new Date(a.dueDate).toLocaleDateString()}</p>
                <span className={`text-xs px-2 py-1 rounded ${
                  a.status === 'completed' ? 'bg-green-100 text-green-700' :
                  a.status === 'failed' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>{a.status}</span>
              </Link>
              <button onClick={() => deleteAssignment(a._id)} className="text-red-500 text-sm mt-2 block">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home