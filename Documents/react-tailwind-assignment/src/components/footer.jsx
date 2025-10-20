export default function Footer() {
  return (
    <footer className="bg-purple-500 dark:bg-gray-800 text-white dark:text-gray-100 p-4 text-center mt-auto transition-colors">
      © {new Date().getFullYear()} MyApp. All rights reserved.
    </footer>
  );
}
