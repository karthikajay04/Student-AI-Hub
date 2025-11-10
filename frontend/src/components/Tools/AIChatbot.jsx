import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GradientText from '../AnimatedText/GradientText';

// --- NEW IMPORTS ---
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FiCopy } from 'react-icons/fi'; // Copy Icon
import { LuTrash2 } from 'react-icons/lu'; // Better Trash Icon
import { IoSend } from 'react-icons/io5'; // Better Send Icon

// --- ICONS ---
const SendIcon = () => <IoSend className="w-5 h-5" />;
const TrashIcon = () => <LuTrash2 className="w-5 h-5" />;
const CopyIcon = () => <FiCopy className="w-4 h-4" />;

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

// --- NEW: Chat Message Component (Handles Copy Button & Markdown) ---
const ChatMessage = ({ message }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    // Use clipboard API to copy text
    navigator.clipboard.writeText(message.text).then(() => {
      setIsCopied(true);
      // Reset "Copied!" text after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${
        message.sender === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* ** THIS IS THE FIX **
          The 'prose' classes are moved to this parent div
          to fix the react-markdown error.
      */}
      <div
        className={`relative max-w-xs lg:max-w-2xl px-4 py-3 rounded-2xl group ${
          message.sender === 'user'
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
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
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

// --- NEW: Pulsing Dots Loading Indicator ---
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
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- ADDED: Welcome Message ---
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

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

    // --- UPDATED SYSTEM PROMPT ---
    const systemPrompt =
      'You are a helpful chatbot. Be concise and friendly. Format code snippets using markdown code blocks.';

    try {
      const response = await fetch('http://localhost:5001/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userMessage,
          systemPrompt: systemPrompt,
          service: 'openrouter', // This selects the Llama,openrouter service in your backend
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
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col h-full">
        <header className="p-4 border-b border-gray-800 flex justify-between items-center bg-black/50 backdrop-blur-sm">
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
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
            {/* Use the new ChatMessage component */}
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
          </AnimatePresence>

          {/* Use the new LoadingIndicator component */}
          {isLoading && <LoadingIndicator />}

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
                         focus:outline-none focus:ring-2 focus:ring-yellow-500
                         transition-all"
              disabled={isLoading}
            />
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