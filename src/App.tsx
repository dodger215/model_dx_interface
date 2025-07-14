// import './App.css'
// import AnimatedBackground from './components/ui/background'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LandingPage } from './pages/welcome';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import { SessionPage } from './pages/main';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <>
    {/* <AnimatedBackground/> */}
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage/>} />
        <Route path='/auth/login' element={<Login/>} />
        <Route path='/auth/register' element={<Register/>}/>
        <Route path='/main' element={<SessionPage/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
