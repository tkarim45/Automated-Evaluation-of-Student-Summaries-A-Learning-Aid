import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white py-24 px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between overflow-hidden">
        <div className="max-w-lg text-center lg:text-left z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">ADHD Eval</h1>
          <p className="text-lg md:text-xl mb-8 animate-fade-in-delay">Empowering students with ADHD-friendly tools to assess, learn, and thrive.</p>
          <Link to="/login" className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-blue-100 transition-all duration-300 transform hover:scale-105">
            Start Your Journey
          </Link>
        </div>
        <div className="mt-10 lg:mt-0 lg:w-1/2 animate-slide-in-right">
          <img src="https://cms.buzzrx.com/globalassets/buzzrx/blogs/how-to-manage-adhd-without-medication-for-adults.png" alt="Student with ADHD" className="w-full max-w-md mx-auto rounded-lg shadow-xl" />
        </div>
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10%" cy="10%" r="50" fill="white" />
            <circle cx="90%" cy="90%" r="70" fill="white" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="animate-fade-in-up">
            <h3 className="text-4xl font-bold text-blue-600">10K+</h3>
            <p className="text-gray-600">Students Supported</p>
          </div>
          <div className="animate-fade-in-up animation-delay-200">
            <h3 className="text-4xl font-bold text-blue-600">95%</h3>
            <p className="text-gray-600">Accuracy in Assessments</p>
          </div>
          <div className="animate-fade-in-up animation-delay-400">
            <h3 className="text-4xl font-bold text-blue-600">24/7</h3>
            <p className="text-gray-600">Chatbot Assistance</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 md:px-12 bg-gray-50">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 text-center mb-12 animate-fade-in">Tools Built for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">ADHD Assessment</h3>
            <p className="text-gray-600">Discover your ADHD profile with a quick, insightful quiz.</p>
          </div>
          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Summary Evaluation</h3>
            <p className="text-gray-600">Get AI-powered feedback on your summaries tailored to ADHD needs.</p>
          </div>
          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">File Q&A</h3>
            <p className="text-gray-600">Upload notes and ask questions—get instant, relevant answers.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 text-center mb-12 animate-fade-in">How It Works</h2>
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">1</div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Sign Up & Assess</h3>
              <p className="text-gray-600">Create an account and take our ADHD quiz to get started.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">2</div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Explore Tools</h3>
              <p className="text-gray-600">Use our dashboard to track performance, evaluate summaries, and more.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">3</div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Get Support</h3>
              <p className="text-gray-600">Chat with our ADHD Assistant anytime for guidance and answers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6 md:px-12 bg-gray-50">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 text-center mb-12 animate-fade-in">What Students Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
            <p className="text-gray-600 italic mb-4">"ADHD Eval helped me understand my focus challenges and gave me tools to stay on track!"</p>
            <p className="text-gray-800 font-semibold">— Alex, High School Student</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
            <p className="text-gray-600 italic mb-4">"The summary feedback is a game-changer. I finally feel confident in my work."</p>
            <p className="text-gray-800 font-semibold">— Sam, College Freshman</p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-6 md:px-12 text-center relative overflow-hidden">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4 animate-fade-in">Ready to Transform Your Learning?</h2>
        <p className="text-lg max-w-xl mx-auto mb-8 animate-fade-in-delay">Join thousands of students using ADHD Eval to succeed every day.</p>
        <Link to="/login" className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-blue-100 transition-all duration-300 transform hover:scale-105">
          Join Now
        </Link>
        {/* Background Decorative Circles */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20%" cy="30%" r="80" fill="white" />
            <circle cx="80%" cy="70%" r="60" fill="white" />
          </svg>
        </div>
      </section>

      {/* Custom Animations */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 1s ease-in-out;
        }
        .animate-fade-in-delay {
          animation: fadeIn 1s ease-in-out 0.3s;
          animation-fill-mode: backwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-in-out;
        }
        .animate-slide-in-right {
          animation: slideInRight 1s ease-in-out;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: backwards;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
          animation-fill-mode: backwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Home;
