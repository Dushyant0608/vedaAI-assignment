import { useNavigate, useLocation } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const showBack = location.pathname !== '/'

  const getTitle = () => {
    if (location.pathname === '/create') return 'Assignment'
    if (location.pathname.startsWith('/assignments/')) return 'Create New'
    return 'Assignment'
  }

  return (
    <header className="h-14 bg-white flex items-center justify-between px-6 border-b border-gray-100">
      <div className="flex items-center gap-3">
        {showBack && (
          <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
            ←
          </button>
        )}
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <span>⊞</span>
          <span>{getTitle()}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-gray-600">
          🔔
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center text-sm">
            👨‍🏫
          </div>
          <span className="text-sm font-medium text-gray-900">John Doe</span>
          <span className="text-gray-400 text-xs">∨</span>
        </div>
      </div>
    </header>
  )
}

export default Navbar
