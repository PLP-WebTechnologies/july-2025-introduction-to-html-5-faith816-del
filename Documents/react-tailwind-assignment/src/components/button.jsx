export default function Button({ children, onClick, variant = "primary", className = "" }) {
  let base = "px-4 py-2 rounded font-semibold transition-colors transition-transform";
  let styles = "";

  switch (variant) {
    case "secondary":
      styles = "bg-gray-500 text-white hover:bg-gray-600 hover:scale-105";
      break;
    case "danger":
      styles = "bg-red-500 text-white hover:bg-red-600 hover:scale-105";
      break;
    default: // primary
      styles = "bg-purple-500 text-white hover:bg-purple-600 hover:scale-105";
  }

  return (
    <button onClick={onClick} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}
