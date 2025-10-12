import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";

export const metadata = {
  title: "RegenIQ 🌿",
  description: "Smart farm management system powered by Supabase and AI",
};

export default function RootLayout({ children }) {
  const noLayoutRoutes = ["/login", "/signup"];

  const isAuthPage =
    typeof window !== "undefined" &&
    noLayoutRoutes.includes(window.location.pathname);

  return (
    <html lang="en">
      <body>
        {!isAuthPage && <Navbar />}
        {children}
        {!isAuthPage && <Footer />}
      </body>
    </html>
  );
}
