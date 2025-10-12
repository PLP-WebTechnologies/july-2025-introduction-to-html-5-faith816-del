"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert("❌ " + error.message);
    } else {
      alert("✅ Signup successful! Check your email to confirm your account.");
      router.push("/login");
    }
    setLoading(false);
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-6 relative"
      style={{
        backgroundImage: "url('/peppers.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Signup Card */}
      <div className="bg-white/25 backdrop-blur-md border border-white/30 rounded-2xl p-8 max-w-md w-full shadow-lg mt-24">
        <h1 className="text-3xl font-bold text-center text-[#01411C] mb-6">
          🌿 Create Your RegenIQ Account
        </h1>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-[#9caf88]/80 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-[#01411C]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-[#9caf88]/80 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-[#01411C]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#800020] text-white py-3 rounded-lg font-bold hover:bg-[#a52a2a] transition-all"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-white mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-[#01411C] font-semibold hover:underline">
            Log in
          </a>
        </p>
      </div>
    </main>
  );
}
