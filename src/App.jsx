import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("studyDataPro");
    if (saved) setSubjects(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("studyDataPro", JSON.stringify(subjects));
  }, [subjects]);

  const addSubject = () => {
    if (!newSubject.trim()) return;
    setSubjects([...subjects, { name: newSubject, tasks: [] }]);
    setNewSubject("");
  };

  const deleteSubject = (index) => {
    const updated = subjects.filter((_, i) => i !== index);
    setSubjects(updated);
  };

  const addTask = (sIndex, text) => {
    if (!text.trim()) return;
    const updated = [...subjects];
    updated[sIndex].tasks.push({
      text,
      completed: false,
    });
    setSubjects(updated);
  };

  const deleteTask = (sIndex, tIndex) => {
    const updated = [...subjects];
    updated[sIndex].tasks.splice(tIndex, 1);
    setSubjects(updated);
  };

  const toggleTask = (sIndex, tIndex) => {
    const updated = [...subjects];
    updated[sIndex].tasks[tIndex].completed =
      !updated[sIndex].tasks[tIndex].completed;
    setSubjects(updated);
  };

  const total = subjects.reduce((a, s) => a + s.tasks.length, 0);
  const done = subjects.reduce(
    (a, s) => a + s.tasks.filter((t) => t.completed).length,
    0
  );

  const progress = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <div className="container">
        <h1> Smart Study Planner </h1>
        <p className="quote">
          “Small daily improvements lead to stunning results.”
        </p>

        <div className="top">
          <input
            placeholder="New Subject"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
          />
          <button onClick={addSubject}>Add</button>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀" : "🌙"}
          </button>
        </div>

        <div className="stats">
          <div>Total: {total}</div>
          <div>Completed: {done}</div>
          <div>{progress}% Done</div>
        </div>

        <div className="progress">
          <div style={{ width: `${progress}%` }}></div>
        </div>

        {subjects.map((subject, sIndex) => (
          <div key={sIndex} className="card">
            <div className="card-header">
              <h3>{subject.name}</h3>
              <button
                className="delete-btn"
                onClick={() => deleteSubject(sIndex)}
              >
                ✕
              </button>
            </div>

            <TaskInput onAdd={(text) => addTask(sIndex, text)} />

            {subject.tasks.map((task, tIndex) => (
              <div key={tIndex} className="task-row">
                <span
                  className={task.completed ? "done" : ""}
                  onClick={() => toggleTask(sIndex, tIndex)}
                >
                  {task.text}
                </span>
                <button
                  className="delete-btn"
                  onClick={() => deleteTask(sIndex, tIndex)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function TaskInput({ onAdd }) {
  const [task, setTask] = useState("");

  return (
    <div className="task-input">
      <input
        placeholder="Add Task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button
        onClick={() => {
          onAdd(task);
          setTask("");
        }}
      >
        +
      </button>
    </div>
  );
}
