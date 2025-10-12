"use client";

import dynamic from "next/dynamic";
import AuthCheck from "../components/AuthCheck"; // ✅ import AuthCheck

const ClientMap = dynamic(() => import("../components/ClientMap"), {
  ssr: false, // Prevent SSR map errors
});

export default function MapPage() {
  return (
    <AuthCheck>
      <main className="min-h-screen bg-[#9caf88] flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-bold text-[#01411C] mb-4">
          🗺️ RegenIQ Farm Map
        </h1>
        <p className="text-black max-w-2xl text-center mb-6">
          View all registered farms across the country. Each green marker
          represents a farm. Click a marker to see farm details and
          environmental insights.
        </p>

        <div className="w-full max-w-5xl h-[80vh] rounded-2xl overflow-hidden shadow-lg border border-[#01411C]/40">
          <ClientMap />
        </div>

        <footer className="text-sm text-[#01411C]/80 mt-6">
          RegenIQ © {new Date().getFullYear()} • Empowering Regenerative Farming
        </footer>
      </main>
    </AuthCheck>
  );
}