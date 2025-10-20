// src/components/todos.jsx
import { useState, useEffect } from "react";
import { fetchTodos } from "../api/fetchTodos";
import Card from "./card";

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos()
      .then((data) => {
        setTodos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading todos...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <Card key={todo.id} className="flex justify-between items-center">
          <span className={todo.completed ? "line-through text-gray-400" : ""}>
            {todo.title}
          </span>
          <span className="text-sm text-gray-500">{todo.completed ? "Done" : "Pending"}</span>
        </Card>
      ))}
    </div>
  );
}
