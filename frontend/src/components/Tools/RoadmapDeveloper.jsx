import React, { useEffect, useState } from "react";
import { useAuth } from "@/store/auth";
import { API_BASE_URL } from "../../api";

// --- Icons ---
const PlusIcon = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
  </svg>
);

const TrashIcon = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M9 6v12a2 2 0 002 2h2a2 2 0 002-2V6M10 6V4a1 1 0 011-1h2a1 1 0 011 1v2" />
  </svg>
);

const Spinner = ({ className = "h-4 w-4 animate-spin" }) => (
  <svg className={className} viewBox="0 0 50 50">
    <circle cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="5" fill="none" opacity="0.25" />
    <path d="M45 25a20 20 0 00-20-20" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
  </svg>
);

// ----------------- API helper -----------------
async function apiFetch(url, token, options = {}) {
  const headers = options.headers || {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  headers["Content-Type"] = headers["Content-Type"] || "application/json";
  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    let body = null;
    try { body = await res.json(); } catch (e) { }
    const errMsg = body?.error || `${res.status} ${res.statusText}`;
    const err = new Error(errMsg);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return res.json().catch(() => ({}));
}

// ----------------- Main Component -----------------
export default function RoadmapApp() {
  const token = useAuth((s) => s.token);
  const [studyItems, setStudyItems] = useState([]);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [modalState, setModalState] = useState({ isOpen: false, itemToDelete: null });
  const [loading, setLoading] = useState(false);
  const [generatingItemId, setGeneratingItemId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Load items on mount
  useEffect(() => {
    if (!token) {
      setStudyItems([]);
      return;
    }
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function loadItems() {
    if (!token) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await apiFetch(`${API_BASE_URL}/api/roadmap`, token, { method: "GET" });
      const items = data.items || [];
      const normalized = items.map((it) => ({ ...it, subTasks: it.subTasks || [] }));
      setStudyItems(normalized);
    } catch (err) {
      console.error("Failed to load roadmap items", err);
      setErrorMessage(err.message || "Failed to load items");
    } finally {
      setLoading(false);
    }
  }

  async function addMainItem() {
    if (!newItemTitle.trim()) return;
    setErrorMessage(null);
    try {
      const payload = { title: newItemTitle.trim() };
      const data = await apiFetch(`${API_BASE_URL}/api/roadmap`, token, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const newItem = data.item;
      if (newItem) {
        newItem.subTasks = newItem.subTasks || [];
        setStudyItems((prev) => [newItem, ...prev]);
        setNewItemTitle("");
      } else {
        await loadItems();
      }
    } catch (err) {
      console.error("Add item failed", err);
      setErrorMessage(err.message || "Failed to add item");
    }
  }

  function requestDeleteMainItem(id) {
    setModalState({ isOpen: true, itemToDelete: id });
  }

  async function executeDeleteMainItem() {
    const id = modalState.itemToDelete;
    if (!id) {
      setModalState({ isOpen: false, itemToDelete: null });
      return;
    }
    setErrorMessage(null);
    try {
      await apiFetch(`${API_BASE_URL}/api/roadmap/${id}`, token, { method: "DELETE" });
      setStudyItems((prev) => prev.filter((it) => it.id !== id));
    } catch (err) {
      console.error("Delete item failed", err);
      setErrorMessage(err.message || "Failed to delete item");
    } finally {
      setModalState({ isOpen: false, itemToDelete: null });
    }
  }

  function cancelDeleteMainItem() {
    setModalState({ isOpen: false, itemToDelete: null });
  }

  async function toggleExpand(id) {
    setStudyItems((prev) => prev.map((it) => (it.id === id ? { ...it, expanded: !it.expanded } : it)));
    const item = studyItems.find((it) => it.id === id);
    const newExpanded = item ? !item.expanded : true;
    try {
      await apiFetch(`${API_BASE_URL}/api/roadmap/${id}`, token, {
        method: "PUT",
        body: JSON.stringify({ expanded: newExpanded }),
      });
    } catch (err) {
      console.warn("Could not persist expanded state:", err);
    }
  }

  async function addSubTask(mainId, text) {
    if (!text || !text.trim()) return;
    setErrorMessage(null);
    try {
      const res = await apiFetch(`${API_BASE_URL}/api/roadmap/${mainId}/subtask`, token, {
        method: "POST",
        body: JSON.stringify({ text: text.trim() }),
      });
      const subtask = res.subtask;
      if (subtask) {
        setStudyItems((prev) => prev.map((it) => (it.id === mainId ? { ...it, subTasks: [...it.subTasks, subtask] } : it)));
      } else {
        await loadItems();
      }
    } catch (err) {
      console.error("Add subtask failed", err);
      setErrorMessage(err.message || "Failed to add subtask");
    }
  }

  async function toggleSubTask(mainId, subTaskId) {
    setErrorMessage(null);
    try {
      const res = await apiFetch(`${API_BASE_URL}/api/roadmap/subtask/${subTaskId}`, token, {
        method: "PUT",
      });
      const updated = res.subtask;
      if (updated) {
        setStudyItems((prev) =>
          prev.map((it) =>
            it.id === mainId
              ? { ...it, subTasks: it.subTasks.map((t) => (t.id === subTaskId ? updated : t)) }
              : it
          )
        );
      } else {
        await loadItems();
      }
    } catch (err) {
      console.error("Toggle subtask failed", err);
      setErrorMessage(err.message || "Failed to toggle subtask");
    }
  }

  async function deleteSubTask(mainId, subTaskId) {
    setErrorMessage(null);
    try {
      await apiFetch(`${API_BASE_URL}/api/roadmap/subtask/${subTaskId}`, token, { method: "DELETE" });
      setStudyItems((prev) => prev.map((it) => (it.id === mainId ? { ...it, subTasks: it.subTasks.filter((t) => t.id !== subTaskId) } : it)));
    } catch (err) {
      console.error("Delete subtask failed", err);
      setErrorMessage(err.message || "Failed to delete subtask");
    }
  }

  async function updateNotes(mainId, text) {
    setStudyItems((prev) => prev.map((it) => (it.id === mainId ? { ...it, notes: text } : it)));
    try {
      await apiFetch(`${API_BASE_URL}/api/roadmap/${mainId}`, token, {
        method: "PUT",
        body: JSON.stringify({ notes: text }),
      });
    } catch (err) {
      console.error("Update notes failed", err);
      setErrorMessage(err.message || "Failed to update notes");
    }
  }

  async function updateTitle(mainId, title) {
    setStudyItems((prev) => prev.map((it) => (it.id === mainId ? { ...it, title } : it)));
    try {
      await apiFetch(`${API_BASE_URL}/api/roadmap/${mainId}`, token, {
        method: "PUT",
        body: JSON.stringify({ title }),
      });
    } catch (err) {
      console.error("Update title failed", err);
      setErrorMessage(err.message || "Failed to update title");
    }
  }

  // ----------------- AI GENERATION HANDLER -----------------
  async function handleGenerateContent(itemId, title, service) {
    setGeneratingItemId(itemId);
    setErrorMessage(null);

    const systemPrompt = `You are an expert curriculum designer. Given a topic, you must generate a list of sub-tasks and some helpful notes. Respond *only* with a single, valid JSON object. Do not include any other text or markdown.
The JSON object must have two keys:
1. "tasks": an array of 3-5 strings, where each string is an actionable sub-task.
2. "notes": a single string containing a concise, helpful note about the topic.`;

    try {
      const payload = {
        prompt: title,
        systemPrompt: systemPrompt + " Return ONLY valid JSON.",
        service: service,
      };

      const res = await apiFetch(`${API_BASE_URL}/api/generate`, token, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const rawText = res.text || "";
      let jsonMatch = rawText.match(/\{[\s\S]*?\}(?=[^}]*$)/) || rawText.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error("No JSON object found in AI response.");
      }

      let parsed;
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch (e) {
        throw new Error("Failed to parse JSON from AI response.");
      }

      const newTasks = parsed.tasks || [];
      const newNotes = parsed.notes || "";

      const currentItem = studyItems.find((it) => it.id === itemId);
      const existingNotes = currentItem?.notes || "";

      let finalNotes = existingNotes;
      if (newNotes) {
        finalNotes = existingNotes
          ? `${existingNotes}\n\n--- AI Notes (${service}) ---\n${newNotes}`
          : `--- AI Notes (${service}) ---\n${newNotes}`;

        await apiFetch(`${API_BASE_URL}/api/roadmap/${itemId}`, token, {
          method: "PUT",
          body: JSON.stringify({ notes: finalNotes }),
        });
      }

      if (newTasks.length > 0) {
        for (const t of newTasks) {
          await apiFetch(`${API_BASE_URL}/api/roadmap/${itemId}/subtask`, token, {
            method: "POST",
            body: JSON.stringify({ text: t }),
          });
        }
      }

      await loadItems();

    } catch (err) {
      console.error("AI generation failed", err);
      setErrorMessage(err.message || "AI generation failed");
    } finally {
      setGeneratingItemId(null);
    }
  }

  const getItemName = (id) => studyItems.find((it) => it.id === id)?.title || "this item";

  // ---------------- UI ----------------
  return (
    // ADJUSTED: Padding responsive (p-4 mobile, p-6 desktop)
    <div className="min-h-screen bg-black text-white flex justify-center pt-20 pb-12 px-4 md:pt-24 md:p-6">
      <div className="w-full max-w-3xl">
        <div className="mb-6 text-center">
          {/* ADJUSTED: Font size responsive */}
          <h1 className="text-2xl md:text-3xl font-bold text-blue-500 mb-2">My Learning Roadmap</h1>
          <p className="text-gray-400 text-sm md:text-base">Click on an item to expand and manage tasks & notes.</p>
        </div>

        {errorMessage && (
          <div className="bg-red-900 border border-red-700 text-red-100 p-3 rounded mb-4 text-sm">
            <strong>Oops:</strong> {errorMessage}
          </div>
        )}

        {/* Add new item */}
        <div className="flex gap-2 mb-6">
          <input
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addMainItem()}
            placeholder="Add new study item..."
            className="flex-1 p-3 rounded-lg bg-[#0f1720] border border-gray-700 text-white focus:outline-none text-sm md:text-base"
          />
          <button onClick={addMainItem} className="bg-blue-600 hover:bg-blue-700 px-4 md:px-5 py-3 rounded-lg flex items-center gap-2 whitespace-nowrap">
            <PlusIcon /> <span className="hidden sm:inline">Add</span>
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center text-gray-400 py-12">
            <Spinner className="h-6 w-6 inline-block mr-2" /> Loading...
          </div>
        ) : (
          <div className="space-y-4">
            {studyItems.length === 0 && (
              <div className="text-center text-gray-500 py-8 text-sm">No items yet. Add one to get started.</div>
            )}

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
                onUpdateTitle={updateTitle}
                onGenerateContent={handleGenerateContent}
                isGenerating={generatingItemId === item.id}
              />
            ))}
          </div>
        )}

        {/* Modal */}
        <ConfirmationModal
          isOpen={modalState.isOpen}
          itemName={getItemName(modalState.itemToDelete)}
          onCancel={cancelDeleteMainItem}
          onConfirm={executeDeleteMainItem}
        />
      </div>
    </div>
  );
}

// ---------------- Study Item Card ----------------
function StudyItemCard({
  item,
  onToggleExpand,
  onAddSubTask,
  onToggleSubTask,
  onDeleteSubTask,
  onDeleteMainItem,
  onUpdateNotes,
  onUpdateTitle,
  onGenerateContent,
  isGenerating,
}) {
  const [subTaskText, setSubTaskText] = useState("");
  const [titleEdit, setTitleEdit] = useState(item.title);
  const [selectedService, setSelectedService] = useState("openrouter");

  useEffect(() => {
    setTitleEdit(item.title);
  }, [item.title]);

  const completed = (item.subTasks || []).filter((t) => t.done).length;
  const total = (item.subTasks || []).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  const handleAdd = async () => {
    if (!subTaskText.trim()) return;
    await onAddSubTask(item.id, subTaskText.trim());
    setSubTaskText("");
  };

  return (
    <div className="bg-[#0b1116] border border-gray-800 rounded-xl transition">
      {/* Header */}
      {/* ADJUSTED: Padding reduction for mobile */}
      <div className="flex items-center justify-between p-3 md:p-4 cursor-pointer" onClick={() => onToggleExpand(item.id)}>
        <div className="flex-1 overflow-hidden">
          <input
            value={titleEdit}
            onChange={(e) => setTitleEdit(e.target.value)}
            onBlur={() => onUpdateTitle(item.id, titleEdit)}
            onClick={(e) => e.stopPropagation()} 
            className="bg-transparent text-base md:text-lg font-semibold text-gray-100 w-full truncate outline-none"
          />
          <div className="mt-2 bg-gray-800 rounded-full h-1.5 md:h-2 w-full overflow-hidden">
            <div className="bg-blue-600 h-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="flex items-center ml-3 md:ml-4">
          <span className="text-xs md:text-sm text-gray-400 w-8 md:w-12 text-right">{progress}%</span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteMainItem(item.id);
            }}
            className="ml-3 md:ml-4 text-gray-500 hover:text-red-400 p-1"
            title="Delete item"
          >
            <TrashIcon />
          </button>

          <div className={`ml-2 md:ml-4 text-xl transform transition-transform text-gray-500 ${item.expanded ? "rotate-180" : "rotate-0"}`}>▼</div>
        </div>
      </div>

      {/* Body */}
      {item.expanded && (
        <div className="p-3 md:p-4 border-t border-gray-700 space-y-4">
          
          {/* Generate + model selector */}
          {/* ADJUSTED: flex-col on mobile so buttons don't squash */}
          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onGenerateContent(item.id, item.title, selectedService);
              }}
              disabled={isGenerating}
              className="flex-1 px-4 py-2 bg-blue-800 hover:bg-blue-700 rounded-lg font-semibold transition disabled:bg-gray-700 disabled:cursor-not-allowed text-sm"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner /> Generating...
                </span>
              ) : (
                "Generate Tasks & Notes"
              )}
            </button>

            <select
              onClick={(e) => e.stopPropagation()}
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              disabled={isGenerating}
              className="bg-[#0f1720] text-gray-300 text-sm rounded-lg py-2 px-3 border border-gray-700 focus:outline-none cursor-pointer w-full sm:w-auto"
              aria-label="Select AI model"
            >
              <option value="openrouter">OpenRouter</option>
              <option value="cerebras">Cerebras</option>
              <option value="llama">Llama</option>
            </select>
          </div>

          {/* Subtask input */}
          <div className="flex gap-2">
            <input
              value={subTaskText}
              onChange={(e) => setSubTaskText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAdd())}
              placeholder="Add a new task..."
              className="flex-1 p-2 rounded-lg bg-[#0f1720] border border-gray-700 text-white focus:outline-none text-sm md:text-base"
            />
            <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold">
              Add
            </button>
          </div>

          {/* Subtasks list */}
          <div className="space-y-2">
            {(item.subTasks || []).length === 0 ? (
              <p className="text-sm text-gray-500">No tasks yet.</p>
            ) : (
              (item.subTasks || []).map((task) => (
                <div key={task.id} className="flex items-start justify-between p-2 rounded-md bg-[#0f1720] group">
                  <div className="flex items-start gap-3 w-full">
                    <input
                      type="checkbox"
                      checked={!!task.done}
                      onChange={() => onToggleSubTask(item.id, task.id)}
                      className="mt-1 w-4 h-4 accent-blue-500 cursor-pointer flex-shrink-0"
                    />
                    {/* ADJUSTED: break-words instead of truncate so mobile users see full text */}
                    <span className={`text-sm md:text-base break-words w-full pr-2 ${task.done ? "line-through text-gray-500" : "text-gray-300"}`}>
                      {task.text}
                    </span>
                  </div>
                  <button
                    onClick={() => onDeleteSubTask(item.id, task.id)}
                    // ADJUSTED: Always visible on mobile (opacity-100), hidden on desktop until hover
                    className="text-gray-500 hover:text-red-400 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-1"
                    title="Delete task"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-sm md:text-md font-semibold text-blue-400 mb-2">Notes</h3>
            <textarea
              value={item.notes || ""}
              onChange={(e) => onUpdateNotes(item.id, e.target.value)}
              placeholder="Add your notes here..."
              className="w-full h-36 p-3 rounded-lg bg-[#0f1720] border border-gray-700 text-white focus:outline-none focus:border-blue-500 text-sm md:text-base leading-relaxed"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------- Confirmation Modal ----------------
function ConfirmationModal({ isOpen, itemName, onCancel, onConfirm }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4">
      <div className="bg-[#0b1116] border border-gray-700 rounded-xl p-5 md:p-6 w-full max-w-sm md:max-w-md shadow-2xl">
        <h2 className="text-lg md:text-xl font-bold text-white mb-3">Confirm Deletion</h2>
        <p className="text-gray-300 mb-6 text-sm md:text-base">
          Are you sure you want to delete <strong className="text-blue-400">"{itemName}"</strong>? This cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold text-sm">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-sm">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
