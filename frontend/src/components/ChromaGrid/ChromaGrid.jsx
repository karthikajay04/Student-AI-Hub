import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom"; // 👈 import navigate hook
import "./ChromaGrid.css";

export const ChromaGrid = ({
  items,
  className = "",
  radius = 300,
  columns = 3,
  rows = 2,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
}) => {
  const rootRef = useRef(null);
  const fadeRef = useRef(null);
  const setX = useRef(null);
  const setY = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const navigate = useNavigate(); // 👈 create navigate function

  const demo = [
    {
      image:
        "https://plus.unsplash.com/premium_photo-1725907643556-e987fab4b09d?auto=format&fit=crop&q=80&w=1170",
      title: "Code Generator",
      subtitle: "From prompts to production-ready snippets",
      handle: "API: Gemini",
      borderColor: "#4F46E5",
      gradient: "linear-gradient(145deg, #4F46E5, #000)",
      url: "/tools/codegenerator",
    },
    {
      image:
        "https://images.unsplash.com/photo-1564931768778-d9da47b54c68?auto=format&fit=crop&q=60&w=600",
      title: "Code Debugger",
      subtitle: "Spot issues and get fixes instantly",
      handle: "API: Gemini",
      borderColor: "#10B981",
      gradient: "linear-gradient(210deg, #10B981, #000)",
      url: "/tools/codedebugger",
    },
    {
      image:
        "https://images.unsplash.com/photo-1523365280197-f1783db9fe62?w=600&auto=format&fit=crop&q=60",
      title: "Video Summarizer",
      subtitle: "Digest lectures faster with summaries",
      handle: "API: Gemini",
      borderColor: "#F59E0B",
      gradient: "linear-gradient(165deg, #F59E0B, #000)",
      url: "/tools/videosummarizer",
    },
    {
      image:
        "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?auto=format&fit=crop&q=60&w=600",
      title: "Text Summarizer",
      subtitle: "Summarizes articles, PDFs and notes",
      handle: "API: Gemini",
      borderColor: "#EF4444",
      gradient: "linear-gradient(195deg, #EF4444, #000)",
      url: "/tools/textsummarizer",
    },
    {
      image:
        "https://plus.unsplash.com/premium_photo-1725907643556-e987fab4b09d?auto=format&fit=crop&q=80&w=1170",
      title: "AI Chatbot",
      subtitle: "Ask anything — get guidance in real time",
      handle: "API: Gemini",
      borderColor: "#8B5CF6",
      gradient: "linear-gradient(225deg, #8B5CF6, #000)",
      url: "/tools/aichatbot",
    },
    {
      image:
        "https://images.unsplash.com/photo-1456574808786-d2ba7a6aa654?auto=format&fit=crop&q=80&w=1044",
      title: "Timer",
      subtitle: "Pomodoro and session tracking for focus",
      handle: "API: Gemini",
      borderColor: "#06B6D4",
      gradient: "linear-gradient(135deg, #06B6D4, #000)",
      url: "/tools/timer",
    },
    {
      image:
        "https://plus.unsplash.com/premium_photo-1661779134041-9d618ec4c812?auto=format&fit=crop&q=60&w=600",
      title: "Resume Analyzer",
      subtitle: "ATS-friendly feedback and analyzer",
      handle: "API: Gemini",
      borderColor: "#14B8A6",
      gradient: "linear-gradient(135deg, #14B8A6, #000)",
      url: "/tools/resumeanalyzer",
    },
    {
      image:"https://media.licdn.com/dms/image/v2/D5612AQGjfCNSZ0mAtg/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1704079585014?e=2147483647&v=beta&t=VkHg1kmkag5WWndOKTB73ZfEGUDBaQVv3Q2asVAZR4k",
      title: "Roadmap Developer",
      subtitle: "Personalized learning paths",
      handle: "API: Gemini",
      borderColor: "#10B981",
      gradient: "linear-gradient(210deg, #10B981, #000)",
      url: "/tools/roadmapdeveloper",
    },
    {
      image:
        "https://images.unsplash.com/photo-1677506050626-90651f770d0a?w=600&auto=format&fit=crop&q=60",
      title: "To-Do List",
      subtitle: "Track your daily goals easily",
      handle: "API: Gemini",
      borderColor: "#F59E0B",
      gradient: "linear-gradient(165deg, #F59E0B, #000)",
      url: "/tools/todolist",
    },
  ];

  const data = items?.length ? items : demo;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, "--x", "px");
    setY.current = gsap.quickSetter(el, "--y", "px");
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x, y) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (e) => {
    const r = rootRef.current.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true,
    });
  };

  const handleCardClick = (url) => {
    if (url) navigate(url); // 👈 navigate to route
  };

  const handleCardMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={{
        "--r": `${radius}px`,
        "--cols": columns,
        "--rows": rows,
      }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {data.map((c, i) => (
        <article
          key={i}
          className="chroma-card"
          onMouseMove={handleCardMove}
          onClick={() => handleCardClick(c.url)}
          style={{
            "--card-border": c.borderColor || "transparent",
            "--card-gradient": c.gradient,
            cursor: c.url ? "pointer" : "default",
          }}
        >
          <div className="chroma-img-wrapper">
            <img src={c.image} alt={c.title} loading="lazy" />
          </div>
          <footer className="chroma-info">
            <h3 className="name">{c.title}</h3>
            {c.handle && <span className="handle">{c.handle}</span>}
            <p className="role">{c.subtitle}</p>
          </footer>
        </article>
      ))}
      <div className="chroma-overlay" />
      <div ref={fadeRef} className="chroma-fade" />
    </div>
  );
};

export default ChromaGrid;
