import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CreateAssignment from './pages/CreateAssignment'
import AssignmentOutput from './pages/AssignmentOutput'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateAssignment />} />
        <Route path="/assignments/:id" element={<AssignmentOutput />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App