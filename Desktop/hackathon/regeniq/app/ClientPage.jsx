"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { MapPin } from "lucide-react"; // location icon

export default function ClientPage({ user }) {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newFarm, setNewFarm] = useState({
    name: "",
    location: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    fetchFarms();
  }, []);

  async function fetchFarms() {
    const { data, error } = await supabase.from("farms").select("*");
    if (error) console.error("Error fetching farms:", error);
    else setFarms(data);
    setLoading(false);
  }

  async function addFarm(e) {
    e.preventDefault();
    if (!newFarm.name || !newFarm.location)
      return alert("Please fill all fields");

    const { error } = await supabase.from("farms").insert([newFarm]);
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
      className="min-h-screen flex flex-col items-center justify-start p-6"
      style={{
        backgroundImage: "url('/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-8 max-w-5xl w-full shadow-lg">
        <h1 className="text-5xl font-extrabold text-center text-[#01411C] drop-shadow-lg mb-10">
          🌿🪻 <span className="text-black">RegenIQ</span> Land Guardian
        </h1>

        {/* Add Farm Form */}
        <form
          onSubmit={addFarm}
          className="mb-12 p-6 rounded-2xl bg-white/30 backdrop-blur-md shadow-xl space-y-4 border border-[#800020]/40"
        >
          <h2 className="text-2xl font-bold text-black mb-4">Add New Farm</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              type="text"
              placeholder="Farm Name"
              className="w-full p-3 rounded-lg bg-[#9caf88]/80 text-black placeholder-black font-semibold focus:outline-none focus:ring-2 focus:ring-[#01411C]"
              value={newFarm.name}
              onChange={(e) =>
                setNewFarm({ ...newFarm, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Location"
              className="w-full p-3 rounded-lg bg-[#9caf88]/80 text-black placeholder-black font-semibold focus:outline-none focus:ring-2 focus:ring-[#01411C]"
              value={newFarm.location}
              onChange={(e) =>
                setNewFarm({ ...newFarm, location: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Latitude"
              className="w-full p-3 rounded-lg bg-[#9caf88]/80 text-black placeholder-black font-semibold focus:outline-none focus:ring-2 focus:ring-[#01411C]"
              value={newFarm.latitude}
              onChange={(e) =>
                setNewFarm({ ...newFarm, latitude: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Longitude"
              className="w-full p-3 rounded-lg bg-[#9caf88]/80 text-black placeholder-black font-semibold focus:outline-none focus:ring-2 focus:ring-[#01411C]"
              value={newFarm.longitude}
              onChange={(e) =>
                setNewFarm({ ...newFarm, longitude: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            className="w-full mt-4 bg-[#800020] text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 hover:bg-[#a52a2a] transition-all"
          >
            <span className="text-[#00ff00] text-xl">+</span> Add Farm
          </button>
        </form>

        {/* Display Farms */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {farms.map((farm) => (
            <div
              key={farm.id}
              className="p-6 bg-[#9caf88]/70 rounded-2xl shadow-lg border border-[#3e2723]/60 hover:scale-105 transition-transform"
            >
              <h2 className="text-2xl font-bold text-white">{farm.name}</h2>
              <p className="text-black mt-2 flex items-center gap-1">
                <MapPin size={16} className="text-[#01411C]" /> {farm.location}
              </p>
              <p className="text-black text-sm mt-1">
                Latitude: {farm.latitude}
              </p>
              <p className="text-black text-sm">
                Longitude: {farm.longitude}
              </p>
              <p className="text-xs text-black/70 mt-3">
                Created at: {new Date(farm.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
