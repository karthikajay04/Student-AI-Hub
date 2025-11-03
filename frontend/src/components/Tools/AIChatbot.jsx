import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GradientText from '../AnimatedText/GradientText';

// --- SVG Icons (for a cleaner UI) ---

// Send Icon
const SendIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    height="1em"
    width="1em"
    className="w-5 h-5"
  >
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

// Trash Icon (for Clear Chat)
const TrashIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    height="1em"
    width="1em"
    className="w-5 h-5"
  >
    <path
      fillRule="evenodd"
      d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.006a.75.75 0 01-.749.658H5.756a.75.75 0 01-.749-.658L4 6.714l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.816 1.387 2.816 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.347-9zm5.399 0a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.347-9z"
      clipRule="evenodd"
    />
  </svg>
);

// --- Animated Background Component ---
// Creates subtle pulsing dots for an "animated black bg"
const AnimatedBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden">
    {/* Create a grid of dots */}
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-gray-900 rounded-full"
        style={{
          width: Math.random() * 3 + 1,
          height: Math.random() * 3 + 1,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          duration: Math.random() * 5 + 5, // Slower, random pulse
          repeat: Infinity,
          delay: Math.random() * 5,
        }}
      />
    ))}
  </div>
);

// --- Main Chatbot Component ---
export default function AiChatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle user message submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const userMessage = input.trim();
    if (!userMessage) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: userMessage, sender: 'user' },
    ]);

    // Clear input
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      // Simple logic for bot response
      let botText = 'This is a simulated response.';
      if (userMessage.toLowerCase().includes('hello')) {
        botText = 'Hi there! How can I help you today?';
      } else if (userMessage.toLowerCase().includes('react')) {
        botText = 'React is a great library for building user interfaces!';
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: botText, sender: 'bot' },
      ]);
    }, 1000); // 1-second delay
  };

  // Handle clearing the chat
  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Main Content (relative to bg) */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <header className="p-4 border-b border-gray-800 flex justify-between items-center bg-black/50 backdrop-blur-sm">
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
            <GradientText
  colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
  animationSpeed={3}
  showBorder={false}
  className="custom-class"
>
  <b>AI Chatbot</b>
</GradientText>

          </h1>
          <button
            onClick={clearChat}
            className="p-2 text-gray-400 rounded-lg hover:text-red-500 hover:bg-gray-800 transition-colors"
            title="Clear Chat"
          >
            <TrashIcon />
          </button>
        </header>

        {/* Chat Messages */}
        <div className="flex-grow p-4 space-y-4 overflow-y-auto">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 rounded-br-lg' // Blue accent
                      : 'bg-gray-800 rounded-bl-lg'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black/50 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow px-4 py-3 bg-gray-800 text-white rounded-full
                         border border-transparent
                         focus:outline-none focus:ring-2 focus:ring-yellow-500 // Yellow accent
                         transition-all"
            />
            <button
              type="submit"
              className="flex-shrink-0 w-12 h-12 flex items-center justify-center
                         bg-green-600 text-white rounded-full // Green accent
                         hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400
                         transition-colors disabled:opacity-50"
              disabled={!input.trim()}
            >
              <SendIcon />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}