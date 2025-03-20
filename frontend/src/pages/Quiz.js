import React, { useState } from "react";
import axios from "axios";

function Quiz({ onComplete }) {
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");

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

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: parseInt(value) }));
  };

  const calculateScore = () => {
    let score = 0;
    for (let i = 1; i <= 18; i++) {
      if (answers[i] !== undefined) {
        score += answers[i];
      }
    }
    return score;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(answers).length !== 18) {
      setError("Please answer all questions.");
      return;
    }

    const score = calculateScore();
    let adhdStatus = "";
    if (score < 14) {
      adhdStatus = "Not likely to have ADHD";
    } else if (score >= 14 && score <= 28) {
      adhdStatus = "Likely to have ADHD";
    } else {
      adhdStatus = "Very likely to have ADHD";
    }

    try {
      const email = localStorage.getItem("userEmail"); // Assuming email is stored after login
      await axios.post("http://localhost:8000/quiz", {
        email,
        adhd_status: adhdStatus,
      });
      onComplete(); // Redirect to dashboard
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to submit quiz");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-xl p-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">ADHD Evaluation Quiz</h2>
        <p className="text-center text-gray-600 mb-8">Please answer the following questions to assess ADHD symptoms. Your responses will help determine your status.</p>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          {/* Inattention Symptoms */}
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Inattention Symptoms</h3>
          {quizQuestions.slice(0, 9).map((q) => (
            <div key={q.id} className="mb-6">
              <p className="text-gray-800 font-medium mb-2">{q.question}</p>
              <div className="flex flex-wrap gap-4">
                {options.map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input type="radio" name={`q${q.id}`} value={option.value} onChange={() => handleAnswerChange(q.id, option.value)} className="mr-2 accent-blue-500" required />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {/* Hyperactive Symptoms */}
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Hyperactive Symptoms</h3>
          {quizQuestions.slice(9, 15).map((q) => (
            <div key={q.id} className="mb-6">
              <p className="text-gray-800 font-medium mb-2">{q.question}</p>
              <div className="flex flex-wrap gap-4">
                {options.map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input type="radio" name={`q${q.id}`} value={option.value} onChange={() => handleAnswerChange(q.id, option.value)} className="mr-2 accent-blue-500" required />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {/* Impulsive Symptoms */}
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Impulsive Symptoms</h3>
          {quizQuestions.slice(15).map((q) => (
            <div key={q.id} className="mb-6">
              <p className="text-gray-800 font-medium mb-2">{q.question}</p>
              <div className="flex flex-wrap gap-4">
                {options.map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input type="radio" name={`q${q.id}`} value={option.value} onChange={() => handleAnswerChange(q.id, option.value)} className="mr-2 accent-blue-500" required />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-md hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
            Submit Quiz
          </button>
        </form>
      </div>
    </div>
  );
}

export default Quiz;
