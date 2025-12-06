import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from "../../api";

// --- STUB for GradientText ---
// Assuming GradientText is in a relative path and works as intended
// If not, adjust this import
// import GradientText from '../AnimatedText/GradientText';

// Using a simple span for GradientText as the component is not provided
// This allows the file to be valid JSX
const GradientText = ({ children, ...props }) => (
  <span
    {...props}
    className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400"
  >
    {children}
  </span>
);
// --- END STUB ---

// --- MODIFIED IMPORTS ---
// Removed react-syntax-highlighter and react-icons
// We will use ReactMarkdown but without the highlighter
import ReactMarkdown from 'react-markdown';

// --- INLINE ICONS (Replaced react-icons) ---

// Replaced IoSend
const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

// Replaced LuTrash2
const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.578 0c-.27.004-.537.01-.804.018m0 0a48.108 48.108 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
    />
  </svg>
);

// Replaced FiCopy
const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876S5.25 2.25 5.25 6.75V15"
    />
  </svg>
);

// --- Animated Background Component ---
const AnimatedBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden">
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
          duration: Math.random() * 5 + 5,
          repeat: Infinity,
          delay: Math.random() * 5,
        }}
      />
    ))}
  </div>
);

// --- Chat Message Component (Handles Copy Button & Markdown) ---
const ChatMessage = ({ message }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    // Use clipboard API to copy text
    // Fallback for non-secure contexts (like http://localhost)
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message.text).then(
        () => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        },
        (err) => {
          console.error('Clipboard API failed:', err);
          // Try fallback if permission denied or other error
          copyFallback();
        }
      );
    } else {
      copyFallback();
    }
  };

  // Fallback for document.execCommand (e.g., http)
  const copyFallback = () => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = message.text;
      // Make it non-editable and invisible
      textArea.style.position = 'absolute';
      textArea.style.left = '-9999px';
      textArea.setAttribute('readonly', '');
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text with fallback:', err);
    }
  };

  return (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'
        }`}
    >
      <div
        className={`relative max-w-xs lg:max-w-2xl px-4 py-3 rounded-2xl group ${message.sender === 'user'
          ? 'bg-blue-600 rounded-br-lg'
          : 'bg-gray-800 rounded-bl-lg'
          } prose prose-sm prose-invert`}
      >
        {/* Copy Button for Bot Messages */}
        {message.sender === 'bot' && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-1.5 bg-gray-700 rounded-lg text-gray-300
                       opacity-0 group-hover:opacity-100 transition-opacity
                       hover:bg-gray-600 focus:outline-none"
            title="Copy text"
          >
            {isCopied ? (
              <span className="text-xs">Copied!</span>
            ) : (
              <CopyIcon />
            )}
          </button>
        )}

        {/* Markdown Renderer for Bot Responses */}
        {/* UPDATED: Removed SyntaxHighlighter, using simple <pre><code> for blocks */}
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              return !inline ? (
                <pre className="bg-gray-900 p-2 rounded-md overflow-x-auto">
                  <code {...props}>
                    {String(children).replace(/\n$/, '')}
                  </code>
                </pre>
              ) : (
                <code className="text-amber-400" {...props}>
                  {children}
                </code>
              );
            },
            p: ({ node, ...props }) => <p className="mb-0" {...props} />, // Fix extra margin
          }}
        >
          {message.text}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
};

// --- Pulsing Dots Loading Indicator ---
const LoadingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="flex justify-start"
  >
    <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl bg-gray-800 rounded-bl-lg">
      <div className="flex space-x-1.5">
        <motion.div
          className="w-2 h-2 bg-gray-400 rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="w-2 h-2 bg-gray-400 rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: 0.2,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="w-2 h-2 bg-gray-400 rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: 0.4,
            ease: 'easeInOut',
          }}
        />
      </div>
    </div>
  </motion.div>
);

// --- Main Chatbot Component ---
export default function AiChatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- NEW STATE FOR SERVICE SELECTION ---
  const [selectedService, setSelectedService] = useState('cerebras'); // Default service

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll on new message or loading change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // --- ADDED: Welcome Message on initial load ---
  useEffect(() => {
    setMessages([
      {
        id: Date.now(),
        text: "Hi! I'm an AI chatbot.",
        sender: 'bot',
      },
    ]);
  }, []); // Empty dependency array ensures this runs only once on mount

  // Handle user message submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = input.trim();
    if (!userMessage || isLoading) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: userMessage, sender: 'user' },
    ]);

    setInput('');
    setIsLoading(true);

    const systemPrompt =
      'You are a helpful chatbot. Be concise and friendly. Format code snippets using markdown code blocks.';

    try {
      const response = await fetch(`${API_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userMessage,
          systemPrompt: systemPrompt,
          // --- PASS THE SELECTED SERVICE FROM STATE ---
          service: selectedService,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const botText = data.text;

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: botText, sender: 'bot' },
      ]);
    } catch (error) {
      console.error('Failed to fetch response:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: 'Sorry, I ran into an error. Please try again.',
          sender: 'bot',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle clearing the chat
  const clearChat = () => {
    setMessages([
      // Reset to a clear state with a message
      {
        id: Date.now(),
        text: 'Chat cleared! How can I help you next?',
        sender: 'bot',
      },
    ]);
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col h-full">
        <header className="p-4 border-b border-gray-800 flex justify-between items-center bg-black/50 backdrop-blur-sm">
          <h1 className="text-xl font-bold">
            <GradientText
              colors={['#40ffaa', '#4079ff', '#40ffaa', '#4079ff', '#40ffaa']}
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
              <ChatMessage key={msg.id} message={msg} />
            ))}
          </AnimatePresence>

          {isLoading && <LoadingIndicator />}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black/50 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="flex items-center space-x-2"
          >
            {/* --- MODIFIED INPUT AND NEW SELECT GROUP --- */}
            <div
              className="flex-grow flex items-center bg-gray-800 rounded-full
                            border border-transparent
                            focus-within:ring-2 focus-within:ring-yellow-500
                            transition-all"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow px-4 py-3 bg-transparent text-white
                           rounded-l-full
                           focus:outline-none"
                disabled={isLoading}
              />
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                disabled={isLoading}
                className="bg-gray-800 text-gray-300 text-sm rounded-r-full
                           py-3 pl-2 pr-4
                           border-l border-gray-700
                           focus:outline-none cursor-pointer
                           hover:text-white"
                aria-label="Select AI Model"
              >
                <option value="cerebras">Cerebras</option>
                <option value="llama">Llama</option>
                <option value="deepseek">Deepseek (takes ~1 min)</option>
                <option value="openrouter">OpenRouter</option>
              </select>
            </div>
            {/* --- END OF MODIFIED GROUP --- */}

            <button
              type="submit"
              className="flex-shrink-0 w-12 h-12 flex items-center justify-center
                         bg-green-600 text-white rounded-full
                         hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400
                         transition-colors disabled:opacity-50"
              disabled={!input.trim() || isLoading}
            >
              <SendIcon />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}