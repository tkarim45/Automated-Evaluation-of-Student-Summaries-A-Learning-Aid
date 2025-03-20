import React, { useState } from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css"; // Base styles (we’ll override some)
import axios from "axios";

// Chatbot configuration
const config = {
  botName: "ADHD Assistant",
  initialMessages: [{ id: 1, message: "Ask me anything about ADHD!", type: "bot" }],
  customStyles: {
    botMessageBox: {
      backgroundColor: "#4a6cf7", // Bright blue for bot messages
    },
    chatButton: {
      backgroundColor: "#4a6cf7", // Bright blue for send button
    },
    userMessageBox: {
      backgroundColor: "#e3e8ee", // Light gray for user messages
    },
  },
};

// Message parser for handling user input
const MessageParser = ({ children, actions }) => {
  const parse = async (message) => {
    const response = await axios.post("http://localhost:8000/chatbot", { query: message });
    actions.handleMessage(response.data.response);
  };
  return <div>{React.cloneElement(children, { parse })}</div>;
};

// Action provider for bot responses
const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const handleMessage = (message) => {
    const botMessage = createChatBotMessage(message);
    setState((prev) => ({ ...prev, messages: [...prev.messages, botMessage] }));
  };
  return <div>{React.cloneElement(children, { actions: { handleMessage } })}</div>;
};

function ChatbotComponent() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Chat Icon */}
      <button onClick={toggleChatbot} className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m-7 4h8a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {/* Single Chatbot Container */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[350px] h-[450px] bg-white rounded-2xl shadow-2xl border border-gray-200 animate-fade-in flex flex-col">
          {/* Header */}
          <div className="bg-[#4a6cf7] text-white p-3 rounded-t-2xl flex justify-between items-center">
            <h3 className="text-lg font-semibold">ADHD Assistant</h3>
            <button onClick={toggleChatbot} className="text-white hover:text-gray-200 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chatbot Content */}
          <div className="flex-1 flex flex-col justify-end">
            <Chatbot
              config={config}
              messageParser={MessageParser}
              actionProvider={ActionProvider}
              placeholderText="Type your question..."
              headerText={null} // Remove default header
            />
          </div>

          {/* Custom CSS */}
          <style jsx>{`
            /* Remove nested box effect and align content to bottom */
            .react-chatbot-kit-chat-container {
              width: 100%;
              height: 100%;
              border: none;
              background: transparent;
              border-radius: 0 0 12px 12px;
            }
            .react-chatbot-kit-chat-inner-container {
              width: 100%;
              height: 100%;
              background: #f9fafb; /* Light gray background for messages */
              border: none;
              border-radius: 0 0 12px 12px;
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
            }
            .react-chatbot-kit-chat-message-container {
              padding: 12px;
              background: transparent;
              flex-grow: 0; /* Prevent it from taking all space */
              max-height: calc(100% - 60px); /* Adjust for input area */
              overflow-y: auto;
            }
            .react-chatbot-kit-chat-bot-message {
              background: #4a6cf7;
              color: white;
              border-radius: 16px 16px 16px 4px; /* Bot speech bubble */
              margin: 8px 0;
              padding: 10px 14px;
              max-width: 75%;
            }
            .react-chatbot-kit-user-chat-message {
              background: #e3e8ee;
              color: #1f2937;
              border-radius: 16px 16px 4px 16px; /* User speech bubble */
              margin: 8px 0;
              padding: 10px 14px;
              max-width: 75%;
            }
            .react-chatbot-kit-chat-input-container {
              padding: 12px;
              background: white;
              border-top: 1px solid #e5e7eb;
            }
            .react-chatbot-kit-chat-input {
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 8px 12px;
              font-size: 14px;
              width: 100%;
              background: white;
            }
            .react-chatbot-kit-chat-input:focus {
              outline: none;
              border-color: #4a6cf7;
              box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.2);
            }
            .react-chatbot-kit-chat-btn-send {
              background: #4a6cf7;
              border-radius: 8px;
              padding: 6px 12px;
            }
            .react-chatbot-kit-chat-btn-send:hover {
              background: #3b5cd9;
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

export default ChatbotComponent;
