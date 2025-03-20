import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState("auth"); // "auth", "profile", "quiz"
  const [profilePic, setProfilePic] = useState(null);
  const [username, setUsername] = useState("");
  const [quizAnswers, setQuizAnswers] = useState({});
  const navigate = useNavigate();

  const quizQuestions = [
    // Inattention Symptoms
    { id: 1, question: "Fails to give attention to details or makes careless mistakes in schoolwork, work, or during other activities (e.g., overlooks or misses details, work is inaccurate)." },
    { id: 2, question: "Has difficulty sustaining attention to tasks or play activities (e.g., has difficulty remaining focused during lectures; conversations; or lengthy reading)." },
    { id: 3, question: "Does not seem to listen when spoken to directly (e.g., mind seems elsewhere, even in the absence of any obvious distraction)." },
    { id: 4, question: "Does not follow through on instructions and fails to finish schoolwork, chores, or duties in the workplace (e.g., starts tasks but quickly loses focus and is easily sidetracked)." },
    { id: 5, question: "Has difficulty organizing tasks and activities (e.g., difficulty managing sequential tasks; difficulty keeping materials and belongings in order; messy, disorganized with work; has poor time management; fails to meet deadlines)." },
    { id: 6, question: "Avoids, dislikes, or is reluctant to engage in tasks that require sustained mental effort (e.g., schoolwork or homework; for older adolescents and adults, preparing reports, completing forms, reviewing lengthy papers)." },
    { id: 7, question: "Loses things necessary for tasks or activities (e.g., school materials, pencils, books, tools, wallets, keys, paperwork, eyeglasses, mobile telephones)." },
    { id: 8, question: "Is easily distracted by extraneous stimuli (for older adolescents and adults, may include unrelated thoughts)." },
    { id: 9, question: "Is forgetful in daily activities (e.g., doing chores, running errands; for older adolescents and adults, returning calls, paying bills, keeping appointments)." },
    // Hyperactive Symptoms
    { id: 10, question: "Fidgets with or taps hands or feet or squirms in seat." },
    { id: 11, question: "Leaves seat in situations in which it is inappropriate (NOTE: in adolescents or adults may be limited to feelings of restlessness)." },
    { id: 12, question: "Unable to play or engage in leisure activities quietly." },
    { id: 13, question: "Has difficulty playing or engaging in leisure activities quietly." },
    { id: 14, question: "Is 'on the go' or acts as if 'driven by a motor' (e.g., is unable to be or uncomfortable being still for extended time in restaurants, meetings; may be experienced by others as being restless or difficult to keep up with)." },
    { id: 15, question: "Talks excessively." },
    // Impulsive Symptoms
    { id: 16, question: "Blurts out answers before questions have been completed (e.g., completes people's sentences; cannot wait for turn in conversation)." },
    { id: 17, question: "Has difficulty waiting his or her turn (e.g., while waiting in line)." },
    { id: 18, question: "Interrupts or intrudes on others (e.g., butts into conversations, games, or activities; may start using other people's things without asking or receiving permission; for adolescents and adults may intrude into or take over what others are doing)." },
  ];

  const options = [
    { value: 0, label: "Not at all" },
    { value: 1, label: "Just a Little" },
    { value: 2, label: "Often" },
    { value: 3, label: "Very Often" },
  ];

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const endpoint = isSignup ? "/signup" : "/login";
      const res = await axios.post(`http://localhost:8000${endpoint}`, { email, password });
      if (isSignup) {
        setStep("profile");
      } else {
        onLogin({ email: res.data.email, username: res.data.username, adhdStatus: res.data.adhdStatus });
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    formData.append("username", username);
    if (profilePic) formData.append("profile_pic", profilePic);

    try {
      await axios.post("http://localhost:8000/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStep("quiz");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save profile");
    }
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(quizAnswers).length !== 18) {
      setError("Please answer all questions.");
      return;
    }

    let score = 0;
    for (let i = 1; i <= 18; i++) {
      if (quizAnswers[i] !== undefined) {
        score += quizAnswers[i];
      }
    }

    let adhdStatus = "";
    if (score < 14) {
      adhdStatus = "Not likely to have ADHD";
    } else if (score >= 14 && score <= 28) {
      adhdStatus = "Likely to have ADHD";
    } else {
      adhdStatus = "Very likely to have ADHD";
    }

    const quizData = {
      email: email,
      adhd_status: adhdStatus,
    };
    console.log("Sending quiz data:", quizData);

    try {
      const response = await axios.post("http://localhost:8000/quiz", quizData);
      console.log("Quiz response:", response.data);
      onLogin({ email, username, adhdStatus });
      navigate("/dashboard");
    } catch (err) {
      console.error("Quiz error:", err.response?.data);
      setError(err.response?.data?.detail?.map((d) => d.msg).join(", ") || "Failed to save quiz results");
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: parseInt(value) }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {step === "auth" && (
        <div className="max-w-md w-full mx-auto mt-12 bg-white rounded-xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">{isSignup ? "Sign Up" : "Login"}</h2>
          <p className="text-center text-gray-600 mb-8">{isSignup ? "Create your ADHD Eval account" : "Access your ADHD Eval account"}</p>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleAuthSubmit}>
            <div className="mb-4">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800" required />
            </div>
            <div className="mb-6">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800" required />
            </div>
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-md hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
              {isSignup ? "Sign Up" : "Login"}
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            {isSignup ? "Already have an account?" : "Need an account?"}{" "}
            <button onClick={() => setIsSignup(!isSignup)} className="text-blue-500 hover:text-blue-600 transition-colors duration-200">
              {isSignup ? "Login" : "Sign Up"}
            </button>
          </p>
        </div>
      )}

      {step === "profile" && (
        <div className="max-w-md w-full mx-auto mt-12 bg-white rounded-xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">Complete Your Profile</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleProfileSubmit}>
            <div className="mb-4">
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800" required />
            </div>
            <div className="mb-6">
              <input type="file" accept="image/*" onChange={(e) => setProfilePic(e.target.files[0])} className="w-full p-3 border rounded-lg bg-gray-50 text-gray-800" />
            </div>
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-md hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
              Next
            </button>
          </form>
        </div>
      )}

      {step === "quiz" && (
        <div className="min-h-screen bg-gray-100 flex flex-col py-12 px-6 sm:px-12 lg:px-24">
          <div className="flex-1">
            <h2 className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">ADHD Evaluation Quiz</h2>
            <p className="text-center text-gray-600 mb-10 text-lg">Please answer the following questions to assess ADHD symptoms. Your responses will help determine your permanent status.</p>
            {error && <p className="text-red-500 text-center mb-6">{error}</p>}
            <form onSubmit={handleQuizSubmit} className="space-y-10">
              {/* Inattention Symptoms */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Inattention Symptoms</h3>
                {quizQuestions.slice(0, 9).map((q) => (
                  <div key={q.id} className="mb-8">
                    <p className="text-gray-800 font-medium mb-3">{q.question}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {options.map((option) => (
                        <label key={option.value} className="flex items-center p-2 bg-gray-50 rounded-lg hover:bg-blue-50 transition-all duration-200">
                          <input type="radio" name={`q${q.id}`} value={option.value} onChange={() => handleAnswerChange(q.id, option.value)} className="mr-2 accent-blue-500" required />
                          <span className="text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Hyperactive Symptoms */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Hyperactive Symptoms</h3>
                {quizQuestions.slice(9, 15).map((q) => (
                  <div key={q.id} className="mb-8">
                    <p className="text-gray-800 font-medium mb-3">{q.question}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {options.map((option) => (
                        <label key={option.value} className="flex items-center p-2 bg-gray-50 rounded-lg hover:bg-blue-50 transition-all duration-200">
                          <input type="radio" name={`q${q.id}`} value={option.value} onChange={() => handleAnswerChange(q.id, option.value)} className="mr-2 accent-blue-500" required />
                          <span className="text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Impulsive Symptoms */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Impulsive Symptoms</h3>
                {quizQuestions.slice(15).map((q) => (
                  <div key={q.id} className="mb-8">
                    <p className="text-gray-800 font-medium mb-3">{q.question}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {options.map((option) => (
                        <label key={option.value} className="flex items-center p-2 bg-gray-50 rounded-lg hover:bg-blue-50 transition-all duration-200">
                          <input type="radio" name={`q${q.id}`} value={option.value} onChange={() => handleAnswerChange(q.id, option.value)} className="mr-2 accent-blue-500" required />
                          <span className="text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <button type="submit" className="py-3 px-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-md hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                  Finish Quiz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
