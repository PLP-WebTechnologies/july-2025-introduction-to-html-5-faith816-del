"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("❌ " + error.message);
    } else {
      alert("✅ Login successful!");
      router.push("/"); // redirect to homepage
    }
    setLoading(false);
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center relative"
      style={{
        backgroundColor: "#9CAF88", // earthy sage green
      }}
    >
      {/* Login Box */}
      <div
        className="bg-white/25 backdrop-blur-md border border-white/30 rounded-2xl p-10 max-w-md w-full shadow-xl"
        style={{
          backgroundImage: "url('/peppers.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="bg-black/40 p-8 rounded-2xl">
          <h1 className="text-3xl font-bold text-center text-white mb-6 drop-shadow-lg">
            Login to <span className="text-sage">RegenIQ</span>
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-white/60 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-[#01411C]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-white/60 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-[#01411C]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#800020] text-white py-3 rounded-lg font-bold hover:bg-[#a52a2a] transition-all"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-white mt-4">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-[#01411C] font-semibold hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
