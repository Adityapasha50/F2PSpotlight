import './App.css'
import { BrowserRouter, Routes, Route } from "react-router";
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Favourites from './pages/Favourites';
import Profile from './pages/Profile';
import Topup from './pages/Topup'; // Import halaman Topup
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/topup" element={<Topup />} /> 
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
