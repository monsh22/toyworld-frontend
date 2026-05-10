import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix iconos de leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const storeIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const deliveryIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface Props {
  deliveryAddress?: string;
  deliveryCity?: string;
  showStore?: boolean;
}

// Coordenadas de ciudades mexicanas
const CITY_COORDS: Record<string, [number, number]> = {
  "cdmx": [19.4326, -99.1332],
  "ciudad de mexico": [19.4326, -99.1332],
  "guadalajara": [20.6597, -103.3496],
  "monterrey": [25.6866, -100.3161],
  "puebla": [19.0414, -98.2063],
  "tijuana": [32.5149, -117.0382],
  "leon": [21.1221, -101.6824],
  "juarez": [31.6904, -106.4245],
  "tuxtla": [16.7521, -93.1152],
  "tuxtla gutierrez": [16.7521, -93.1152],
  "merida": [20.9674, -89.5926],
  "cancun": [21.1619, -86.8515],
  "queretaro": [20.5888, -100.3899],
  "default": [23.6345, -102.5528],
};

function getCityCoords(city: string): [number, number] {
  const key = city?.toLowerCase().trim() || "";
  for (const [name, coords] of Object.entries(CITY_COORDS)) {
    if (key.includes(name)) return coords;
  }
  return CITY_COORDS["default"];
}

// Coordenadas de la tienda ToyWorld (Tuxtla Gutiérrez)
const STORE_COORDS: [number, number] = [16.7521, -93.1152];

export default function MapView({ deliveryAddress, deliveryCity, showStore = true }: Props) {
  const deliveryCoords = deliveryCity ? getCityCoords(deliveryCity) : null;
  const center: [number, number] = deliveryCoords || STORE_COORDS;

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-card" style={{ height: "300px" }}>
      <MapContainer center={center} zoom={deliveryCoords ? 12 : 5} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {showStore && (
          <Marker position={STORE_COORDS} icon={storeIcon}>
            <Popup>
              <div className="text-sm font-bold">🧸 ToyWorld</div>
              <div className="text-xs text-gray-500">Tienda Principal</div>
              <div className="text-xs">Tuxtla Gutiérrez, Chiapas</div>
            </Popup>
          </Marker>
        )}
        {deliveryCoords && (
          <Marker position={deliveryCoords} icon={deliveryIcon}>
            <Popup>
              <div className="text-sm font-bold">📦 Destino de envío</div>
              <div className="text-xs text-gray-500">{deliveryAddress}</div>
              <div className="text-xs">{deliveryCity}</div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
