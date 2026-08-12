import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from './components/NavBar'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import Settings from './pages/Settings'

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/History" element={<History />} />
          {/* <Route path="/Settings" element={<Settings />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
