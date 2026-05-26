import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAssignmentStore from '../store/assignmentStore'

const Home = () => {
  const { assignments, loading, fetchAssignments, deleteAssignment } = useAssignmentStore()
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchAssignments()
  }, [fetchAssignments])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filtered = assignments.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>

  // 0 State
  if (assignments.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full">
        {/* Illustration */}
        <div className="relative mb-6">
          <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center">
            <div className="relative">
              <div className="w-20 h-24 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center gap-1.5 p-2">
                <div className="w-12 h-1.5 bg-gray-800 rounded" />
                <div className="w-10 h-1 bg-gray-200 rounded" />
                <div className="w-10 h-1 bg-gray-200 rounded" />
                <div className="w-10 h-1 bg-gray-200 rounded" />
              </div>
              <div className="absolute -bottom-2 -right-4 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-red-500 text-xl font-bold">✕</span>
              </div>
            </div>
          </div>
          <div className="absolute top-2 right-0 flex gap-1">
            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
            <div className="w-6 h-2 bg-gray-200 rounded" />
          </div>
          <div className="absolute bottom-8 -left-2 text-blue-400 text-sm">✦</div>
          <div className="absolute top-12 -right-2 w-1.5 h-1.5 bg-blue-400 rounded-full" />
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">No assignments yet</h2>
        <p className="text-gray-500 text-sm text-center max-w-md mb-6 leading-relaxed">
          Create your first assignment to start collecting and grading student
          submissions. You can set up rubrics, define marking criteria, and let AI
          assist with grading.
        </p>
        <Link
          to="/create"
          className="flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#2a2a2a] transition-colors"
        >
          <span>+</span>
          Create Your First Assignment
        </Link>
      </div>
    )
  }

  // Filled State
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
          <h1 className="text-xl font-bold text-gray-900">Assignments</h1>
        </div>
        <p className="text-sm text-gray-500 ml-[18px]">
          Manage and create assignments for your classes.
        </p>
      </div>

      {/* Filter + Search */}
      <div className="flex items-center justify-between mb-5">
        <button className="flex items-center gap-2 text-sm text-gray-500">
          <span>▽</span>
          Filter By
        </button>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">⌕</span>
          <input
            type="text"
            placeholder="Search Assignment"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm w-64 focus:outline-none focus:border-gray-300 bg-white"
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((a) => (
          <div
            key={a._id}
            className="bg-white rounded-2xl p-5 border border-gray-100 relative cursor-pointer hover:shadow-sm transition-shadow"
            onClick={() => navigate(`/assignments/${a._id}`)}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold text-gray-900">{a.title}</h3>
              <div className="relative" ref={menuOpen === a._id ? menuRef : null}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setMenuOpen(menuOpen === a._id ? null : a._id)
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  ⋮
                </button>
                {menuOpen === a._id && (
                  <div className="absolute right-0 top-8 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-10 min-w-[160px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/assignments/${a._id}`)
                        setMenuOpen(null)
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      View Assignment
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteAssignment(a._id)
                        setMenuOpen(null)
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mt-12">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-700">Assigned on</span> :{' '}
                {new Date(a.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                }).replace(/\//g, '-')}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-700">Due</span> :{' '}
                {new Date(a.dueDate).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                }).replace(/\//g, '-')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20">
        <Link
          to="/create"
          className="flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg hover:bg-[#2a2a2a] transition-colors"
        >
          <span>+</span>
          Create Assignment
        </Link>
      </div>
    </div>
  )
}

export default Home