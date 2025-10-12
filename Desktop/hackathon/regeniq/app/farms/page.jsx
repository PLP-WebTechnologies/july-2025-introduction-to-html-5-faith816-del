"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import AuthCheck from "../components/AuthCheck";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function FarmsPage() {
  const [farms, setFarms] = useState([]);
  const [newFarm, setNewFarm] = useState({
    name: "",
    location: "",
    size: "",
    longitude: "",
    latitude: "",
  });
  const [editingFarm, setEditingFarm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // 🧠 Fetch user + their farms
  useEffect(() => {
    const fetchUserAndFarms = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from("farms")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) console.error(error);
        else setFarms(data || []);
      }
    };

    fetchUserAndFarms();
  }, []);

  // ➕ Add new farm
  const addFarm = async () => {
    if (!newFarm.name || !newFarm.location) return alert("Please fill name and location.");

    setLoading(true);
    const { data, error } = await supabase.from("farms").insert([
      {
        name: newFarm.name,
        location: newFarm.location,
        size: newFarm.size,
        longitude: newFarm.longitude,
        latitude: newFarm.latitude,
        user_id: user.id,
      },
    ]);

    if (error) alert("Failed to add farm.");
    else {
      setFarms((prev) => [...prev, ...data]);
      setNewFarm({ name: "", location: "", size: "", longitude: "", latitude: "" });
    }
    setLoading(false);
  };

  // 📝 Edit farm
  const startEdit = (farm) => setEditingFarm(farm);

  const saveEdit = async () => {
    const { error } = await supabase
      .from("farms")
      .update({
        name: editingFarm.name,
        location: editingFarm.location,
        size: editingFarm.size,
        longitude: editingFarm.longitude,
        latitude: editingFarm.latitude,
      })
      .eq("id", editingFarm.id);

    if (error) alert("Update failed.");
    else {
      setFarms((prev) =>
        prev.map((f) => (f.id === editingFarm.id ? editingFarm : f))
      );
      setEditingFarm(null);
    }
  };

  // ❌ Delete
  const deleteFarm = async (id) => {
    const { error } = await supabase.from("farms").delete().eq("id", id);
    if (error) alert("Delete failed.");
    else setFarms((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <AuthCheck>
      <main className="min-h-screen p-6 text-[#01411C]" style={{ backgroundColor: "#B2AC88" }}>
        <section className="max-w-4xl mx-auto bg-white/80 p-6 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold mb-2">🌱 Farm Insights</h1>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Welcome to your Farm Insights dashboard — a space designed to help you manage and monitor all your farms effortlessly.
             Each farm you add is securely linked to your account and can be tracked from anywhere, even if it’s located miles or counties away.
              By storing your farm’s name, size, and exact GPS coordinates (latitude and longitude), RegenIQ empowers you to visualize, update,
               and manage your farms remotely with accuracy and ease.
            This page helps you manage and track all your farms in one place. 
            As a farmer, keeping accurate details about your farm — including its 
            location, size, and coordinates — is essential for planning, mapping, 
            and monitoring productivity. By updating your farm information here, 
            you build a clearer picture of your land and make data-driven decisions 
            for sustainable growth.  
          </p>

          {/* Add Farm Form */}
          <div className="flex flex-col gap-3 mb-6">
            <input
              type="text"
              placeholder="Farm name"
              value={newFarm.name}
              onChange={(e) => setNewFarm({ ...newFarm, name: e.target.value })}
              className="p-3 rounded-lg border border-gray-300"
            />
            <input
              type="text"
              placeholder="Location"
              value={newFarm.location}
              onChange={(e) => setNewFarm({ ...newFarm, location: e.target.value })}
              className="p-3 rounded-lg border border-gray-300"
            />
            <input
              type="text"
              placeholder="Size (optional)"
              value={newFarm.size}
              onChange={(e) => setNewFarm({ ...newFarm, size: e.target.value })}
              className="p-3 rounded-lg border border-gray-300"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Longitude"
                value={newFarm.longitude}
                onChange={(e) => setNewFarm({ ...newFarm, longitude: e.target.value })}
                className="p-3 rounded-lg border border-gray-300"
              />
              <input
                type="text"
                placeholder="Latitude"
                value={newFarm.latitude}
                onChange={(e) => setNewFarm({ ...newFarm, latitude: e.target.value })}
                className="p-3 rounded-lg border border-gray-300"
              />
            </div>
            <button
              onClick={addFarm}
              disabled={loading}
              className={`p-3 rounded-lg font-semibold ${
                loading ? "bg-gray-400" : "bg-[#01411C] text-white hover:bg-[#013d17]"
              }`}
            >
              {loading ? "Adding..." : "Add Farm"}
            </button>
          </div>

          {/* Farms List */}
          <h2 className="text-2xl font-bold mb-3">🌾 My Farms</h2>
          {farms.length === 0 ? (
            <p className="text-center text-gray-700 italic">No farms yet. Add your first one!</p>
          ) : (
            <ul className="space-y-3">
              {farms.map((farm) => (
                <li
                  key={farm.id}
                  className="bg-[#E8EDDE] p-4 rounded-lg shadow flex flex-col sm:flex-row sm:items-center sm:justify-between"
                >
                  {editingFarm?.id === farm.id ? (
                    <div className="flex flex-col gap-2 w-full">
                      <input
                        type="text"
                        value={editingFarm.name}
                        onChange={(e) =>
                          setEditingFarm({ ...editingFarm, name: e.target.value })
                        }
                        className="p-2 rounded border"
                      />
                      <input
                        type="text"
                        value={editingFarm.location}
                        onChange={(e) =>
                          setEditingFarm({ ...editingFarm, location: e.target.value })
                        }
                        className="p-2 rounded border"
                      />
                      <input
                        type="text"
                        value={editingFarm.size}
                        onChange={(e) =>
                          setEditingFarm({ ...editingFarm, size: e.target.value })
                        }
                        className="p-2 rounded border"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={editingFarm.longitude}
                          onChange={(e) =>
                            setEditingFarm({ ...editingFarm, longitude: e.target.value })
                          }
                          className="p-2 rounded border"
                        />
                        <input
                          type="text"
                          value={editingFarm.latitude}
                          onChange={(e) =>
                            setEditingFarm({ ...editingFarm, latitude: e.target.value })
                          }
                          className="p-2 rounded border"
                        />
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={saveEdit}
                          className="px-4 py-2 bg-green-700 text-white rounded-lg"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingFarm(null)}
                          className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h3 className="font-semibold text-lg">{farm.name}</h3>
                        <p className="text-sm text-gray-700">
                          📍 {farm.location} — {farm.size && `${farm.size} acres`}
                        </p>
                        <p className="text-xs text-gray-600">
                          🌐 {farm.longitude || "N/A"} , {farm.latitude || "N/A"}
                        </p>
                      </div>
                      <div className="flex gap-3 mt-3 sm:mt-0">
                        <button
                          onClick={() => startEdit(farm)}
                          className="text-blue-700 hover:text-blue-900 font-bold"
                        >
                          ✏ Edit
                        </button>
                        <button
                          onClick={() => deleteFarm(farm.id)}
                          className="text-[#800020] hover:text-red-700 font-bold"
                        >
                          ✖ Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </AuthCheck>
  );
}