import React, { useState, useRef, useEffect } from "react";

function Doctor() {
  const [conversations, setConversations] = useState([{ id: 1, title: "New Chat", messages: [] }]);
  const [currentConversation, setCurrentConversation] = useState(1);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatContainerRef = useRef(null); // Ref for the chat conversation container

  const exampleQuestions = ["What causes ADHD?", "How can I improve focus with ADHD?", "What are effective ADHD treatments?", "How does ADHD affect learning?"];

  const sendMessageToLLM = async (messageText) => {
    try {
      const response = await fetch("http://localhost:8000/doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: messageText }),
      });
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error calling LLM:", error);
      return "Sorry, there was an error processing your request.";
    }
  };

  const handleExampleQuestion = async (question) => {
    const newMessage = { text: question, sender: "user", timestamp: new Date() };
    setChatHistory([...chatHistory, newMessage]);

    const botResponseText = await sendMessageToLLM(question);
    const botResponse = { text: botResponseText, sender: "bot", timestamp: new Date() };
    setChatHistory((prev) => [...prev, botResponse]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = { text: message, sender: "user", timestamp: new Date() };
    setChatHistory([...chatHistory, newMessage]);

    const botResponseText = await sendMessageToLLM(message);
    const botResponse = { text: botResponseText, sender: "bot", timestamp: new Date() };
    setChatHistory((prev) => [...prev, botResponse]);
    setMessage("");
  };

  const handleDeleteAll = () => {
    setConversations([{ id: 1, title: "New Chat", messages: [] }]);
    setCurrentConversation(1);
    setChatHistory([]);
  };

  // Scroll to the bottom of the chat container whenever chatHistory updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar - Fixed, Offset from Navbar */}
      <div className="fixed top-23 left-0 h-[calc(100vh-4rem)] w-64 bg-gray-50 text-gray-800 shadow-lg p-4 flex flex-col border-r border-gray-200">
        {/* Header - Fixed at Top of Sidebar */}
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">Dr. ADHD</h2>
          <button onClick={handleDeleteAll} className="p-1 text-gray-500 hover:text-red-500 transition-colors duration-200" title="Clear History">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M4 7h16" />
            </svg>
          </button>
        </div>
        {/* Conversation List - Scrollable with Defined Height */}
        <div className="flex-1 overflow-y-auto" style={{ height: "calc(100% - 120px)" }}>
          {conversations.map((conv) => (
            <div key={conv.id} className={`p-2 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-200 ${currentConversation === conv.id ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white" : "text-gray-700"}`} onClick={() => setCurrentConversation(conv.id)}>
              {conv.title}
            </div>
          ))}
        </div>
        {/* New Chat Button - Fixed at Bottom */}
        <div className="absolute bottom-10 left-4 right-4 flex-shrink-0">
          <button
            className="w-full p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-md hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            onClick={() => {
              const newId = conversations.length + 1;
              setConversations([...conversations, { id: newId, title: `New Chat ${newId}`, messages: [] }]);
              setCurrentConversation(newId);
              setChatHistory([]);
            }}
          >
            New Chat
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Chat Area Container */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Welcome Message - Static */}
          {chatHistory.length === 0 && (
            <div className="flex-shrink-0 text-center max-w-2xl mx-auto p-6">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 mb-4">Dr. ADHD</h1>
              <p className="text-gray-600 mb-8">Your virtual assistant for ADHD-related questions. Ask me anything!</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exampleQuestions.map((question, index) => (
                  <button key={index} className="p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-300" onClick={() => handleExampleQuestion(question)}>
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Chat History - Scrollable with Explicit Height */}
          <div className="flex-1 overflow-y-auto p-6" ref={chatContainerRef} style={{ maxHeight: "calc(100vh - 180px)" }}>
            {chatHistory.length > 0 && (
              <div className="max-w-3xl mx-auto space-y-4">
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] p-4 rounded-lg shadow-md ${msg.sender === "user" ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white" : "bg-gray-100 text-gray-800"}`}>
                      {msg.text}
                      <div className="text-xs mt-1 opacity-75">{msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Input Area - Fixed at Bottom */}
        <div className="fixed bottom-0 left-64 right-0 p-4 bg-white border-t border-gray-200 shadow-lg flex-shrink-0">
          <form onSubmit={handleSubmit}>
            <div className="max-w-3xl mx-auto flex gap-3">
              <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ask about ADHD..." className="flex-1 p-3 bg-gray-50 text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" />
              <button type="submit" className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-md hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Doctor;
