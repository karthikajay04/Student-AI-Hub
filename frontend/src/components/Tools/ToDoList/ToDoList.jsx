import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useAuth } from "@/store/auth";
import { API_BASE_URL } from "../../../api";

// --- SVG Icons ---
const HighlightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const AddIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// --- Internal Components ---

function Header() {
  return (
    <header className="py-4 px-8 mb-24 flex items-center justify-start mx-[-1rem] pl-8">
      <h1 className="text-3xl font-light text-cyan-400 flex items-center gap-2 font-['McLaren',_cursive]">
        <HighlightIcon />
        To Do List
      </h1>
    </header>
  );
}

function Footer() {
  return (
    <footer className="absolute bottom-0 left-0 right-0 h-10 flex items-center justify-center">
      <p className="text-gray-400 text-sm">
        © {new Date().getFullYear()} Keeper App
      </p>
    </footer>
  );
}

function Note(props) {
  function handleClick() {
    props.onDelete(props.id);
  }

  return (
    <div className="relative bg-white rounded-lg shadow-[0_2px_5px_#ccc] p-4 w-64 m-4 text-black">
      <h1 className="text-lg font-bold mb-2 break-words">{props.title}</h1>
      <p className="text-base mb-12 whitespace-pre-wrap break-words">{props.content}</p>

      <button
        onClick={handleClick}
        className="absolute bottom-3 right-3 text-[#f5ba13] hover:bg-[#f5ba13] hover:text-white w-9 h-9 flex items-center justify-center rounded-full cursor-pointer outline-none transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <DeleteIcon />
      </button>
    </div>
  );
}

function CreateArea(props) {
  const [isExpanded, setExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [note, setNote] = useState({
    title: "",
    content: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  }

  function submitNote(event) {
    event.preventDefault();
    if (note.content.trim() === "") {
      return;
    }
    props.onAdd(note);
    setNote({
      title: "",
      content: "",
    });
    setExpanded(false);
  }

  // --- AI Generation Handler ---
  async function handleGenerateContent(event) {
    event.preventDefault();
    const prompt = note.content || note.title;
    if (!prompt.trim()) {
      return;
    }

    setIsGenerating(true);
    const systemPrompt = "You are a task breakdown assistant. The user will provide a task, title, or idea. Break it down into a concise, actionable to-do list. Use simple bullet points (e.g., '- Item 1') for the list. Do not add any introductory or concluding text, just the list.";

    try {
      const response = await fetch(`${API_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          systemPrompt: systemPrompt,
          service: 'llama'
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const generatedText = data.text;

      setNote(prevNote => ({
        ...prevNote,
        content: generatedText
      }));

    } catch (error) {
      console.error("Failed to generate task breakdown:", error);
    } finally {
      setIsGenerating(false);
    }
  }

  function expand() {
    setExpanded(true);
  }

  const inputStyles = "w-full border-none p-1 outline-none text-lg font-['Montserrat',_sans_serif] resize-none text-black placeholder-gray-500 bg-transparent";

  return (
    <div>
      <form
        onSubmit={submitNote}
        className="relative w-full max-w-lg mx-auto mt-20 mb-8 bg-white p-4 rounded-lg shadow-[0_1px_5px_rgb(138,137,137)]"
      >
        {isExpanded && (
          <input
            name="title"
            onChange={handleChange}
            value={note.title}
            placeholder="Title"
            className={`${inputStyles} mb-3`}
          />
        )}

        <textarea
          name="content"
          onClick={expand}
          onChange={handleChange}
          value={note.content}
          placeholder="Task to Add..."
          rows={isExpanded ? 3 : 1}
          className={inputStyles}
        />

        <button
          type="button"
          onClick={handleGenerateContent}
          className={`absolute right-16 -bottom-5 bg-cyan-400 text-black border-none rounded-full w-9 h-9 shadow-lg cursor-pointer outline-none
                      flex items-center justify-center transition-all duration-300 transform
                      ${isExpanded ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
          disabled={isGenerating || !isExpanded}
        >
          {isGenerating ? <SpinnerIcon /> : <span className="text-xl">✨</span>}
        </button>

        <button
          type="submit"
          className={`absolute right-5 -bottom-5 bg-[#f5ba13] text-white border-none rounded-full w-9 h-9 shadow-lg cursor-pointer outline-none
                      flex items-center justify-center transition-all duration-300 transform
                      ${isExpanded ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
          disabled={isGenerating || !isExpanded}
        >
          <AddIcon />
        </button>
      </form>
    </div>
  );
}


// --- Main Exportable Component ---

function ToDoList() {
  const [notes, setNotes] = useState([]);
  const token = useAuth((s) => s.token);

  // 1. Fetch notes on load from DB
  useEffect(() => {
    async function loadNotes() {
      // Optional: Check if token exists before calling
      if (!token) return;

      try {
        const res = await axios.get(`${API_BASE_URL}/api/notes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotes(res.data);
      } catch (err) {
        console.error("Error fetching notes:", err);
      }
    }
    loadNotes();
  }, [token]);

  // 2. Add Note to DB
  async function addNote(newNote) {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/notes`,
        newNote,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Use the response data (which includes the new DB ID)
      setNotes((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error("Error adding note:", err);
    }
  }

  // 3. Delete Note from DB
  async function deleteNote(id) {
    try {
      await axios.delete(`${API_BASE_URL}/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filter using the DB ID
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  }

  return (
    <div className="relative w-full min-h-screen bg-black bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] text-white font-['Montserrat',_sans_serif] px-4 pb-16">
      <Header />
      <CreateArea onAdd={addNote} />
      <div className="flex flex-wrap justify-center py-4">
        {notes.map((noteItem) => (
          <Note
            // Use the actual Database ID here, not the index
            key={noteItem.id}
            id={noteItem.id}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
          />
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default ToDoList;