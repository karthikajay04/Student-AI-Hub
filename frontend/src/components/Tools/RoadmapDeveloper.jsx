import React, { useState } from "react";

// --- Initial Data ---
// ... existing code ...
const initialData = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    expanded: false,
    notes: "Remember to focus on 'this' keyword and closures.",
    subTasks: [
      { id: 101, text: "Learn variables and data types", done: true },
      { id: 102, text: "Understand functions and scope", done: true },
      { id: 103, text: "Explore loops and conditionals", done: false },
      { id: 104, text: "Practice with Array methods", done: false },
    ],
  },
  {
    id: 2,
    title: "React Basics",
    expanded: false,
    notes: "JSX is weird but powerful. Props flow down.",
    subTasks: [
      { id: 201, text: "What is JSX?", done: false },
      { id: 202, text: "Create a functional component", done: false },
      { id: 203, text: "Learn about props", done: false },
    ],
  },
];

// --- Main App Component ---
export default function RoadmapApp() {
  const [studyItems, setStudyItems] = useState(initialData);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [modalState, setModalState] = useState({
    isOpen: false,
    itemToDelete: null,
  });
  // --- State for AI generation loading ---
  const [isGenerating, setIsGenerating] = useState(null); // Will store the ID of the item being generated
  // --- NEW: Error state for user feedback ---
  const [errorMessage, setErrorMessage] = useState(null);
  // --- REMOVED: State for model selection ---
  // const [selectedService, setSelectedService] = useState("openrouter");

  // --- Main Item Handlers ---
  const addMainItem = () => {
// ... existing code ...
    if (!newItemTitle.trim()) return;
    const newItem = {
      id: Date.now(),
      title: newItemTitle,
      expanded: false,
      notes: "", // Add notes field to new items
      subTasks: [],
    };
    setStudyItems([...studyItems, newItem]);
    setNewItemTitle("");
  };

  const requestDeleteMainItem = (id) => {
// ... existing code ...
    setModalState({ isOpen: true, itemToDelete: id });
  };

  const executeDeleteMainItem = () => {
// ... existing code ...
    if (modalState.itemToDelete) {
      setStudyItems(
        studyItems.filter((item) => item.id !== modalState.itemToDelete)
      );
    }
    // Close modal
    setModalState({ isOpen: false, itemToDelete: null });
  };

  const cancelDeleteMainItem = () => {
// ... existing code ...
    setModalState({ isOpen: false, itemToDelete: null });
  };

  const toggleExpand = (id) => {
// ... existing code ...
    setStudyItems(
      studyItems.map((item) =>
        item.id === id ? { ...item, expanded: !item.expanded } : item
      )
    );
  };

  // --- Sub-Task & Notes Handlers (passed down) ---
  const addSubTask = (mainId, text) => {
// ... existing code ...
    if (!text.trim()) return;
    const newSubTask = { id: Date.now(), text, done: false };

    setStudyItems(
      studyItems.map((item) =>
        item.id === mainId
          ? { ...item, subTasks: [...item.subTasks, newSubTask] }
          : item
      )
    );
  };

  const toggleSubTask = (mainId, subTaskId) => {
// ... existing code ...
    setStudyItems(
      studyItems.map((item) =>
        item.id === mainId
          ? {
              ...item,
              subTasks: item.subTasks.map((task) =>
                task.id === subTaskId ? { ...task, done: !task.done } : task
              ),
            }
          : item
      )
    );
  };

  const deleteSubTask = (mainId, subTaskId) => {
// ... existing code ...
    setStudyItems(
      studyItems.map((item) =>
        item.id === mainId
          ? {
              ...item,
              subTasks: item.subTasks.filter((task) => task.id !== subTaskId),
            }
          : item
      )
    );
  };

  const updateNotes = (mainId, text) => {
// ... existing code ...
    setStudyItems(
      studyItems.map((item) =>
        item.id === mainId ? { ...item, notes: text } : item
      )
    );
  };

  // --- MODIFIED: AI Content Generation Handler ---
  const handleGenerateContent = async (id, title, service) => {
    // --- MODIFIED SIGNATURE ---
    setIsGenerating(id); // Set loading state for this specific item
    setErrorMessage(null); // --- NEW: Clear previous errors ---

    // --- 1. Update URL to match your api.routes.js AND index.js ---
    const yourBackendUrl = "http://localhost:5001/api/generate"; // ---

    // --- 2. Create payload matching your ai.controller.js ---
// ... existing code ...
    const systemPrompt = `You are an expert curriculum designer. Given a topic, you must generate a list of sub-tasks and some helpful notes.
Respond *only* with a single, valid JSON object. Do not include any other text or markdown.
The JSON object must have two keys:
1. "tasks": an array of 3-5 strings, where each string is an actionable sub-task.
2. "notes": a single string containing a concise, helpful note about the topic.

Example response:
{
  "tasks": ["Task 1", "Task 2", "Task 3"],
  "notes": "This is a helpful note."
}`;

    const payload = {
      prompt: title,
      systemPrompt: systemPrompt,
      service: service, // --- UPDATED: Use service passed from card ---
    };

    try {
// ... existing code ...
      const response = await fetch(yourBackendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // Send the full payload
      });

      if (!response.ok) {
// ... existing code ...
        // --- NEW: Handle backend errors more explicitly ---
        const errorData = await response.json().catch(() => null); // Try to parse error
        const errorMsg =
          errorData?.error ||
          `Backend Error: ${response.status} ${response.statusText}`;
        throw new Error(errorMsg);
      }

      // --- 3. Update response parsing logic ---
// ... existing code ...
      // Your backend returns { text: "...", source: "..." }
      // The "text" field contains the JSON string we asked for.
      const result = await response.json();

      if (!result.text) {
// ... existing code ...
        throw new Error(
          "Invalid response structure from backend. 'text' field is missing."
        );
      }

      // --- NEW ROBUST PARSING LOGIC ---
// ... existing code ...
      const rawText = result.text;
      console.log("Raw AI Response Text:", rawText); // For debugging

      // Try to find a JSON object within the text
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
// ... existing code ...
        throw new Error(
          "No JSON object found in AI response. Response was: " + rawText
        );
      }

      let generated;
      try {
// ... existing code ...
        // Parse the extracted JSON string
        generated = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
// ... existing code ...
        throw new Error(
          "Failed to parse JSON from AI response. " + parseError.message
        );
      }
      // --- END OF NEW LOGIC ---

      if (generated.tasks || generated.notes) {
// ... existing code ...
        setStudyItems((prevItems) =>
          prevItems.map((item) => {
            if (item.id === id) {
              // Create new task objects from the generated strings
              const newTasks = (generated.tasks || []).map(
                (taskText, index) => ({
                  id: Date.now() + index, // Simple unique ID
                  text: taskText,
                  done: false,
                })
              );

              // Append new notes to existing notes
// ... existing code ...
              const newNotes = generated.notes || "";
              const combinedNotes = item.notes
                ? `${item.notes}\n\n--- AI Notes ---\n${newNotes}`
                : `--- AI Notes ---\n${newNotes}`;

              return {
// ... existing code ...
                ...item,
                subTasks: [...item.subTasks, ...newTasks],
                notes: combinedNotes,
                expanded: true, // Auto-expand the card to show new content
              };
            }
            return item;
          })
        );
      } else {
// ... existing code ...
        throw new Error("Invalid JSON structure from AI.");
      }
    } catch (error) {
// ... existing code ...
      console.error("Error generating content:", error);
      // --- NEW: Show error to the user ---
      setErrorMessage(error.message);
    } finally {
// ... existing code ...
      setIsGenerating(null); // Clear loading state
    }
  };

  const getItemName = (id) => {
// ... existing code ...
    return studyItems.find((item) => item.id === id)?.title || "this item";
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center pt-24 p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
{/* ... existing code ... */}
          <h1 className="text-3xl font-bold text-blue-500 mb-2">
            My Learning Roadmap
          </h1>
          <p className="text-gray-400">
            Click on an item to see your tasks.
          </p>
        </div>

        {/* --- NEW: Error Message Display --- */}
        {errorMessage && (
          <div className="bg-red-900 border border-red-700 text-red-100 p-4 rounded-lg mb-6">
{/* ... existing code ... */}
            <strong className="font-bold">Generation Failed: </strong>
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}

        {/* Add New Main Item */}
        <div className="flex gap-2 mb-8">
          {/* --- REVERTED INPUT --- */}
          <input
            type="text"
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            placeholder="Add a new study item..."
            className="flex-1 p-3 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white focus:outline-none focus:border-blue-500"
            onKeyDown={(e) => e.key === "Enter" && addMainItem()}
          />
          {/* --- END OF REVERTED INPUT --- */}
          <button
            onClick={addMainItem}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold transition"
          >
            Add Item
          </button>
        </div>

        {/* List of Study Item Cards */}
        <div className="space-y-4">
{/* ... existing code ... */}
          {studyItems.map((item) => (
            <StudyItemCard
              key={item.id}
              item={item}
              onToggleExpand={toggleExpand}
              onAddSubTask={addSubTask}
              onToggleSubTask={toggleSubTask}
              onDeleteSubTask={deleteSubTask}
              onDeleteMainItem={requestDeleteMainItem}
              onUpdateNotes={updateNotes}
              onGenerateContent={handleGenerateContent} // --- Pass generate handler
              isGenerating={isGenerating === item.id} // --- Pass loading state
              // --- REMOVED PROP ---
            />
          ))}

          {studyItems.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
{/* ... existing code ... */}
              No items yet. Add one above to get started!
            </div>
          )}
        </div>
      </div>

      {/* --- Render Modal --- */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        itemName={getItemName(modalState.itemToDelete)}
        onCancel={cancelDeleteMainItem}
        onConfirm={executeDeleteMainItem}
      />
    </div>
  );
}

// --- Study Item Card Component ---
function StudyItemCard({
  item,
  onToggleExpand,
  onAddSubTask,
  onToggleSubTask,
  onDeleteSubTask,
  onDeleteMainItem,
  onUpdateNotes,
  onGenerateContent, // --- Receive handler
  isGenerating, // --- Receive loading state
  // --- REMOVED PROP ---
}) {
  const [subTaskText, setSubTaskText] = useState("");
  // --- NEW: Local state for this card's model selection ---
  const [localService, setLocalService] = useState("openrouter"); // --- Initialized with default ---

  // Calculate progress
// ... existing code ...
  const completed = item.subTasks.filter((task) => task.done).length;
  const total = item.subTasks.length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  const handleAddSubTask = () => {
// ... existing code ...
    onAddSubTask(item.id, subTaskText);
    setSubTaskText("");
  };

  return (
    <div className="bg-[#111] border border-gray-800 rounded-xl transition-all">
      {/* --- Card Header (Always Visible) --- */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => onToggleExpand(item.id)}
      >
        <div className="flex-1 overflow-hidden">
          <h2 className="text-lg font-semibold text-gray-100 truncate">
{/* ... existing code ... */}
            {item.title}
          </h2>
          {/* Progress Bar */}
          <div className="mt-2 bg-gray-800 rounded-full h-2 w-full overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center ml-4">
          <span className="text-sm text-gray-400 w-12 text-right">
{/* ... existing code ... */}
            {progress}%
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Don't trigger expand
              onDeleteMainItem(item.id);
            }}
            className="text-gray-600 hover:text-red-400 ml-4 transition"
            title="Delete this item"
          >
            ✕
          </button>
          <span
            className={`ml-4 text-xl transform transition-transform ${
              item.expanded ? "rotate-180" : "rotate-0"
            }`}
          >
            ▼
          </span>
        </div>
      </div>

      {/* --- Card Body (Collapsible) --- */}
      {item.expanded && (
        <div className="p-4 border-t border-gray-700 space-y-4">
          {/* --- MODIFIED: Generate Button + New Dropdown --- */}
          <div className="flex gap-2 items-center">
            <button
              onClick={() =>
                onGenerateContent(item.id, item.title, localService)
              } // --- UPDATED ---
              disabled={isGenerating}
              className="flex-1 px-4 py-2 bg-blue-800 hover:bg-blue-700 rounded-lg font-semibold transition disabled:bg-gray-700 disabled:cursor-not-allowed" // --- MODIFIED (flex-1) ---
            >
              {isGenerating ? "Generating..." : "Generate Tasks & Notes"}
            </button>
            {/* --- NEW DROPDOWN --- */}
            <select
              value={localService}
              onChange={(e) => setLocalService(e.target.value)}
              disabled={isGenerating}
              className="bg-[#1a1a1a] text-gray-300 text-sm rounded-lg
                         py-2.5 px-3
                         border border-gray-700
                         focus:outline-none focus:border-blue-500 cursor-pointer
                         hover:text-white"
              aria-label="Select AI Model for this item"
              onClick={(e) => e.stopPropagation()} // --- IMPORTANT: Stop card from expanding ---
            >
              <option value="openrouter">OpenRouter</option>
              <option value="cerebras">Cerebras</option>
              <option value="llama">Llama</option>
              <option value="deepseek">Deepseek (takes ~1 min)</option>
            </select>
          </div>

          {/* Add Sub-Task Input */}
          <div className="flex gap-2">
{/* ... existing code ... */}
            <input
              type="text"
              value={subTaskText}
              onChange={(e) => setSubTaskText(e.g.value)}
              placeholder="Add a new task..."
              className="flex-1 p-2 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white focus:outline-none focus:border-blue-500"
              onKeyDown={(e) => e.key === "Enter" && handleAddSubTask()}
            />
            <button
              onClick={handleAddSubTask}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-bold transition text-sm"
            >
              Add Task
            </button>
          </div>

          {/* Sub-Task List */}
          <div className="space-y-2">
{/* ... existing code ... */}
            {item.subTasks.length === 0 && (
              <p className="text-sm text-gray-500">No tasks yet.</p>
            )}
            {item.subTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-2 rounded-md bg-[#1a1a1a] group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => onToggleSubTask(item.id, task.id)}
                    className="w-4 h-4 accent-blue-500 cursor-pointer"
                  />
                  <span
                    className={`truncate ${
                      task.done
                        ? "line-through text-gray-500"
                        : "text-gray-300"
                    }`}
                  >
                    {task.text}
                  </span>
                </div>
                <button
                  onClick={() => onDeleteSubTask(item.id, task.id)}
                  className="text-gray-600 hover:text-red-400 ml-2 transition opacity-0 group-hover:opacity-100"
                  title="Delete this task"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* --- Notes Section --- */}
          <div>
{/* ... existing code ... */}
            <h3 className="text-md font-semibold text-blue-400 mb-2">
              Notes
            </h3>
            <textarea
              value={item.notes}
              onChange={(e) => onUpdateNotes(item.id, e.target.value)}
              placeholder="Add your notes here..."
              className="w-full h-24 p-2 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          {/* --- End of Notes Section --- */}
        </div>
      )}
    </div>
  );
}

// --- Confirmation Modal Component ---
function ConfirmationModal({ isOpen, itemName, onCancel, onConfirm }) {
// ... existing code ...
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-[#111] border border-gray-700 rounded-xl p-6 w-full max-w-sm m-4">
        <h2 className="text-xl font-bold text-white mb-4">Confirm Deletion</h2>
        {/* --- FIXED: Typo </f> to </p> --- */}
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete{" "}
          <strong className="text-blue-400">"{itemName}"</strong>? This action
          cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}