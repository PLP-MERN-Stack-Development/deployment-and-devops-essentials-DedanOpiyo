// src/components/map/MapView.jsx
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
});

export default function MapView({
  latitude,
  longitude,
  zoom = 15,
  height = "300px",
  width = "100%",
}) {
  if (!latitude || !longitude) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center border"
      >
        Location unavailable
      </div>
    );
  }

  return (
    <div style={{ height, width }} className="border rounded overflow-hidden">
      <MapContainer
        center={[latitude, longitude]}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={[latitude, longitude]} />
      </MapContainer>
    </div>
  );
}

// GoogleMap option available in MediReach Streamlining flow... (google docs)
