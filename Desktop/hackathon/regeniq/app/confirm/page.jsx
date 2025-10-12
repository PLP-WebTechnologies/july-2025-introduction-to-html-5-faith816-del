"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function ConfirmEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type");

    if (token_hash && type) {
      supabase.auth
        .verifyOtp({ token_hash, type })
        .then(({ data, error }) => {
          if (error) {
            console.error(error);
            setStatus("Verification failed. Please try again.");
          } else {
            setStatus("✅ Email confirmed successfully!");
            setTimeout(() => router.push("/login"), 3000);
          }
        });
    } else {
      setStatus("Invalid verification link.");
    }
  }, [searchParams, router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#9caf88] text-black p-6">
      <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-8 max-w-md w-full shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">RegenIQ 🌿</h1>
        <p>{status}</p>
      </div>
    </main>
  );
}
