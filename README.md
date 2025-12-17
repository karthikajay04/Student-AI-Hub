# Student AI Hub 🎓

Student AI Hub is a comprehensive platform designed to empower students with AI-driven tools to enhance productivity, learning, and skill development. From generating study roadmaps to summarizing videos and debugging code, this application serves as a personal AI tutor and assistant.

**Deployed Link:** [https://frontend-k5qm.onrender.com/](https://frontend-k5qm.onrender.com/)

---

## 🚀 Features

The platform offers a suite of powerful tools:

*   **🤖 AI Chatbot:** An everyday assistant for queries and explanations.
*   **🗺️ Roadmap Developer:** Generates personalized learning paths for any skill or technology.
*   **📹 Video Summarizer:** Get concise summaries of YouTube educational videos.
*   **📄 Text Summarizer:** Quickly understand long articles or notes.
*   **💻 Code Generator:** Generate code snippets for various languages and frameworks.
*   **🐛 Code Debugger:** Identify and fix errors in your code.
*   **📄 Resume Analyzer:** Optimize resumes for better job prospects.
*   **✅ To-Do List:** Manage tasks and stay organized.
*   **⏱️ Student Timer:** Focus timer for effective study sessions.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework:** React (Vite)
*   **Styling:** Tailwind CSS, Framer Motion, Aceternity UI, Material UI
*   **State Management:** Zustand
*   **Routing:** React Router DOM
*   **HTTP Client:** Axios

### Backend
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** PostgreSQL
*   **Authentication:** JWT, Bcrypt
*   **AI Services:**
    *   OpenAI API
    *   Google Gemini
    *   Cerebras Cloud SDK
    *   Ollama
    *   OpenRouter
*   **Other Tools:** Puppeteer, Youtube Transcript API, Nodemailer

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### Prerequisites
*   Node.js (v16+)
*   PostgreSQL installed and running

### 1. Clone the Repository
```bash
git clone <repository-url>
cd student-ai-hub
```

### 2. Backend Setup
Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/student_ai_hub
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
CEREBRAS_API_KEY=your_cerebras_key
OPENROUTER_API_KEY=your_openrouter_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```
*(Note: Adjust the keys based on the services you intend to use)*

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Navigate to the frontend directory:
```bash
cd ../frontend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the `frontend` directory (if needed):
```env
VITE_API_URL=http://localhost:3000
```

Start the development server:
```bash
npm run dev
```

---

## 🤝 Contributing
Contributions are welcome! Please fork the repository and create a pull request.
