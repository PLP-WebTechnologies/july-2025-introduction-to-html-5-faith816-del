export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white dark:bg-gray-700 shadow-md rounded p-4 hover:shadow-lg hover:scale-105 transition-transform transition-shadow ${className}`}>
      {children}
    </div>
  );
}
