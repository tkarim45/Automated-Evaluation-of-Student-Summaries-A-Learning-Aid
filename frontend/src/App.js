import { Routes, Route, useNavigate, useLocation } from "react-router-dom"; // Add useLocation
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatbotComponent from "./components/Chatbot";
import Home from "./pages/Home";
import Doctor from "./pages/Doctor";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import { useState } from "react";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Add this to track the current route

  const handleLogin = (userData) => {
    setUser(userData);
    navigate("/quiz");
  };

  const handleLogout = () => {
    setUser(null); // Clear user state
    navigate("/login"); // Redirect to login page
  };

  // Check if the current path is "/doctor"
  const showFooter = location.pathname !== "/doctor";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} onLogout={handleLogout} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctor" element={<Doctor />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/quiz" element={<Quiz onComplete={() => navigate("/dashboard")} />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
        </Routes>
      </main>
      {showFooter && <Footer />} {/* Conditionally render Footer */}
      <ChatbotComponent />
    </div>
  );
}

export default App;
