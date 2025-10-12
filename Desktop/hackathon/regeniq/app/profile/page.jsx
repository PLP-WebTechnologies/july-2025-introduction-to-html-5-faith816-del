"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [farms, setFarms] = useState([]);
  const [regenTokens, setRegenTokens] = useState(0);
  const [loading, setLoading] = useState(true);

  // token history UI
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // On mount: fetch user and everything
  useEffect(() => {
    async function init() {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        router.push("/login");
        return;
      }
      setUser(data.user);
      await fetchProfile(data.user.id);
      await fetchFarms(data.user.id);
      await handleDailyReward(data.user.id);
      setLoading(false);
    }
    init();
  }, []);

  // fetch or create profile (ensures regen_tokens exists)
  async function fetchProfile(userId) {
    const { data, error } = await supabase
      .from("Profile")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!error && data) {
      setProfile(data);
      setRegenTokens(data.regen_tokens ?? 100);
    } else {
      // create minimal profile with default tokens
      await supabase
        .from("Profile")
        .insert([{ user_id: userId, regen_tokens: 100 }]);
      setRegenTokens(100);
    }
  }

  // daily reward: +1 if not claimed today
  async function handleDailyReward(userId) {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("Profile")
      .select("last_claim_date, regen_tokens")
      .eq("user_id", userId)
      .single();

    if (!data || error) return;

    if (data.last_claim_date !== today) {
      const newTokens = (data.regen_tokens || 0) + 1;
      await supabase
        .from("Profile")
        .update({ regen_tokens: newTokens, last_claim_date: today })
        .eq("user_id", userId);
      // record history entry
      await recordTokenChange(userId, 1, "Daily login bonus");
      setRegenTokens(newTokens);
    } else {
      setRegenTokens(data.regen_tokens);
    }
  }

  async function fetchFarms(userId) {
    const { data, error } = await supabase.from("farms").select("*").eq("user_id", userId);
    if (!error) setFarms(data || []);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  // ------------------------
  // TOKEN HISTORY functions
  // ------------------------

  // fetch last N history rows for the logged-in user
  async function fetchTokenHistory(userId, limit = 50) {
    setHistoryLoading(true);
    const { data, error } = await supabase
      .from("token_history")
      .select("id, change, reason, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error loading token history:", error);
      setHistory([]);
    } else {
      setHistory(data || []);
    }
    setHistoryLoading(false);
  }

  // helper: record token change (call from other pages)
  // change: integer (positive or negative), reason: string
  async function recordTokenChange(userId, change, reason) {
    if (!userId) return;
    try {
      await supabase.from("token_history").insert([
        { user_id: userId, change, reason },
      ]);
    } catch (e) {
      console.error("Failed to record token history:", e);
    }
  }

  // UI action: open token history modal and fetch data
  async function openHistory() {
    if (!user) return;
    setHistoryOpen(true);
    await fetchTokenHistory(user.id);
  }

  // ------------------------
  // END TOKEN HISTORY
  // ------------------------

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-gray-600">
        Loading your profile...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7f0] p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#01411C]">🌿 Farmer Profile</h1>
          <div className="flex gap-3">
            <button
              onClick={openHistory}
              className="bg-[#01411C] text-white px-4 py-2 rounded-lg hover:bg-[#013d17]"
            >
              View Token History
            </button>
            <button
              onClick={handleLogout}
              className="bg-[#800020] text-white px-4 py-2 rounded-lg hover:bg-[#a52a2a]"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Profile Info */}
        <section className="bg-[#eaf2e3] p-6 rounded-xl border border-[#9CAF88]">
          <h2 className="text-2xl font-semibold text-[#01411C] mb-3">👤 Personal Info</h2>
          {profile ? (
            <>
              <p><strong>Name:</strong> {profile.full_name || "Not set"}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Location:</strong> {profile.location || "Not provided"}</p>
            </>
          ) : (
            <p className="text-gray-600">Profile not set up yet.</p>
          )}
        </section>

        {/* Regen Tokens */}
        <section className="bg-[#d5e3cd] p-6 rounded-xl border border-[#9CAF88] text-center">
          <h2 className="text-2xl font-semibold text-[#01411C] mb-2">💰 Regen Tokens</h2>
          <p className="text-4xl font-bold text-[#01411C] mb-2">{regenTokens}</p>
          <p className="text-sm text-[#3b3b3b]">
            Earn 1 Regen Token daily when you log in. Uploading a photo to AI costs 10 tokens.
          </p>
          <p className="mt-2 text-[#800020] italic font-medium">🛒 Token Shop — Coming Soon!</p>
        </section>

        {/* AI Buddy Stats */}
        <section className="bg-[#f0ead6] p-6 rounded-xl border border-[#9CAF88]">
          <h2 className="text-2xl font-semibold text-[#01411C] mb-3">🤖 AI Buddy Activity</h2>
          <p>Messages sent: <strong>Coming soon</strong></p>
          <p>Images analyzed: <strong>Coming soon</strong></p>
        </section>

        {/* Farms */}
        <section>
          <h2 className="text-2xl font-semibold text-[#01411C] mb-4">🌾 Your Farms</h2>
          {farms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {farms.map((farm) => (
                <div
                  key={farm.id}
                  className="border border-[#9CAF88] rounded-xl p-4 bg-[#eaf2e3]"
                >
                  <h3 className="text-lg font-semibold">{farm.name}</h3>
                  <p>{farm.location}</p>
                  <p className="text-sm text-gray-600">
                    Lat: {farm.latitude}, Lng: {farm.longitude}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No farms added yet.</p>
          )}
        </section>
      </div>

      {/* Token History Modal */}
      {historyOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Regen Token History</h3>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => setHistoryOpen(false)}
                  className="text-sm text-gray-600 underline"
                >
                  Close
                </button>
              </div>
            </div>

            {historyLoading ? (
              <p>Loading history...</p>
            ) : history.length === 0 ? (
              <p className="text-gray-600">No token history yet.</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {history.map((h) => (
                  <div key={h.id} className="flex justify-between items-start border-b pb-2">
                    <div>
                      <div className="text-sm text-gray-800">{h.reason}</div>
                      <div className="text-xs text-gray-500">{new Date(h.created_at).toLocaleString()}</div>
                    </div>
                    <div className={`text-sm font-semibold ${h.change >= 0 ? "text-green-700" : "text-red-700"}`}>
                      {h.change > 0 ? `+${h.change}` : h.change}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setHistoryOpen(false)}
                className="px-4 py-2 bg-[#01411C] text-white rounded-lg"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}