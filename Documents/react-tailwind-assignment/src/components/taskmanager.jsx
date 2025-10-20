import { useState } from "react";
import Card from "./card";
import Button from "./button";
import useLocalStorage from "../hooks/useLocalStorage";

export default function TaskManager() {
  const [tasks, setTasks] = useLocalStorage("tasks", []);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");

  const addTask = () => {
    if (newTask.trim() === "") return;
    setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    setNewTask("");
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-2">Task Manager</h2>

      <div className="flex flex-col sm:flex-row mb-4 gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          className="border rounded p-2 flex-grow dark:bg-gray-800 dark:text-gray-100"
        />
        <Button onClick={addTask}>Add</Button>
      </div>

      <div className="flex gap-2 mb-4">
        <Button onClick={() => setFilter("all")} variant="secondary">All</Button>
        <Button onClick={() => setFilter("active")} variant="secondary">Active</Button>
        <Button onClick={() => setFilter("completed")} variant="secondary">Completed</Button>
      </div>

      <div className="space-y-2">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="flex justify-between items-center">
            <span
              className={task.completed ? "line-through text-gray-400" : ""}
              onClick={() => toggleComplete(task.id)}
            >
              {task.text}
            </span>
            <Button onClick={() => deleteTask(task.id)} variant="danger">Delete</Button>
          </Card>
        ))}
        {filteredTasks.length === 0 && <p className="text-gray-500">No tasks to show</p>}
      </div>
    </div>
  );
}
