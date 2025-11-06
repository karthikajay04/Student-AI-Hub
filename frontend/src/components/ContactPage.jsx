import React from 'react';

// You might want to import an icon for the "Need Any Help?" badge
// For example, using react-icons: import { HiOutlineSparkles } from 'react-icons/hi';

const ContactPage = () => {

  /**
   * A simple component to inject custom keyframes and animations 
   * into the document's head without editing tailwind.config.js.
   */
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

      /* We create utility classes to apply these animations */
      .animate-fade-in-up {
        animation: fadeInUp 0.8s ease-out forwards;
      }
      
      .animate-shine {
        animation: shine 2s linear infinite;
      }
    `}</style>
  );

  return (
    
    // Main container with black background and min-height to fill the screen
    <div className="bg-black text-white min-h-screen w-full">
      
      {/* 1. Add the CustomAnimations component here */}
      <CustomAnimations />
      
      {/* 2. Apply the 'animate-fade-in-up' class to the main content container */}
      <div className="pt-30 pb-12 animate-fade-in-up">

        {/* Main content card */}
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-3xl p-8 md:p-12 shadow-xl">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            
            {/* 3. Apply shine effect to the badge */}
            <span className="inline-flex items-center
                            bg-gradient-to-r from-purple-900/50 via-purple-700/50 to-purple-900/50 
                            bg-[length:200%_auto] 
                            text-purple-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4
                            animate-shine"> {/* <-- Use the custom class */}
              {/* <HiOutlineSparkles className="mr-2" /> You could add an icon here */}
              + Need Any Help?
            </span>
            
            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Contact With Us
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
AI Hub unifies advanced AI tools that simplify coding, automate workflows, and enhance creativity — making your development process seamless and efficient.             </p>
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
                  // 4. Added hover and smooth transition
                  className="w-full px-4 py-3 bg-slate-800 rounded-lg border border-slate-700 text-white placeholder-slate-500 
                             focus:outline-none focus:ring-2 focus:ring-purple-500
                             hover:border-purple-500 
                             transition-all duration-300"
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
                  // 4. Added hover and smooth transition
                  className="w-full px-4 py-3 bg-slate-800 rounded-lg border border-slate-700 text-white placeholder-slate-500 
                             focus:outline-none focus:ring-2 focus:ring-purple-500
                             hover:border-purple-500
                             transition-all duration-300"
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
                // 4. Added hover and smooth transition
                className="w-full px-4 py-3 bg-slate-800 rounded-lg border border-slate-700 text-white placeholder-slate-500 
                           focus:outline-none focus:ring-2 focus:ring-purple-500
                           hover:border-purple-500
                           transition-all duration-300"
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                // 5. Added hover (scale, bg-color) and smooth transition
                className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg 
                           hover:bg-purple-700 hover:scale-105 
                           transition-all duration-300 
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900"
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