import { Link } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Navbar() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="bg-purple-500 dark:bg-gray-800 text-white p-4 flex justify-between items-center transition-colors">
      <h1 className="font-bold text-xl">MyApp</h1>
      <div className="space-x-4 flex items-center">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/task" className="hover:underline">Tasks</Link>
        <button
          onClick={toggleTheme}
          className="ml-2 px-2 py-1 bg-white dark:bg-gray-700 text-black dark:text-white rounded transition-colors"
        >
          {darkMode ? "Light" : "Dark"}
        </button>
      </div>
    </nav>
  );
}
