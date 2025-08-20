"use client";

import { useEffect, useState } from "react";

export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // Fetch all todos
  const fetchTodos = async () => {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add new todo
  const addTodo = async () => {
    if (!newTodo.trim()) return;
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTodo }),
    });
    setNewTodo("");
    fetchTodos();
  };

  // Delete todo
  const deleteTodo = async (id) => {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    fetchTodos();
  };

  // Toggle done
  const toggleDone = async (id, done) => {
    await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done }),
    });
    fetchTodos();
  };

  // Start editing
  const startEdit = (id, title) => {
    setEditingId(id);
    setEditText(title);
  };

  // Save edit
  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editText }),
    });
    setEditingId(null);
    setEditText("");
    fetchTodos();
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
      <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
         Todo List
      </h1>

      {/* List */}
      <ul className="space-y-3">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded-xl"
          >
            {editingId === todo._id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1 border rounded-lg px-2 py-1 
                             text-black dark:text-white 
                             bg-white dark:bg-gray-700 
                             placeholder-gray-400 dark:placeholder-gray-500
                             focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <div className="space-x-2 ml-2">
                  <button
                    onClick={() => saveEdit(todo._id)}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <span
                  onClick={() => toggleDone(todo._id, !todo.done)}
                  className={`flex-1 cursor-pointer ${
                    todo.done
                      ? "line-through text-gray-500"
                      : "text-gray-800 dark:text-gray-100"
                  }`}
                >
                  {todo.title}
                </span>
                <div className="space-x-2 ml-2">
                  <button
                    onClick={() => startEdit(todo._id, todo.title)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTodo(todo._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Add new todo */}
      <div className="mt-6 flex gap-2">
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 border rounded-xl px-4 py-2 
                     text-black dark:text-white 
                     bg-white dark:bg-gray-700 
                     placeholder-gray-400 dark:placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={addTodo}
          className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
        >
          Add
        </button>
      </div>
    </div>
  );
}
