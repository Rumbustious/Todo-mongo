import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState("light");
  const [initialLoading, setInitialLoading] = useState(true); // Only for initial load

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await axios.get("/api/todos");
        setTodos(res.data);
      } catch (err) {
        setError("Failed to fetch todos");
        console.error(err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!title.trim()) return;

    // Create a temporary ID (timestamp + random)
    const tempId = `temp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Optimistically add todo to UI right away
    const newTodo = { _id: tempId, title, completed: false };
    setTodos([...todos, newTodo]);
    setTitle("");

    // Send to server in background
    try {
      const res = await axios.post("/api/todos", { title });
      // Replace temp todo with real one from server
      setTodos((prev) =>
        prev.map((todo) => (todo._id === tempId ? res.data : todo))
      );
    } catch (err) {
      // If server request fails, show error and remove optimistic todo
      setError("Failed to add todo");
      setTodos((prev) => prev.filter((todo) => todo._id !== tempId));
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    // Optimistically remove from UI
    const previousTodos = [...todos];
    setTodos(todos.filter((todo) => todo._id !== id));

    // Send to server in background
    try {
      await axios.delete(`/api/todos/${id}`);
    } catch (err) {
      // Restore on error
      setError("Failed to delete todo");
      setTodos(previousTodos);
      console.error(err);
    }
  };

  const toggleTodo = async (todo) => {
    // Optimistically update UI
    const previousTodos = [...todos];
    setTodos(
      todos.map((t) =>
        t._id === todo._id ? { ...t, completed: !t.completed } : t
      )
    );

    // Send to server in background
    try {
      await axios.put(`/api/todos/${todo._id}`, {
        ...todo,
        completed: !todo.completed,
      });
    } catch (err) {
      // Restore on error
      setError("Failed to update todo");
      setTodos(previousTodos);
      console.error(err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <div className="app-container" data-theme={theme}>
      <button onClick={toggleTheme} className="theme-toggle">
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      <header className="app-header">
        <h1>Todo App</h1>
        {error && <div className="error-message">{error}</div>}
      </header>

      <div className="input-container">
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder="What needs to be done?"
          className="todo-input"
        />
        <button onClick={addTodo} className="add-button">
          Add Todo
        </button>
      </div>

      {initialLoading ? (
        <div className="loading">
          <div className="spinner"></div>
          Loading...
        </div>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className={`todo-item ${todo.completed ? "completed" : ""} ${
                todo._id.startsWith("temp-") ? "temp-item" : ""
              }`}
            >
              <div className="todo-content">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo)}
                  className="todo-checkbox"
                />
                <span className="todo-text">{todo.title}</span>
              </div>
              <button
                onClick={() => deleteTodo(todo._id)}
                className="delete-button"
                aria-label="Delete todo"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}

      {todos.length > 0 && (
        <div className="stats">
          <span className="completed-count">
            {todos.filter((t) => t.completed).length}
          </span>
          <span> of </span>
          <span className="total-count">{todos.length}</span>
          <span> tasks completed</span>
        </div>
      )}
    </div>
  );
}

export default App;
