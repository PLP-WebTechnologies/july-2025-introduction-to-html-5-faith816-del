"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newFarm, setNewFarm] = useState({
    name: "",
    location: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    getUser();
    fetchFarms();
  }, []);

  async function getUser() {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  }

  async function fetchFarms() {
    const { data, error } = await supabase.from("farms").select("*");
    if (error) console.error("Error fetching farms:", error);
    else setFarms(data);
    setLoading(false);
  }

  async function addFarm(e) {
    e.preventDefault();
    if (!user) {
      alert("Please log in to add a farm 🌾");
      router.push("/login");
      return;
    }

    if (!newFarm.name || !newFarm.location)
      return alert("Please fill all fields");

    const { error } = await supabase.from("farms").insert([
      {
        ...newFarm,
        user_id: user.id,
      },
    ]);

    if (error) alert("Error adding farm: " + error.message);
    else {
      alert("🌱 Farm added successfully!");
      setNewFarm({ name: "", location: "", latitude: "", longitude: "" });
      fetchFarms();
    }
  }

  if (loading)
    return (
      <div className="text-center mt-20 text-lg text-black">
        Loading farms...
      </div>
    );

  return (
    <main
      className="min-h-screen bg-cover bg-center p-10"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      {/* 🌿 Intro Section */}
      <section className="bg-white/30 backdrop-blur-lg rounded-2xl p-8 mb-10 max-w-5xl mx-auto shadow-lg text-center">
        <h1 className="text-5xl font-extrabold text-[#01411C] mb-4">
          Welcome to RegenIQ Land Guardian🌿
        </h1>
        <p className="text-black text-lg mb-6">
          RegenIQ Land Guardian, your intelligent partner for modern, sustainable farming. This platform is designed to help farmers understand and manage their land more effectively through data-driven insights.
           With RegenIQ, you can easily register and monitor your farms, track soil health, rainfall, and environmental conditions, and access AI-generated recommendations tailored to your specific location. By combining advanced analytics with real-time data, RegenIQ empowers you to make smarter
            agricultural decisions, increase productivity, and adapt to changing weather patterns.
             Whether you’re a small-scale farmer or managing multiple plots, RegenIQ simplifies farm management, promotes sustainability, and helps secure a better harvest for the future.
        </p>

        {/* 📺 Embedded Video */}
        <div className="relative w-full aspect-video max-w-3xl mx-auto mb-8">
          <iframe
            className="w-full h-full rounded-xl shadow-lg"
            src="https://www.youtube.com/embed/5qap5aO4i9A"
            title="RegenIQ Intro"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* 🌾 How It Works */}
        <h2 className="text-3xl font-bold text-[#800020] mb-2">How It Works🌾</h2>
        <p className="text-black text-md max-w-2xl mx-auto">
          Once you’ve signed up, you can add your farms — each securely linked
          to your account. Click a farm to view detailed insights like soil
          health, rainfall, and AI crop suggestions. RegenIQ turns data into
          action, helping you manage your land smarter every day. 🌍
        </p>
      </section>

      {/* 🚜 Add Farm (Login Required) */}
      <section className="bg-white/30 backdrop-blur-lg rounded-2xl p-8 max-w-5xl mx-auto shadow-xl border border-[#800020]/50 mb-12">
        <h2 className="text-3xl font-bold text-[#01411C] mb-6 text-center">
          Add a New Farm
        </h2>

        {!user ? (
          <div className="text-center text-lg text-[#800020]">
            Please{" "}
            <button
              onClick={() => router.push("/login")}
              className="underline font-semibold text-[#01411C] hover:text-[#013d17]"
            >
              log in
            </button>{" "}
            to add your farm.
          </div>
        ) : (
          <form onSubmit={addFarm} className="grid gap-4 md:grid-cols-2">
            {["name", "location", "latitude", "longitude"].map((field) => (
              <input
                key={field}
                type={field === "latitude" || field === "longitude" ? "number" : "text"}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className="w-full p-3 rounded-lg bg-[#9caf88]/80 text-black placeholder-black font-semibold focus:outline-none focus:ring-2 focus:ring-[#01411C]"
                value={newFarm[field]}
                onChange={(e) => setNewFarm({ ...newFarm, [field]: e.target.value })}
              />
            ))}
            <button
              type="submit"
              className="w-full mt-4 bg-[#800020] text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 hover:bg-[#a52a2a] transition-all md:col-span-2"
            >
              <span className="text-[#00ff00] text-xl">+</span> Add Farm
            </button>
          </form>
        )}
      </section>

      {/* 🌍 Farms List */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {farms.map((farm) => {
          const isMyFarm = user && farm.user_id === user.id;
          const isGuest = !user;

          return (
            <div
              key={farm.id}
              className="p-6 bg-[#9caf88]/70 rounded-2xl shadow-lg border border-[#3e2723]/60 hover:scale-105 transition-transform backdrop-blur-sm"
            >
              <h2 className="text-2xl font-bold text-white flex justify-between items-center">
                {farm.name}{" "}
                {isMyFarm && <span className="text-yellow-200 text-sm">🌾 My Farm</span>}
              </h2>

              <p className="text-black mt-2 flex items-center gap-1">
                <MapPin size={16} className="text-[#01411C]" /> {farm.location}
              </p>

              {/* Guests see limited info */}
              {!isGuest && (
                <>
                  <p className="text-black text-sm mt-1">
                    Latitude: {farm.latitude}
                  </p>
                  <p className="text-black text-sm">
                    Longitude: {farm.longitude}
                  </p>
                  <p className="text-xs text-black/70 mt-3">
                    Created at: {new Date(farm.created_at).toLocaleString()}
                  </p>
                  <a
                    href={`/farm/${farm.id}`}
                    className="block mt-3 text-center bg-[#01411C] text-white py-2 rounded-lg font-semibold hover:bg-[#013d17] transition"
                  >
                    View Insights
                  </a>
                </>
              )}
            </div>
          );
        })}
      </section>
    </main>
  );
}