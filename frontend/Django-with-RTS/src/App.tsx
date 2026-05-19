import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Home from "./pages/Home.tsx";
import About from "./pages/About.tsx";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
