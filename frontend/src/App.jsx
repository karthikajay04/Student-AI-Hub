import "./App.css";

import { BackgroundLinesDemo } from "./components/BackgroundLinesDemo";
import ChromaGrid from "./components/ChromaGrid/ChromaGrid";
import { FloatingNavDemo } from "./components/FloatingNavDemo";
import { WobbleCardDemo } from "./components/WobbleCardDemo";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import CodeGenerator from "./components/Tools/CodeGenarator";
import Debugger from "./components/Tools/Debugger";
import VideoSummarizer from "./components/Tools/VideoSummarizer";
import TextSummarizer from "./components/Tools/TextSummarizer";
import AIChatbot from "./components/Tools/AIChatbot";
import Timmer from "./components/Tools/StudentTimer";
import ResumeAnalyzer from "./components/Tools/ResumeAnalyzer";
import RoadmapDeveloper from "./components/Tools/RoadmapDeveloper";
import ContactPage from "./components/ContactPage";
import ToDoList from "./components/Tools/ToDoList/ToDoList";

import { Login } from "./components/login/login";
import ProtectedRoute from "./components/ProtectedRoute";

import { useAuth } from "@/store/auth";

function App() {
  const isLogin = useAuth((s) => s.isLogin);

  const router = createBrowserRouter([
    // =========================================
    // PUBLIC ROUTES
    // =========================================
    {
      path: "/",
      element: (
        <>
          {isLogin && <FloatingNavDemo />}
          <BackgroundLinesDemo />
        </>
      ),
    },

    {
      path: "/login",
      element: <Login />,
    },

    {
      path: "/about",
      element: (
        <>
          {isLogin && <FloatingNavDemo />}
          <WobbleCardDemo />
        </>
      ),
    },

    {
      path: "/contact",
      element: (
        <>
          {isLogin && <FloatingNavDemo />}
          <ContactPage />
        </>
      ),
    },

    // =========================================
    // PROTECTED ROUTES (LOGIN REQUIRED)
    // =========================================
    {
      path: "/tools",
      element: (
        <ProtectedRoute>
          <>
            <FloatingNavDemo />
            <div className="bg-black pt-30 pb-10">
              <ChromaGrid />
            </div>
          </>
        </ProtectedRoute>
      ),
    },

    {
      path: "/tools/codegenerator",
      element: (
        <ProtectedRoute>
          <>
            <FloatingNavDemo />
            <CodeGenerator />
          </>
        </ProtectedRoute>
      ),
    },

    {
      path: "/tools/codedebugger",
      element: (
        <ProtectedRoute>
          <>
            <FloatingNavDemo />
            <Debugger />
          </>
        </ProtectedRoute>
      ),
    },

    {
      path: "/tools/videosummarizer",
      element: (
        <ProtectedRoute>
          <>
            <FloatingNavDemo />
            <VideoSummarizer />
          </>
        </ProtectedRoute>
      ),
    },

    {
      path: "/tools/textsummarizer",
      element: (
        <ProtectedRoute>
          <>
            <FloatingNavDemo />
            <TextSummarizer />
          </>
        </ProtectedRoute>
      ),
    },

    {
      path: "/tools/aichatbot",
      element: (
        <ProtectedRoute>
          <>
            <FloatingNavDemo />
            <AIChatbot />
          </>
        </ProtectedRoute>
      ),
    },

    {
      path: "/tools/timer",
      element: (
        <ProtectedRoute>
          <>
            <FloatingNavDemo />
            <Timmer />
          </>
        </ProtectedRoute>
      ),
    },

    {
      path: "/tools/resumeanalyzer",
      element: (
        <ProtectedRoute>
          <>
            <FloatingNavDemo />
            <ResumeAnalyzer />
          </>
        </ProtectedRoute>
      ),
    },

    {
      path: "/tools/roadmapdeveloper",
      element: (
        <ProtectedRoute>
          <>
            <FloatingNavDemo />
            <RoadmapDeveloper />
          </>
        </ProtectedRoute>
      ),
    },

    {
      path: "/tools/todolist",
      element: (
        <ProtectedRoute>
          <>
            <FloatingNavDemo />
            <ToDoList />
          </>
        </ProtectedRoute>
      ),
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
