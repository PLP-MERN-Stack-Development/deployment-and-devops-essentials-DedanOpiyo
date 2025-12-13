// src/components/map/LocationPicker.jsx
import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
});

export default function OSMLocationPicker({ onSelect }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [marker, setMarker] = useState(null);
  const [details, setDetails] = useState(null);

  // Search autocomplete
  const searchPlaces = async (value) => {
    setQuery(value);

    if (!value) return setSuggestions([]);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        value
      )}&addressdetails=1&limit=5`
    );

    const data = await res.json();
    setSuggestions(data);
  };

  // When user selects a place from dropdown
  const handleSelectPlace = async (place) => {
    setSuggestions([]);
    setQuery(place.display_name);

    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);

    setMarker([lat, lon]);
    setDetails(place);

    onSelect({
      name: place.display_name,
      latitude: lat,
      longitude: lon,
      address: place.display_name,
    });
  };

  return (
    <div className="space-y-4">
      {/* Autocomplete input */}
      <div className="relative z-20">
        <input
          value={query}
          className="w-full border p-2 rounded"
          placeholder="Search location..."
          onChange={(e) => searchPlaces(e.target.value)}
        />

        {suggestions.length > 0 && (
          <ul className="absolute bg-white border rounded w-full shadow mt-1 z-50 max-h-60 overflow-auto">
            {suggestions.map((place) => (
              <li
                key={place.place_id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectPlace(place)}
              >
                {place.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Map */}
      <div className="h-72 border rounded relative z-0">
        <LeafletClickMap
          marker={marker}
          setMarker={(coords) => {
            setMarker(coords);
            reverseGeocode(coords[0], coords[1], (info) => {
              setDetails(info);
              onSelect({
                name: info.display_name,
                latitude: coords[0],
                longitude: coords[1],
                address: info.display_name,
              });
            });
          }}
        />
      </div>

      {/* Details Panel */}
      {details && (
        <div className="bg-white border p-3 rounded shadow">
          <h3 className="font-bold">Selected Location</h3>
          <p><strong>Address:</strong> {details.display_name}</p>
          <p><strong>Lat:</strong> {marker[0]}</p>
          <p><strong>Lon:</strong> {marker[1]}</p>
        </div>
      )}
    </div>
  );
}

/* ---- Map with click handler ---- */
function LeafletClickMap({ marker, setMarker }) {
  const ClickHandler = () => {
    useMapEvents({
      click(e) {
        setMarker([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={[-1.286389, 36.817223]}
      zoom={12}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler />

      {marker && <Marker position={marker} />}
    </MapContainer>
  );
}

/* ---- Reverse geocode coordinates ---- */
async function reverseGeocode(lat, lon, cb) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
  );
  const data = await res.json();
  cb(data);
}

// GoogleMap option available in MediReach Streamlining flow... (google docs)
// Tutorial: https://www.youtube.com/watch?v=jD6813wGdBA (Leaflet + React)
