"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";
import { usePathname } from "next/navigation";

export default function AppLayout({ children }) {
  const pathname = usePathname();

  // pages where we don't want navbar or footer
  const hideLayout = ["/login", "/signup"].includes(pathname);

  return (
    <>
      {!hideLayout && <Navbar />}
      <div className="min-h-screen">{children}</div>
      {!hideLayout && <Footer />}
    </>
  );
}
