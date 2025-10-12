"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import AIBuddy from "../../components/AIBuddy";

export default function FarmDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [farm, setFarm] = useState(null);
  const [weather, setWeather] = useState(null);
  const [soil, setSoil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFarmDetails() {
      setLoading(true);

      const { data: farmData } = await supabase
        .from("farms")
        .select("*")
        .eq("id", id)
        .single();

      const { data: weatherData } = await supabase
        .from("weather_data")
        .select("*")
        .eq("farm_id", id)
        .single();

      const { data: soilData } = await supabase
        .from("soil_data")
        .select("*")
        .eq("farm_id", id)
        .single();

      setFarm(farmData);
      setWeather(weatherData);
      setSoil(soilData);
      setLoading(false);
    }

    if (id) fetchFarmDetails();
  }, [id]);

  if (loading) {
    return (
      <main
        className="min-h-screen flex items-center justify-center text-white text-xl"
        style={{
          backgroundImage: "url('/yourbackground.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <p>Loading farm data...</p>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        backgroundImage: "url('/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#9caf88",
      }}
    >
      <div className="bg-white/25 backdrop-blur-lg border border-white/30 rounded-2xl p-8 max-w-2xl w-full shadow-lg text-black">
        <h1 className="text-3xl font-bold mb-4 text-center text-[#01411C]">
          🌿 {farm?.name || "Farm Details"}
        </h1>

        <p className="text-center text-lg mb-6 font-medium">
          📍 <strong>{farm?.location}</strong>
        </p>

        {/* WEATHER SECTION */}
        <div className="bg-[#9caf88]/50 rounded-xl p-5 mb-6 text-black">
          <h2 className="text-2xl font-semibold mb-3 text-[#01411C]">
            🌤️ Weather Insights
          </h2>
          {weather ? (
            <ul className="space-y-1">
              <li>🌡️ <strong>Temperature:</strong> {weather.temperature}°C</li>
              <li>💧 <strong>Humidity:</strong> {weather.humidity}%</li>
              <li>🌦️ <strong>Rainfall:</strong> {weather.rainfall}mm</li>
            </ul>
          ) : (
            <p>No weather data available yet.</p>
          )}
        </div>

        {/* SOIL SECTION */}
        <div className="bg-[#9caf88]/50 rounded-xl p-5 text-black">
          <h2 className="text-2xl font-semibold mb-3 text-[#01411C]">
            🌱 Soil Insights
          </h2>
          {soil ? (
            <ul className="space-y-1">
              <li>🧪 <strong>pH:</strong> {soil.ph}</li>
              <li>🌾 <strong>Nitrogen (N):</strong> {soil.nitrogen}</li>
              <li>🌻 <strong>Phosphorus (P):</strong> {soil.phosphorus}</li>
              <li>🥔 <strong>Potassium (K):</strong> {soil.potassium}</li>
            </ul>
          ) : (
            <p>No soil data available yet.</p>
          )}
        </div>
{/* 👇 Floating AI chat icon */}
<AIBuddy />
        <button
          onClick={() => router.push("/")}
          className="mt-8 w-full bg-[#800020] hover:bg-[#a52a2a] text-white py-3 rounded-xl font-bold transition-all"
        >
          ← Back to Farms
        </button>
      </div>
    </main>
  );
}