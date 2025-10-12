"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { supabase } from "../../lib/supabaseClient";

// ✅ Custom green marker icon
const greenIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});

export default function ClientMap() {
  const [farms, setFarms] = useState([]);

  useEffect(() => {
    fetchFarms();
  }, []);

  async function fetchFarms() {
    const { data, error } = await supabase
      .from("farms")
      .select("id, name, location, latitude, longitude, created_at, user_id")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching farms:", error.message);
      return;
    }

    setFarms(data || []);
  }

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={[-1.286389, 36.817223]} // Kenya default center (Nairobi)
        zoom={6}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 🟢 Plot all farms */}
        {farms.map((farm) => {
          if (!farm.latitude || !farm.longitude) return null;

          return (
            <Marker
              key={farm.id}
              position={[parseFloat(farm.latitude), parseFloat(farm.longitude)]}
              icon={greenIcon}
            >
              <Popup>
                <div className="text-sm text-[#01411C] font-medium">
                  <strong>{farm.name}</strong>
                  <br />
                  📍 {farm.location}
                  <br />
                  👤 Private Owner
                  <br />
                  🕒 {new Date(farm.created_at).toLocaleDateString()}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}