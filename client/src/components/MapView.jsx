import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import { fetchLogs } from "../utils/api";
import L from "leaflet";

export default function MapView() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs().then((res) => setLogs(res.data || []));
  }, []);

  const positions = logs.map((log) => [log.lat, log.lng]);

  return (
    <div className="h-[400px] w-full rounded shadow overflow-hidden border border-gray-300">
      <MapContainer center={[20.5937, 78.9629]} zoom={4} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={positions} color="blue" />
        {positions.map((pos, i) => (
          <Marker key={i} position={pos} icon={L.icon({ iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png", iconSize: [25, 41], iconAnchor: [12, 41] })}>
            <Popup>
              📍 Lat: {pos[0].toFixed(4)}, Lng: {pos[1].toFixed(4)}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
