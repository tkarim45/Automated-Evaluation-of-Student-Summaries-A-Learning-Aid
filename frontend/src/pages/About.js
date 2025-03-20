import React, { useState } from "react";

function About() {
  const [activeTimeline, setActiveTimeline] = useState(null);

  const timelineEvents = [
    {
      year: "2023",
      title: "Project Inception",
      description: "ADHD Eval was born from a passion to support students with ADHD using AI.",
    },
    {
      year: "2024",
      title: "Prototype Launch",
      description: "We launched our first prototype, featuring the ADHD quiz and summary evaluation.",
    },
    {
      year: "2025",
      title: "Full Release",
      description: "Expanded to include file Q&A and the Dr. ADHD chatbot, reaching thousands of students.",
    },
  ];

  const teamMembers = [
    {
      name: "Dr. Jane Smith",
      role: "Founder & ADHD Expert",
      bio: "A neuroscientist with 15+ years studying ADHD and its impact on learning.",
    },
    {
      name: "Alex Carter",
      role: "Lead Developer",
      bio: "A tech enthusiast building tools to make education accessible for all.",
    },
    {
      name: "Emily Brown",
      role: "UI/UX Designer",
      bio: "Crafting intuitive, ADHD-friendly designs with a focus on user experience.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">About ADHD Eval</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 animate-fade-in-delay">We’re a team dedicated to empowering students with ADHD through innovative, AI-driven tools.</p>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 animate-fade-in">Our Mission</h2>
          <p className="text-lg text-gray-600 leading-relaxed animate-fade-in-delay">At ADHD Eval, we believe every student deserves tools that match their unique learning needs. Our mission is to provide accessible, research-backed solutions that help students with ADHD succeed academically and beyond.</p>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-6 md:px-12 bg-gray-50">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 animate-fade-in">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center text-blue-600 text-2xl font-bold">{member.name[0]}</div>
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">{member.name}</h3>
              <p className="text-blue-600 text-center mb-2">{member.role}</p>
              <p className="text-gray-600 text-center">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Timeline Section */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 animate-fade-in">Our Journey</h2>
        <div className="max-w-3xl mx-auto">
          {timelineEvents.map((event, index) => (
            <div key={index} className="relative flex items-center mb-12 cursor-pointer" onMouseEnter={() => setActiveTimeline(index)} onMouseLeave={() => setActiveTimeline(null)}>
              {/* Timeline Dot */}
              <div className="absolute left-0 w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 z-10"></div>
              {/* Timeline Line */}
              <div className="absolute left-0 w-0.5 h-full bg-blue-200 transform -translate-x-1/2"></div>
              {/* Event Card */}
              <div className={`ml-8 p-6 bg-white rounded-lg shadow-md transition-all duration-300 w-full ${activeTimeline === index ? "scale-105 shadow-xl bg-blue-50" : ""}`}>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{event.year}</h3>
                <p className="text-blue-600 font-medium">{event.title}</p>
                <p className="text-gray-600 mt-2">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-6 animate-fade-in">Join Our Mission</h2>
        <p className="text-lg max-w-xl mx-auto mb-8 animate-fade-in-delay">Be part of a community transforming education for students with ADHD.</p>
        <a href="/login" className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-blue-100 transition-all duration-300 transform hover:scale-105">
          Get Started
        </a>
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

export default About;
