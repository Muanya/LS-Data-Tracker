import { Routes, Route } from 'react-router-dom'
import './App.css'
import Attendance from './pages/Attendance'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Attendance />} />
     
    </Routes>


  )
}

export default App
