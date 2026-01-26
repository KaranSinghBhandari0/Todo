/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, CheckCircle, Circle, Plus } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL + "/todos";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  const fetchTodos = async () => {
    const res = await axios.get(API_URL);
    setTodos(res.data);
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      const res = await axios.post(API_URL, { text: input });
      setTodos([...todos, res.data]);
      setInput("");
      toast.success("Task added!");
    } catch (err) {
      console.log(err);
      toast.error("Error adding task");
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, {
        completed: !completed,
      });
      setTodos(todos.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.log(err);
      toast.error("Update failed");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter((t) => t._id !== id));
      toast.error("Task deleted");
    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex justify-center p-8">
      <Toaster position="top-right" />
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          MERN Task Master
        </h1>

        <p className="mb-4">Backend URL: <span className="text-red-500">{import.meta.env.VITE_API_URL}</span></p>

        <form onSubmit={addTodo} className="flex gap-2 mb-6">
          <input
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            placeholder="Add a new task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="bg-cyan-600 hover:bg-cyan-500 p-2 rounded-lg transition-colors">
            <Plus size={24} />
          </button>
        </form>

        <div className="space-y-3">
          {todos.map((todo) => (
            <div
              key={todo._id}
              className="flex items-center justify-between bg-slate-800 p-4 rounded-xl border border-slate-700 group hover:border-cyan-500/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <button onClick={() => toggleTodo(todo._id, todo.completed)}>
                  {todo.completed ? (
                    <CheckCircle className="text-emerald-400" size={20} />
                  ) : (
                    <Circle className="text-slate-500" size={20} />
                  )}
                </button>
                <span
                  className={`${todo.completed ? "line-through text-slate-500" : "text-slate-200"}`}
                >
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => deleteTodo(todo._id)}
                className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
