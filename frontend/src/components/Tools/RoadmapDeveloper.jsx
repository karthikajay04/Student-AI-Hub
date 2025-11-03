import React from "react";
import {
  IconCode,
  IconBug,
  IconRocket,
  IconNotes,
  IconResearch,
  IconVideo,
  IconRoadmap,
} from "../icons";

// Role templates
const roleToTemplate = {
  "full stack developer": [
    { title: "Web Fundamentals", category: "Fundamentals", description: "HTML, CSS, JavaScript basics; layouts, forms, accessibility." },
    { title: "Frontend Framework", category: "Frontend", description: "React core concepts, hooks, routing, state management." },
    { title: "Backend Basics", category: "Backend", description: "Node.js, REST APIs, authentication, database CRUD." },
    { title: "Databases", category: "Data", description: "SQL (PostgreSQL/MySQL) and NoSQL (MongoDB); schema design." },
    { title: "DevOps Essentials", category: "DevOps", description: "Git, CI/CD, Docker basics, environment variables." },
    { title: "Capstone Project", category: "Projects", description: "End-to-end production-ready app with docs and tests." },
  ],
  "python developer": [
    { title: "Python Core", category: "Fundamentals", description: "Syntax, data structures, OOP, packaging, venv." },
    { title: "Web or Scripting", category: "Backend", description: "FastAPI/Flask or automation scripting best practices." },
    { title: "Data Handling", category: "Data", description: "Pandas, SQL, file I/O, APIs." },
    { title: "Testing & QA", category: "Quality", description: "pytest, type hints, linters, formatting." },
    { title: "Deployment", category: "DevOps", description: "Docker, simple CI, packaging for release." },
    { title: "Portfolio Project", category: "Projects", description: "Publish a CLI/web tool with documentation." },
  ],
};

const categoryMeta = {
  Fundamentals: { color: "bg-yellow-500/20 text-yellow-400", Icon: IconResearch },
  Frontend: { color: "bg-blue-500/20 text-blue-400", Icon: IconCode },
  Backend: { color: "bg-red-500/20 text-red-400", Icon: IconCode },
  Data: { color: "bg-green-500/20 text-green-400", Icon: IconNotes },
  DevOps: { color: "bg-orange-500/20 text-orange-400", Icon: IconRocket },
  Quality: { color: "bg-pink-500/20 text-pink-400", Icon: IconBug },
  Projects: { color: "bg-gray-500/20 text-gray-400", Icon: IconRoadmap },
};

function buildStepsFromRole(roleInput) {
  const key = (roleInput || "").toLowerCase().trim();
  const base = roleToTemplate[key] || roleToTemplate["full stack developer"];
  return base.map((item, index) => ({
    id: Date.now() + index,
    title: item.title,
    category: item.category,
    description: item.description,
    progress: 0,
    expanded: false,
    notes: "",
    tasks: [],
  }));
}

function RoadmapDeveloper() {
  const [role, setRole] = React.useState("Full Stack Developer");
  const [steps, setSteps] = React.useState(buildStepsFromRole(role));
  const [newStepTitle, setNewStepTitle] = React.useState("");
  const [dragIndex, setDragIndex] = React.useState(null);

  function regenerateFromRole() {
    if (!role.trim()) return alert("Enter a role first!");
    setSteps(buildStepsFromRole(role));
  }

  function toggleExpanded(id) {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, expanded: !s.expanded } : s)));
  }

  function setStepProgress(id, value) {
    setSteps((s) => s.map((step) => (step.id === id ? { ...step, progress: value } : step)));
  }

  function addStep() {
    const t = newStepTitle.trim();
    if (!t) return;
    setSteps((s) => [
      ...s,
      { id: Date.now(), title: t, category: "Projects", description: "Custom step", progress: 0, expanded: false, notes: "", tasks: [] },
    ]);
    setNewStepTitle("");
  }

  function updateNotes(id, text) {
    setSteps((s) => s.map((step) => (step.id === id ? { ...step, notes: text } : step)));
  }

  function addTask(id, text) {
    if (!text.trim()) return;
    setSteps((s) =>
      s.map((step) =>
        step.id === id
          ? { ...step, tasks: [...step.tasks, { id: Date.now(), text, done: false }] }
          : step
      )
    );
  }

  function toggleTask(id, taskId) {
    setSteps((s) =>
      s.map((step) => {
        if (step.id !== id) return step;
        return { ...step, tasks: step.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)) };
      })
    );
  }

  function saveToLocal() {
    localStorage.setItem("aihub.roadmap", JSON.stringify({ role, steps }));
    alert("Roadmap saved locally!");
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify({ role, steps }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${role.replace(/\s+/g, "-").toLowerCase()}-roadmap.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function printRoadmap() {
    window.print();
  }

  // Drag and drop
  function onDragStart(index) {
    setDragIndex(index);
  }
  function onDragOver(e, index) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const copy = [...steps];
    const [moved] = copy.splice(dragIndex, 1);
    copy.splice(index, 0, moved);
    setSteps(copy);
    setDragIndex(index);
  }
  function onDragEnd() {
    setDragIndex(null);
  }

  return (
    <section className="min-h-screen bg-black text-white p-6">
      <div className="mt-30 max-w-5xl mx-auto bg-[#0d0d0d] border border-blue-700 rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-yellow-400 mb-3">
          Roadmap Developer
        </h2>
        <p className="text-gray-400 mb-6">
          Enter a role to generate a roadmap. Expand steps for details, add notes or tasks, and reorder freely.
        </p>

        {/* Role input */}
        <div className="flex flex-wrap gap-3 mb-4">
          <input
            className="flex-1 bg-[#1a1a1a] border border-gray-700 rounded-lg p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g., Full Stack Developer, Python Developer"
          />
          <button onClick={regenerateFromRole} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold">
            Generate
          </button>
          <button onClick={saveToLocal} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">
            Save
          </button>
          <button onClick={exportJson} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">
            Export
          </button>
          <button onClick={printRoadmap} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">
            Print
          </button>
        </div>

        {/* Add Step */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            className="flex-1 bg-[#1a1a1a] border border-gray-700 rounded-lg p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add custom step..."
            value={newStepTitle}
            onChange={(e) => setNewStepTitle(e.target.value)}
          />
          <button onClick={addStep} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold">
            Add Step
          </button>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const meta = categoryMeta[step.category] || categoryMeta["Projects"];
            const Icon = meta.Icon;
            return (
              <div
                key={step.id}
                draggable
                onDragStart={() => onDragStart(index)}
                onDragOver={(e) => onDragOver(e, index)}
                onDragEnd={onDragEnd}
                className="bg-[#111] border border-gray-700 rounded-xl p-4 transition hover:border-blue-500"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${meta.color}`}>
                      <Icon /> {step.category}
                    </div>
                    <strong className="text-lg">{step.title}</strong>
                  </div>
                  <button
                    onClick={() => toggleExpanded(step.id)}
                    className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
                  >
                    {step.expanded ? "Collapse" : "Expand"}
                  </button>
                </div>

                <div className="w-full bg-gray-800 h-2 rounded-lg mt-3 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full transition-all"
                    style={{ width: `${step.progress}%` }}
                  ></div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={step.progress}
                  onChange={(e) => setStepProgress(step.id, Number(e.target.value))}
                  className="w-full mt-2 accent-blue-500"
                />

                {step.expanded && (
                  <div className="mt-4 space-y-3">
                    <p className="text-gray-400">{step.description}</p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <strong className="text-yellow-400">Notes</strong>
                        <textarea
                          className="w-full mt-2 p-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          rows={4}
                          value={step.notes}
                          onChange={(e) => updateNotes(step.id, e.target.value)}
                          placeholder="Add notes..."
                        />
                      </div>
                      <div>
                        <strong className="text-blue-400">Tasks</strong>
                        <TaskList step={step} onAdd={(t) => addTask(step.id, t)} onToggle={(taskId) => toggleTask(step.id, taskId)} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TaskList({ step, onAdd, onToggle }) {
  const [text, setText] = React.useState("");
  return (
    <div className="mt-2">
      <div className="flex gap-2">
        <input
          className="flex-1 bg-[#1a1a1a] border border-gray-700 rounded-lg p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="New task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={() => {
            onAdd(text);
            setText("");
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
        >
          Add
        </button>
      </div>
      <ul className="mt-3 space-y-1">
        {step.tasks.map((t) => (
          <li key={t.id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => onToggle(t.id)}
              className="accent-yellow-400"
            />
            <span className={t.done ? "line-through text-gray-500" : ""}>
              {t.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RoadmapDeveloper;
