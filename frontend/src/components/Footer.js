import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 py-10 px-6 shadow-inner backdrop-blur-md bg-opacity-90 border-t border-gray-800">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 hover:text-blue-300">ADHD Eval</h3>
          <p className="text-sm text-gray-400 leading-relaxed">1234 Learning St, Education City</p>
          <p className="text-sm text-gray-400 leading-relaxed">
            Email:{" "}
            <a href="mailto:support@adhdeval.com" className="hover:text-blue-300 transition-all duration-300">
              support@adhdeval.com
            </a>
          </p>
        </div>

        {/* Links Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold uppercase tracking-wide text-gray-300">Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/about" className="text-sm text-gray-400 hover:text-blue-300 transition-all duration-300 hover:shadow-glow">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/blog" className="text-sm text-gray-400 hover:text-blue-300 transition-all duration-300 hover:shadow-glow">
                Blog
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold uppercase tracking-wide text-gray-300">Legal</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-sm text-gray-400 hover:text-blue-300 transition-all duration-300 hover:shadow-glow">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-gray-400 hover:text-blue-300 transition-all duration-300 hover:shadow-glow">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} ADHD Eval. All rights reserved.</p>
      </div>

      {/* Custom CSS for Dark Theme Aesthetics */}
      <style jsx>{`
        footer {
          background: #111827; /* Deep gray */
          border-top: 1px solid rgba(31, 41, 55, 0.5);
        }
        .hover:shadow-glow:hover {
          text-shadow: 0 0 8px rgba(147, 197, 253, 0.5);
        }
        .bg-clip-text {
          background: linear-gradient(to right, #60a5fa, #a78bfa);
          -webkit-background-clip: text;
          background-clip: text;
        }
        .hover:text-blue-300:hover {
          color: #93c5fd;
        }
      `}</style>
    </footer>
  );
}

export default Footer;
