import React, { useState } from "react";
import { Link } from "react-router-dom";

function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const blogPosts = [
    {
      id: 1,
      title: "Understanding ADHD: A Beginner’s Guide",
      excerpt: "Learn the basics of ADHD, its symptoms, and how it affects students daily.",
      category: "Basics",
      date: "Feb 10, 2025",
    },
    {
      id: 2,
      title: "Top 5 Study Tips for ADHD Students",
      excerpt: "Practical strategies to stay focused and succeed in school.",
      category: "Tips",
      date: "Feb 15, 2025",
    },
    {
      id: 3,
      title: "The Science Behind ADHD and Learning",
      excerpt: "Explore the latest research on how ADHD impacts cognitive functions.",
      category: "Research",
      date: "Feb 18, 2025",
    },
    {
      id: 4,
      title: "How to Use ADHD Eval’s Tools Effectively",
      excerpt: "A step-by-step guide to maximizing our platform’s features.",
      category: "Tips",
      date: "Feb 20, 2025",
    },
  ];

  const categories = ["All", "Basics", "Tips", "Research"];

  const filteredPosts = selectedCategory === "All" ? blogPosts : blogPosts.filter((post) => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">ADHD Eval Blog</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 animate-fade-in-delay">Insights, tips, and research to help students with ADHD thrive.</p>
      </section>

      {/* Categories Filter */}
      <section className="py-8 px-6 md:px-12 bg-white sticky top-0 z-10 shadow-md">
        <div className="max-w-4xl mx-auto flex justify-center gap-4 flex-wrap">
          {categories.map((category) => (
            <button key={category} onClick={() => setSelectedCategory(category)} className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${selectedCategory === category ? "bg-blue-500 text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-16 px-6 md:px-12 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 animate-fade-in">Latest Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{post.category}</span>
                  <span>{post.date}</span>
                </div>
                <Link
                  to={`/blog/${post.id}`} // Placeholder URL; adjust routing as needed
                  className="mt-4 inline-block text-blue-600 font-medium hover:underline"
                >
                  Read More
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-6 animate-fade-in">Stay Informed</h2>
        <p className="text-lg max-w-xl mx-auto mb-8 animate-fade-in-delay">Subscribe to our blog for the latest ADHD insights and updates.</p>
        <div className="max-w-md mx-auto flex gap-2">
          <input type="email" placeholder="Enter your email" className="flex-1 p-3 rounded-md bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-md hover:bg-blue-100 transition-all duration-300">Subscribe</button>
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
      `}</style>
    </div>
  );
}

export default Blog;
