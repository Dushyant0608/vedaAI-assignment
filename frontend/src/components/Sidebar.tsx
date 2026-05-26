import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Home', icon: '⊞', path: '/' },
  { label: 'My Groups', icon: '👥', path: '#' },
  { label: 'Assignments', icon: '📋', path: '/' },
  { label: "AI Teacher's Toolkit", icon: '📄', path: '#' },
  { label: 'My Library', icon: '📚', path: '#' },
]

const Sidebar = () => {
  const location = useLocation()

  return (
    <aside className="w-[280px] h-screen bg-white rounded-r-2xl flex flex-col justify-between p-5 border-r border-gray-100 shrink-0">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            V
          </div>
          <span className="text-xl font-bold text-gray-900">VedaAI</span>
        </div>

        {/* Create Button */}
        <Link
          to="/create"
          className="flex items-center justify-center gap-2 w-full py-3 bg-[#1a1a1a] text-white rounded-full border-2 border-orange-500 font-medium text-sm mb-8 hover:bg-[#2a2a2a] transition-colors"
        >
          <span>✦</span>
          Create Assignment
        </Link>

        {/* Nav Items */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = item.label === 'Assignments' && location.pathname === '/'

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${
                  isActive
                    ? 'bg-gray-100 text-gray-900 font-semibold'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom */}
      <div>
        <Link to="#" className="flex items-center gap-3 px-4 py-2.5 text-gray-500 text-sm mb-4">
          <span>⚙</span>
          Settings
        </Link>

        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
          <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center text-lg">
            👨‍🏫
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Delhi Public School</p>
            <p className="text-xs text-gray-500">Bokaro Steel City</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
