import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api";

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/contact`, // backend endpoint
        form
      );

      if (res.data.success) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.log(err);
      setStatus("error");
    }
  };

  // Custom animation injection
  const CustomAnimations = () => (
    <style>{`
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes shine {
        0% { background-position: 200% center; }
        100% { background-position: -200% center; }
      }

      .animate-fade-in-up {
        animation: fadeInUp 0.8s ease-out forwards;
      }
      
      .animate-shine {
        animation: shine 2s linear infinite;
      }
    `}</style>
  );

  return (
    <div className="bg-black text-white min-h-screen w-full">
      <CustomAnimations />

      <div className="pt-30 pb-12 animate-fade-in-up">
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-3xl p-8 md:p-12 shadow-xl">
          {/* Header */}
          <div className="text-center mb-12">
            <span
              className="inline-flex items-center
              bg-gradient-to-r from-purple-900/50 via-purple-700/50 to-purple-900/50 
              bg-[length:200%_auto] 
              text-purple-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4
              animate-shine"
            >
              + Need Any Help?
            </span>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Contact With Us
            </h1>

            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              AI Hub unifies advanced AI tools that simplify coding, automate
              workflows, and enhance creativity — making your development
              process seamless and efficient.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your Name"
                  className="w-full px-4 py-3 bg-slate-800 rounded-lg border border-slate-700 text-white 
                    placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 
                    hover:border-purple-500 transition-all duration-300"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your Email"
                  className="w-full px-4 py-3 bg-slate-800 rounded-lg border border-slate-700 text-white 
                    placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 
                    hover:border-purple-500 transition-all duration-300"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Message */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Message
              </label>
              <textarea
                name="message"
                rows="5"
                placeholder="Type your message"
                className="w-full px-4 py-3 bg-slate-800 rounded-lg border border-slate-700 
                  text-white placeholder-slate-500 focus:outline-none focus:ring-2
                  focus:ring-purple-500 hover:border-purple-500 transition-all duration-300"
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg 
                hover:bg-purple-700 hover:scale-105 transition-all duration-300 
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                focus:ring-offset-slate-900"
            >
              Send Message
            </button>
          </form>

          {/* Status Messages */}
          {status === "loading" && (
            <p className="text-blue-400 text-center mt-4">Sending...</p>
          )}
          {status === "success" && (
            <p className="text-green-400 text-center mt-4">
              Message sent successfully!
            </p>
          )}
          {status === "error" && (
            <p className="text-red-400 text-center mt-4">
              Something went wrong. Try again.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
