import React, { useState } from 'react';

// --- SVG Icons ---
// These are defined locally so they don't need to be imported.

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


// --- Gemini API Call Functions ---

async function fetchWithRetry(url, options, retries = 3, delay = 1000) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        console.error(`Client error: ${response.status}. Not retrying.`);
        throw new Error(`Client error: ${response.status}`);
      }
      if (retries > 0) {
        console.warn(`Retrying... (${retries} retries left). Status: ${response.status}`);
        await new Promise(res => setTimeout(res, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 2);
      } else {
        throw new Error(`Failed after retries: ${response.status}`);
      }
    }
    
    return response.json();
  } catch (error) {
    if (retries > 0) {
      console.warn(`Retrying... (${retries} retries left). Error: ${error.message}`);
      await new Promise(res => setTimeout(res, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    } else {
      console.error("Failed after all retries.", error);
      throw error;
    }
  }
}

async function callGeminiAPI(userQuery, systemPrompt) {
  const apiKey = ""; // API key will be provided by the environment
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
  };

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  };

  try {
    const result = await fetchWithRetry(apiUrl, options);
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (text) {
      return text;
    } else {
      console.error("No content found in Gemini response:", result);
      throw new Error("No content found in Gemini response.");
    }
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error(`Gemini API call failed: ${error.message}`);
  }
}


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

  async function handleGenerateContent(event) {
    event.preventDefault();
    const prompt = note.content || note.title;
    if (!prompt.trim()) {
      return;
    }

    setIsGenerating(true);
    
    const systemPrompt = "You are a task breakdown assistant. The user will provide a task, title, or idea. Break it down into a concise, actionable to-do list. Use simple bullet points (e.g., '- Item 1') for the list. Do not add any introductory or concluding text, just the list.";

    try {
  // 1. Define the service you want to use
  // const serviceToUse = 'gemini';
  
  
  const response = await axios.post('/api/generate', {
    prompt: userPrompt,         // "My code is broken"
    systemPrompt: systemPrompt, // "You are a code debugger..."
    service: 'gemini'           // The selected service
  });

  // 3. Get the text from your backend's standardized response
  const generatedText = response.data.text; 

  // 4. Update your React state (this logic is the same as yours)
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

  const inputStyles = "w-full border-none p-1 outline-none text-lg font-['Montserrat',_sans-serif] resize-none text-black placeholder-gray-500 bg-transparent";

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

/**
 * A self-contained To-Do List application component
 * powered by the Gemini API for task breakdown.
 */
function ToDoList() {
  const [notes, setNotes] = useState([]);

  function addNote(newNote) {
    setNotes((prevNotes) => [...prevNotes, newNote]);
  }

  function deleteNote(id) {
    setNotes((prevNotes) => prevNotes.filter((_, index) => index !== id));
  }

  return (
    // Changed back to `min-h-screen` for full-screen display.
    // Removed `h-full` and `overflow-y-auto`.
    <div className="relative w-full min-h-screen bg-black bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] text-white font-['Montserrat',_sans_serif] px-4 pb-16">
      <Header />
      <CreateArea onAdd={addNote} />
      <div className="flex flex-wrap justify-center py-4">
        {notes.map((noteItem, index) => (
          <Note
            key={index}
            id={index}
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

