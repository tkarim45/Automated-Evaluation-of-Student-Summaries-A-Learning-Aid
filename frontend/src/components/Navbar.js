import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogoutClick = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      onLogout();
      navigate("/login");
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 p-4 flex justify-between items-center text-white shadow-xl sticky top-0 z-20 backdrop-blur-md bg-opacity-80">
      {/* Logo */}
      <Link to="/" className="text-2xl md:text-3xl font-extrabold tracking-tight transition-all duration-300 hover:text-blue-100 flex items-center gap-3 group">
        <div className="w-12 h-12 bg-white bg-opacity-10 rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
          <span className="text-blue-200 text-xl font-bold">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRHvTXfecFw4TUtwS6_7MW2XIQRRX1S0MMoQ&s" alt="ADHD Eval" className="w-8 h-8 rounded-full" />
          </span>
        </div>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-300">ADHD Eval</span>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center space-x-8 md:space-x-10">
        <Link to="/doctor" className="text-lg font-medium uppercase tracking-wide transition-all duration-300 hover:text-blue-100 hover:shadow-glow">
          Dr. ADHD
        </Link>
        <Link to="/about" className="text-lg font-medium uppercase tracking-wide transition-all duration-300 hover:text-blue-100 hover:shadow-glow">
          About
        </Link>
        <Link to="/blog" className="text-lg font-medium uppercase tracking-wide transition-all duration-300 hover:text-blue-100 hover:shadow-glow">
          Blog
        </Link>
        {user ? (
          <div className="relative">
            <button onClick={toggleDropdown} onMouseEnter={() => setIsDropdownOpen(true)} className="text-lg font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-xl shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl">
              {user.username}
            </button>
            <div className={`absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border-t-2 border-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-in-out transform origin-top ${isDropdownOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"}`} onMouseLeave={() => setIsDropdownOpen(false)}>
              <Link to="/dashboard" className="block px-4 py-3 text-gray-800 hover:bg-blue-50 hover:text-blue-600 rounded-t-lg transition-colors duration-200">
                Dashboard
              </Link>
              <button onClick={handleLogoutClick} className="block w-full text-left px-4 py-3 text-gray-800 hover:bg-blue-50 hover:text-blue-600 rounded-b-lg transition-colors duration-200">
                Logout
              </button>
            </div>
          </div>
        ) : (
          <Link to="/login" className="text-lg font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-xl shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl">
            Login
          </Link>
        )}
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        nav {
          background: linear-gradient(90deg, #1e3a8a, #4f46e5, #6b21a8);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .hover:shadow-glow:hover {
          text-shadow: 0 0 8px rgba(147, 197, 253, 0.5);
        }
        .group:hover .bg-clip-text {
          background: linear-gradient(to right, #93c5fd, #d8b4fe);
          -webkit-background-clip: text;
          background-clip: text;
        }
        .dropdown {
          transform-origin: top;
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
