
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Button } from './components/ui/button'
import Home from './Routers/Home.jsx';
import LOgin from './Routers/Login.jsx';
import Dashboard from './Routers/Dashboard.jsx';

function App() {
 

  return (
   <>
    <Router>
      <Routes>
         <Route path="/" element={<Home />} />
        
          <Route path="/login" element={<LOgin />} />
          <Route path="/dashboard" element={<Dashboard />} />
         
      </Routes>
    </Router>
   </>
  )
}

export default App
