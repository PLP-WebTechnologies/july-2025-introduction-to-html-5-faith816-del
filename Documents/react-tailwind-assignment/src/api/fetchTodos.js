// src/api/fetchTodos.js
export async function fetchTodos() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=10");
    if (!response.ok) throw new Error("Failed to fetch todos");
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
