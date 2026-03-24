import { useState, useEffect } from "react";
import "./App.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [deadline, setDeadline] = useState("");

  // Load tasks
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tasks"));
    if (saved) setTasks(saved);
  }, []);

  // Save tasks
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!task.trim()) return;

    const newTask = {
      id: Date.now(),
      text: task,
      completed: false,
      time: new Date().toLocaleString(), // ⏰ time added
      deadline: deadline // 📅 deadline
    };

    setTasks([...tasks, newTask]);
    setTask("");
    setDeadline("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const editTask = (id) => {
    const newText = prompt("Edit task:");
    if (!newText) return;

    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, text: newText } : t))
    );
  };

  // Drag & drop
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    setTasks(items);
  };

  // Filter
  const filteredTasks = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  });

  return (
    <div className="app">
      <div className="card">
        <h1>✨ To-Do List</h1>

        {/* INTRO */}
        <p className="subtitle">
          Plan your day, track your tasks, and stay productive 🚀
        </p>

        {/* INPUT */}
        <div className="input-section">
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter task..."
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />

          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <button onClick={addTask}>Add</button>
        </div>

        {/* FILTER */}
        <div className="filters">
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("completed")}>Completed</button>
          <button onClick={() => setFilter("pending")}>Pending</button>
        </div>

        {/* LIST */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <ul ref={provided.innerRef} {...provided.droppableProps}>
                {filteredTasks.length === 0 && (
                  <p className="empty">No tasks yet 🚀</p>
                )}

                {filteredTasks.map((t, index) => (
                  <Draggable
                    key={t.id}
                    draggableId={t.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={t.completed ? "done" : ""}
                      >
                        <div>
                          <span onClick={() => toggleComplete(t.id)}>
                            {t.text}
                          </span>

                          <small>
                            ⏰ {t.time} <br />
                            📅 {t.deadline || "No deadline"}
                          </small>
                        </div>

                        <div className="buttons">
                          <button onClick={() => editTask(t.id)}>✏️</button>
                          <button onClick={() => deleteTask(t.id)}>❌</button>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;