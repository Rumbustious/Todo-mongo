import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    axios.get('/api/todos').then(res => setTodos(res.data));
  }, []);

  const addTodo = async () => {
    if (!title) return;
    const res = await axios.post('/api/todos', { title });
    setTodos([...todos, res.data]);
    setTitle('');
  };

  const deleteTodo = async (id) => {
    await axios.delete(`/api/todos/${id}`);
    setTodos(todos.filter(todo => todo._id !== id));
  };

  const toggleTodo = async (todo) => {
    const res = await axios.put(`/api/todos/${todo._id}`, {
      ...todo,
      completed: !todo.completed
    });
    setTodos(todos.map(t => t._id === todo._id ? res.data : t));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>TODO App</h1>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Add new todo"
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo._id}>
            <span
              onClick={() => toggleTodo(todo)}
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                cursor: 'pointer',
              }}
            >
              {todo.title}
            </span>
            <button onClick={() => deleteTodo(todo._id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
