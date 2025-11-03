import React from 'react';

// You might want to import an icon for the "Need Any Help?" badge
// For example, using react-icons: import { HiOutlineSparkles } from 'react-icons/hi';

const ContactPage = () => {
  return (
    
    // Main container with black background and min-height to fill the screen
    <div className="bg-black text-white min-h-screen w-full">
      
      {/* This container provides the top padding to leave space for a navbar */}
      <div className=" pt-30 pb-12">

        {/* Main content card */}
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-3xl p-8 md:p-12 shadow-xl">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            {/* "Need Any Help?" Badge */}
            <span className="inline-flex items-center bg-purple-900/50 text-purple-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              {/* <HiOutlineSparkles className="mr-2" /> You could add an icon here */}
              + Need Any Help?
            </span>
            
            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Contact With Us
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
AI Hub unifies advanced AI tools that simplify coding, automate workflows, and enhance creativity — making your development process seamless and efficient.            </p>
          </div>

          {/* Form Section */}
          <form action="#" method="POST">
            {/* Form Grid (Name & Email) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your Name"
                  className="w-full px-4 py-3 bg-slate-800 rounded-lg border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  required
                />
              </div>
              
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your Email"
                  className="w-full px-4 py-3 bg-slate-800 rounded-lg border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Message Field */}
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Type your message"
                className="w-full px-4 py-3 bg-slate-800 rounded-lg border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Send Message
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;