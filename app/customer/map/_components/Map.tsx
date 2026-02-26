"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Utensils, MapPin, Navigation, X } from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
}

const restaurantIcon = L.divIcon({
  html: renderToStaticMarkup(
    <div
      style={{
        background: "linear-gradient(135deg, #E87A5D, #F6B88F)",
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        border: "2px solid white",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
      }}
    >
      <Utensils size={20} strokeWidth={2.5} />
    </div>,
  ),
  className: "",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -20],
});

const userIcon = L.divIcon({
  html: renderToStaticMarkup(
    <div className="relative">
      <div
        style={{
          position: "absolute",
          width: "40px",
          height: "40px",
          backgroundColor: "#E87A5D",
          borderRadius: "50%",
          opacity: 0.4,
          transform: "translate(-5px, -5px)",
          animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        }}
      />
      <div style={{ position: "relative", color: "#E87A5D" }}>
        <MapPin size={32} fill="#E87A5D" fillOpacity={0.3} strokeWidth={2.5} />
      </div>
      <style>{`@keyframes ping { 75%, 100% { transform: scale(1.8); opacity: 0; } }`}</style>
    </div>,
  ),
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -35],
});

type Restaurant = {
  _id: string;
  name: string;
  address?: string;
  location?: { type: "Point"; coordinates: [number, number] }; // [lng, lat]
};

function Routing({
  userLocation,
  destination,
}: {
  userLocation: { lat: number; lng: number };
  destination: { lat: number; lng: number };
}) {
  const map = useMap();
  const routingControlRef = useRef<any>(null);

  useEffect(() => {
    if (!map || !userLocation || !destination) return;

    const LRouting = (L as any).Routing;

    const routingControl = LRouting.control({
      waypoints: [
        L.latLng(userLocation.lat, userLocation.lng),
        L.latLng(destination.lat, destination.lng),
      ],
      createMarker: (i: number, waypoint: any) =>
        L.marker(waypoint.latLng, {
          draggable: false,
          icon: i === 0 ? userIcon : restaurantIcon,
        }),
      lineOptions: {
        styles: [{ color: "#E87A5D", weight: 6, opacity: 0.8 }],
        extendToWaypoints: true,
      },
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
    }).addTo(map);

    routingControlRef.current = routingControl;

    return () => {
      if (!routingControlRef.current) return;
      const control = routingControlRef.current;
      try {
        control.setWaypoints([]);
        if (map && map.getContainer()) map.removeControl(control);
      } catch {
      } finally {
        routingControlRef.current = null;
      }
    };
  }, [map, userLocation, destination]);

  return null;
}

function FlyTo({ center }: { center: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (!center) return;
    map.flyTo([center.lat, center.lng], 16, { animate: true, duration: 0.8 });
  }, [map, center?.lat, center?.lng]);
  return null;
}

export default function RestaurantMap({
  restaurants,
}: {
  restaurants: Restaurant[];
}) {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [selectedRestaurant, setSelectedRestaurant] = useState<{
    id: string;
    lat: number;
    lng: number;
  } | null>(null);

  const popupRefs = useRef<Record<string, L.Marker>>(Object.create(null));

  const defaultCenter: [number, number] = [27.7172, 85.324];

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      (err) => console.error(err),
    );
  }, []);

  const validRestaurants = useMemo(
    () =>
      restaurants.filter(
        (r) => r.location?.coordinates && r.location.coordinates.length === 2,
      ),
    [restaurants],
  );

  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return validRestaurants
      .filter((r) => r.name?.toLowerCase().includes(q))
      .slice(0, 8);
  }, [searchQuery, validRestaurants]);

  const handlePickRestaurant = (r: Restaurant) => {
    const [lng, lat] = r.location!.coordinates;
    setSelectedRestaurant({ id: r._id, lat, lng });
    setSearchQuery(r.name);
    setShowSuggestions(false);

    setTimeout(() => {
      const marker = popupRefs.current[r._id];
      marker?.openPopup?.();
    }, 50);
  };

  const selectedCenter = selectedRestaurant
    ? { lat: selectedRestaurant.lat, lng: selectedRestaurant.lng }
    : null;

  return (
    <div className="relative isolate z-0 rounded-3xl overflow-hidden shadow-2xl border border-[#E87A5D]/20">
      <div className="absolute top-6 left-6 z-1000 w-85 bg-linear-to-r from-[#E87A5D]/10 to-[#F6B88F]/20 backdrop-blur-md rounded-2xl px-5 py-5 border border-[#E87A5D]/30 shadow-md">
        <h1 className="text-xl font-bold text-gray-800 mb-1">Restaurant Map</h1>
        <p className="text-[12px] text-gray-600 leading-relaxed mb-3">
          Search and tap a result to zoom like Google Maps.
        </p>

        {selectedRestaurant && (
          <button
            onClick={() => setSelectedRestaurant(null)}
            className="mt-3 text-[10px] uppercase tracking-wider font-bold text-[#E87A5D] hover:text-[#d46a4f] transition-colors"
          >
            ✕ Clear Route
          </button>
        )}
      </div>

      <div className="absolute top-5 left-200 right-10 bottom-0 z-500">
        <input
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search restaurant name..."
          className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] pl-5 pr-3 text-sm outline-none focus:border-[#E87A5D]"
        />

        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("");
              setShowSuggestions(false);
              setSelectedRestaurant(null);
            }}
            className="absolute right-3 mt-4 text-gray-500 hover:text-gray-700"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-11.5 left-0 right-0 bg-[#FFF8F4] rounded-xl shadow-xl border border-black/10 overflow-hidden z-1100">
            {suggestions.map((r) => (
              <button
                key={r._id}
                onClick={() => handlePickRestaurant(r)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition flex flex-col"
              >
                <span className="text-sm font-bold text-gray-900">
                  {r.name}
                </span>
                {r.address && (
                  <span className="text-xs text-gray-500 line-clamp-1">
                    {r.address}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {showSuggestions && searchQuery.trim() && suggestions.length === 0 && (
          <div className="absolute top-11.5 left-0 right-0 bg-[#FFF8F4] rounded-xl shadow-xl border border-black/10 px-4 py-3 z-1100">
            <p className="text-sm text-gray-500">No matches found.</p>
          </div>
        )}
      </div>

      <MapContainer
        center={defaultCenter}
        zoom={14}
        style={{ height: "650px", width: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <FlyTo center={selectedCenter} />

        {validRestaurants.map((restaurant) => {
          const [lng, lat] = restaurant.location!.coordinates;

          return (
            <Marker
              key={restaurant._id}
              position={[lat, lng]}
              icon={restaurantIcon}
              ref={(ref) => {
                if (ref) popupRefs.current[restaurant._id] = ref as any;
              }}
              eventHandlers={{
                click: () =>
                  userLocation &&
                  setSelectedRestaurant({ id: restaurant._id, lat, lng }),
              }}
            >
              <Tooltip
                direction="top"
                offset={[0, -10]}
                opacity={1}
                permanent
                className="restaurant-label"
              >
                <span className="font-bold">{restaurant.name}</span>
              </Tooltip>

              <Popup className="custom-popup">
                <div className="p-1 text-center">
                  <h3 className="font-bold text-gray-800">{restaurant.name}</h3>
                  {restaurant.address && (
                    <p className="text-xs text-gray-500 mt-1">
                      {restaurant.address}
                    </p>
                  )}
                  <p className="text-xs text-[#E87A5D] mt-1 font-semibold flex items-center justify-center gap-1">
                    <Navigation size={12} /> Route Active
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userIcon}
          >
            <Popup>
              <span className="font-bold text-[#E87A5D]">You are here</span>
            </Popup>
          </Marker>
        )}

        {userLocation && selectedRestaurant && (
          <Routing
            userLocation={userLocation}
            destination={{
              lat: selectedRestaurant.lat,
              lng: selectedRestaurant.lng,
            }}
          />
        )}
      </MapContainer>

      {/* Optional: better tooltip styling */}
      <style jsx global>{`
        .restaurant-label {
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
          border-radius: 10px;
          padding: 4px 8px;
          color: #111827;
          font-size: 12px;
        }
        .restaurant-label:before {
          display: none;
        }
      `}</style>
    </div>
  );
}
