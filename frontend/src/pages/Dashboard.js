import React, { useState, useEffect } from "react";
import axios from "axios";
import ChatbotComponent from "../components/Chatbot";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

function Dashboard({ user }) {
  const [activeTab, setActiveTab] = useState("performance");
  const [metrics, setMetrics] = useState([]);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [fileQuestion, setFileQuestion] = useState("");
  const [summaryEvaluation, setSummaryEvaluation] = useState(null);

  // Dummy summaries with 3-4 paragraphs each
  const dummySummaries = [
    `The ocean is a huge place full of water that covers most of the Earth. It’s home to all kinds of animals like fish, whales, and tiny jelly creatures called plankton. The water is salty because it has lots of salt mixed in from rocks and rivers over a long time. People love to swim and sail on it, but it’s also very deep in some spots!

    Under the sea, there are mountains and valleys just like on land, but they’re hidden by water. Divers can explore coral reefs, which are like underwater gardens made by tiny animals. Sharks swim around looking for food, and dolphins play near the surface. It’s a busy world down there, even if we can’t see it all the time.

    The ocean helps the Earth stay healthy by making oxygen with plants called algae. It also moves heat around the planet with big currents, like rivers in the water. Sometimes, storms make giant waves that crash on beaches. We need to keep it clean because trash can hurt the animals that live there.

    Long ago, people used the ocean to travel and find new places. Ships carried explorers to faraway lands, and fishermen caught food from the waves. Today, scientists study it to learn more about weather and sea life. The ocean is a big mystery we’re still figuring out!`,

    `Forests are big areas full of trees, plants, and animals. Some are green all year, like pine forests, while others lose leaves in winter, like maple woods. Birds sing in the branches, and squirrels jump around collecting nuts. It’s a noisy place if you listen closely!

    Animals like bears and deer live in forests, finding food and hiding from danger. Trees give them shade and places to sleep, like nests or caves. Bugs crawl under leaves, helping break down old plants to make the soil rich. Every part of the forest works together like a team.

    People use forests for wood to build things, but cutting too many trees can hurt them. Fires can start in dry weather and spread fast, which is scary for the animals. Planting new trees helps keep forests alive. They’re important because they clean the air we breathe.

    Walking in a forest feels peaceful with all the green and quiet sounds. Some forests have trails for hiking, and others have rivers running through them. Long ago, people told stories about magical creatures living there. Forests are special places we need to take care of!`,

    `Space is a giant place with stars, planets, and black holes. The sun is our closest star, and it lights up our days. Planets like Mars and Jupiter spin around it, and some have moons that glow at night. It’s so big that we use telescopes to see faraway things.

    Astronauts travel to space in rockets to learn more about it. They float because there’s no gravity up there, which sounds fun! The moon is close enough that people have walked on it and left footprints. Stars twinkle from so far away we can’t visit them yet.

    Sometimes, rocks called meteors fall from space and light up the sky. Black holes are super strong and pull everything in, even light, so we can’t see them. Scientists think space goes on forever, which is hard to imagine. It’s full of mysteries waiting to be solved.

    Space helps us by letting satellites fly around Earth. They send signals for phones, TV, and weather reports. Kids dream of being astronauts to explore the stars. Space is like a big adventure story that never ends!`,

    `Rivers are long paths of water that flow across the land. They start in mountains where snow melts or rain falls, then wiggle down to lakes or the sea. Fish swim in them, and plants grow along the edges. People use rivers to drink, grow food, and have fun.

    Boats can sail on big rivers, carrying stuff like food or toys to towns. Animals like frogs and ducks love living near the water because it’s wet and cool. Sometimes, rivers flood and cover the land, which can be messy but helps make soil good for plants.

    Long ago, people built homes by rivers to fish and trade. Bridges cross them now so we can walk or drive over. Waterfalls happen when rivers drop down rocks, and they look amazing! Rivers are busy places that keep everything moving.

    Keeping rivers clean is super important. Trash and dirty water can make fish sick, and we need them healthy. Some rivers are famous, like the Nile or the Amazon, because they’re so big. They’re like nature’s highways!`,

    `Birds are cool animals with feathers and wings. They come in all colors, like red robins and blue jays, and sing pretty songs in the morning. Some fly high in the sky, while others hop on the ground looking for worms. Baby birds hatch from eggs in nests made of sticks.

    Big birds like eagles hunt for food with sharp claws, and tiny ones like hummingbirds sip nectar from flowers. Penguins can’t fly but swim in cold water instead. Owls stay up at night and see in the dark, which is neat! Every bird has a special trick.

    Birds move to warm places when it gets cold, called migration. They build nests in trees or cliffs to keep their eggs safe. People feed them with birdhouses or watch them with binoculars. They help plants grow by spreading seeds around.

    Some birds talk like parrots, repeating what we say, which is funny! Farmers like them because they eat bugs that hurt crops. Long ago, people used birds to send messages. Birds make the world more lively and fun!`,
  ];

  // Randomly select a dummy summary
  const [selectedSummary, setSelectedSummary] = useState(() => {
    const randomIndex = Math.floor(Math.random() * dummySummaries.length);
    return dummySummaries[randomIndex];
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/metrics/${user.email}`);
        setMetrics(res.data.metrics);
      } catch (err) {
        setError("Failed to load metrics");
      }
    };
    if (activeTab === "performance") fetchMetrics();
  }, [activeTab, user.email]);

  const handleSummarySubmit = async (e) => {
    e.preventDefault();
    if (!summary.trim()) {
      setError("Please enter a summary to evaluate.");
      return;
    }

    setError("");
    let endpoint;
    if (user.adhdStatus === "Not likely to have ADHD") {
      endpoint = "/notadhd/submit_summary";
    } else if (user.adhdStatus === "Likely to have ADHD" || user.adhdStatus === "Very likely to have ADHD") {
      endpoint = "/adhd/submit_summary";
    } else {
      setError("Invalid ADHD status.");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8000${endpoint}`, { summary });
      setSummaryEvaluation({
        markdown_content: response.data.markdown_content,
        content_score: response.data.content_score,
        wording_score: response.data.wording_score,
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to evaluate summary");
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    console.log("File Q&A:", { file: "dummyFile", question: fileQuestion });
    // Add RAG-based file Q&A logic here
  };

  // Chart Data Preparation
  const focusTimeData = {
    labels: metrics.map((m) => m.timestamp.split(" ")[0]),
    datasets: [
      {
        label: "Focus Time (min)",
        data: metrics.map((m) => m.focus_time),
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const tasksCompletedData = {
    labels: metrics.map((m) => m.timestamp.split(" ")[0]),
    datasets: [
      {
        label: "Tasks Completed",
        data: metrics.map((m) => m.task_completion),
        backgroundColor: "rgba(147, 51, 234, 0.8)",
        borderColor: "rgba(147, 51, 234, 1)",
        borderWidth: 1,
      },
    ],
  };

  const distractionsData = {
    labels: metrics.map((m) => m.timestamp.split(" ")[0]),
    datasets: [
      {
        label: "Distractions",
        data: metrics.map((m) => m.distraction_count),
        backgroundColor: ["#3b82f6", "#9333ea", "#60a5fa", "#a78bfa", "#dbeafe"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { backgroundColor: "rgba(0, 0, 0, 0.8)" },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "rgba(0, 0, 0, 0.1)" }, beginAtZero: true },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-md p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Welcome, {user.username}</h1>
          <p className="text-gray-600">Your ADHD Eval Dashboard</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-4 mb-8 flex-wrap">
            {["performance", "summaries", "files"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`py-2 px-6 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${activeTab === tab ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Performance Tab */}
          {activeTab === "performance" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {error && <p className="text-red-500 col-span-full text-center">{error}</p>}
              {metrics.length > 0 ? (
                <>
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Focus Time</h2>
                    <Line data={focusTimeData} options={chartOptions} />
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Tasks Completed</h2>
                    <Bar data={tasksCompletedData} options={chartOptions} />
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 md:col-span-2">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Distractions</h2>
                    <div className="max-w-md mx-auto">
                      <Pie data={distractionsData} options={{ ...chartOptions, maintainAspectRatio: false }} />
                    </div>
                  </div>
                </>
              ) : (
                <p className="col-span-full text-center text-gray-600">No metrics available yet.</p>
              )}
            </div>
          )}

          {/* Summaries Tab */}
          {activeTab === "summaries" && (
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Summary Evaluation</h2>
              <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-inner">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Text to Summarize</h3>
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{selectedSummary}</p>
              </div>
              <form onSubmit={handleSummarySubmit}>
                <textarea placeholder="Write your summary of the text above here..." value={summary} onChange={(e) => setSummary(e.target.value)} className="w-full p-3 border rounded-lg mb-4 h-48 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800 transition-all duration-300" />
                <button type="submit" className="py-2 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-md hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
                  Evaluate
                </button>
              </form>
              {error && <p className="text-red-500 mt-4">{error}</p>}
              {summaryEvaluation && (
                <div className="mt-8 p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-t-4 border-gradient-to-r from-blue-500 to-purple-600">
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Evaluation Results</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-inner transform hover:scale-105 transition-all duration-200">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-semibold">C</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Content Score</p>
                        <p className="text-lg font-semibold text-blue-600">{summaryEvaluation.content_score.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-inner transform hover:scale-105 transition-all duration-200">
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-purple-600 font-semibold">W</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Wording Score</p>
                        <p className="text-lg font-semibold text-purple-600">{summaryEvaluation.wording_score.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg shadow-inner border-l-4 border-blue-400">
                    <div className="absolute top-0 left-0 w-12 h-12 bg-blue-200 opacity-20 rounded-full -translate-x-6 -translate-y-6"></div>
                    <div className="absolute bottom-0 right-0 w-16 h-16 bg-purple-200 opacity-20 rounded-full translate-x-8 translate-y-8"></div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Feedback</h4>
                    <div className="prose max-w-none text-gray-700 leading-relaxed bg-white p-4 rounded-md shadow-sm">
                      <div dangerouslySetInnerHTML={{ __html: summaryEvaluation.markdown_content }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Files Tab */}
          {activeTab === "files" && (
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">File Q&A</h2>
              <form onSubmit={handleFileSubmit}>
                <input type="file" className="mb-4 w-full p-3 border rounded-lg bg-gray-50 text-gray-800" />
                <textarea placeholder="Ask a question about the file..." value={fileQuestion} onChange={(e) => setFileQuestion(e.target.value)} className="w-full p-3 border rounded-lg mb-4 h-48 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800 transition-all duration-300" />
                <button type="submit" className="py-2 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-md hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
                  Submit
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <ChatbotComponent />
    </div>
  );
}

export default Dashboard;
