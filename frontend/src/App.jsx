import { useRef } from "react";
import "./App.css";
import { BackgroundLinesDemo } from "./components/BackgroundLinesDemo";
import ChromaGrid from "./components/ChromaGrid/ChromaGrid";
import { FloatingNavDemo } from "./components/FloatingNavDemo";
import { WobbleCardDemo } from './components/WobbleCardDemo' ;

import {createBrowserRouter ,RouterProvider} from 'react-router-dom';
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






function App() {

  


const router= createBrowserRouter([
  {path:"/",
    element:<><FloatingNavDemo /> <BackgroundLinesDemo /></>
  },
  {
    path:"/tools",
    element:<><FloatingNavDemo  /><div  className="bg-black pt-30 pb-10">
        <ChromaGrid />
      </div></>
  },
  {
    path:"/about",
    element:<><FloatingNavDemo /><WobbleCardDemo/></>
  },
  {
    path:"/contact",
    element:<><FloatingNavDemo />  <ContactPage/></>
  },
  {
    path:"/tools/codegenerator",
    element:<><FloatingNavDemo /><CodeGenerator/></>
  },
  {
    path:"/tools/codedebugger",
    element:<><FloatingNavDemo /><Debugger/></>
  },
  {
    path:"/tools/videosummarizer",
    element:<><FloatingNavDemo /> <VideoSummarizer/></>
  },
  {
    path:"/tools/textsummarizer",
    element:<><FloatingNavDemo /> <TextSummarizer/></>
  },
  {
    path:"/tools/aichatbot",
    element:<><FloatingNavDemo /> <AIChatbot/></>
  },
  {
    path:"/tools/timer",
    element:<><FloatingNavDemo /><Timmer/></>
  },
  {
    path:"/tools/resumeanalyzer",
    element:<><FloatingNavDemo /><ResumeAnalyzer/></>
  },
  {
    path:"/tools/roadmapdeveloper",
    element:<><FloatingNavDemo /><RoadmapDeveloper/></>
  },
  {
    path:"/tools/todolist",
    element:<><FloatingNavDemo /><ToDoList/></>
  },
])

  

  return (
    <>
      <RouterProvider router={router}/>

      {/* Hero / First Section */}
      

      {/* Tools / ChromaGrid Section */}
      
    </>
  );
}

export default App;
