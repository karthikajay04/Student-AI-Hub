import React from "react";
import GradientText from "../AnimatedText/GradientText"

function StudentTimer() {
  // State for user-defined durations (in minutes)
  const [studyDuration, setStudyDuration] = React.useState(25);
  const [breakDuration, setBreakDuration] = React.useState(5);

  // Timer state
  const [seconds, setSeconds] = React.useState(studyDuration * 60);
  const [running, setRunning] = React.useState(false);
  const [mode, setMode] = React.useState("study"); // 'study' | 'break'

  // Main timer countdown logic
  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s === 0) {
          clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  // Logic for switching modes when timer hits 0
  React.useEffect(() => {
    if (seconds === 0 && running) {
      setRunning(false);
      const nextMode = mode === "study" ? "break" : "study";
      const nextDuration = (nextMode === "study" ? studyDuration : breakDuration) * 60;
      
      alert(
        `${mode === "study" ? "Study" : "Break"} session complete. Switching to ${nextMode}.`
      );
      
      setMode(nextMode);
      setSeconds(nextDuration);
    }
  }, [seconds, mode, running, studyDuration, breakDuration]);

  // Update timer display if duration is changed while paused
  const handleStudyChange = (e) => {
    const newMinutes = parseInt(e.target.value) || 0;
    setStudyDuration(newMinutes);
    if (mode === "study" && !running) {
      setSeconds(newMinutes * 60);
    }
  };

  const handleBreakChange = (e) => {
    const newMinutes = parseInt(e.target.value) || 0;
    setBreakDuration(newMinutes);
    if (mode === "break" && !running) {
      setSeconds(newMinutes * 60);
    }
  };

  // Set mode and time when "Study" or "Break" buttons are clicked
  const selectMode = (newMode) => {
    setRunning(false);
    setMode(newMode);
    setSeconds(newMode === "study" ? studyDuration * 60 : breakDuration * 60);
  };

  // Reset the timer to the current mode's full duration
  const resetTimer = () => {
    setRunning(false);
    setSeconds(mode === "study" ? studyDuration * 60 : breakDuration * 60);
  };

  const minutesPart = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secondsPart = String(seconds % 60).padStart(2, "0");

  return (
    <section className="min-h-screen bg-black text-white flex justify-center items-center p-6">
      <div className="bg-zinc-900 rounded-2xl shadow-2xl p-8 w-full max-w-md text-center border border-zinc-800">
        <h2 className="text-3xl font-bold mb-2 text-blue-400"><GradientText
  colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
  animationSpeed={3}
  showBorder={false}
  className="custom-class"
>
  <b>Student Timer</b>
</GradientText>
</h2>
        <p className="text-zinc-400 mb-6">
          Set your custom study and break sessions.
          

        </p>

        {/* --- Custom Time Inputs --- */}
        <div className="flex justify-around gap-4 mb-6">
          <div className="flex-1">
            <label htmlFor="study-min" className="block text-sm font-medium text-zinc-300 mb-1">
              Study Minutes
            </label>
            <input
              id="study-min"
              type="number"
              value={studyDuration}
              onChange={handleStudyChange}
              className="w-full px-3 py-2 bg-zinc-800 text-white rounded-lg border border-zinc-700
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="break-min" className="block text-sm font-medium text-zinc-300 mb-1">
              Break Minutes
            </label>
            <input
              id="break-min"
              type="number"
              value={breakDuration}
              onChange={handleBreakChange}
              className="w-full px-3 py-2 bg-zinc-800 text-white rounded-lg border border-zinc-700
                         focus:outline-none focus:ring-2 focus:ring-yellow-500"
              min="1"
            />
          </div>
        </div>

        {/* --- Mode Selection Buttons --- */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-5 py-2 rounded-lg font-semibold transition-all ${
              mode === "study"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
            onClick={() => selectMode("study")}
          >
            Study
          </button>
          <button
            className={`px-5 py-2 rounded-lg font-semibold transition-all ${
              mode === "break"
                ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
            onClick={() => selectMode("break")}
          >
            Break
          </button>
        </div>

        <div className="flex flex-col items-center gap-4">
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              mode === "study"
                ? "bg-blue-500/20 text-blue-400"
                : "bg-yellow-400/20 text-yellow-400"
            }`}
          >
            {mode === "study" ? "Study Mode" : "Break Mode"}
          </span>

          {/* --- Timer Display --- */}
          <div className="text-6xl font-extrabold text-red-400">
            {minutesPart}:{secondsPart}
          </div>

          {/* --- Controls --- */}
          <div className="flex gap-4 mt-4">
            <button
              className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-all"
              onClick={() => setRunning((v) => !v)}
            >
              {running ? "Pause" : "Start"}
            </button>
            <button
              className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-all"
              onClick={resetTimer}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StudentTimer;