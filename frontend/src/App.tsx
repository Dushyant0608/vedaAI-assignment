import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CreateAssignment from './pages/CreateAssignment'
import AssignmentOutput from './pages/AssignmentOutput'

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-[#f5f5f5]">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<CreateAssignment />} />
              <Route path="/assignments/:id" element={<AssignmentOutput />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App