"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Utensils, Navigation, X, Locate, Loader2 } from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

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

const selectedRestaurantIcon = L.divIcon({
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
        border: "3px solid white",
        boxShadow:
          "0 4px 12px rgba(0,0,0,0.25), 0 0 16px 2px rgba(232,122,93,0.4)",
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
    <div style={{ position: "relative", width: "46px", height: "46px" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#E87A5D",
          borderRadius: "50%",
          animation: "pulse-ring 2s ease-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "14px",
          left: "14px",
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          backgroundColor: "#E87A5D",
          border: "3px solid white",
          boxShadow: "0 0 8px rgba(232,122,93,0.4)",
        }}
      />
    </div>,
  ),
  className: "",
  iconSize: [46, 46],
  iconAnchor: [23, 23],
});

type Restaurant = {
  _id: string;
  name: string;
  address?: string;
  location?: { type: "Point"; coordinates: [number, number] };
};

type LatLng = { lat: number; lng: number };

function FlyTo({ center, zoom }: { center: LatLng | null; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (!center) return;
    map.flyTo([center.lat, center.lng], zoom ?? 16, {
      animate: true,
      duration: 0.8,
    });
  }, [map, center?.lat, center?.lng, zoom]);
  return null;
}

function FitBounds({ a, b }: { a: LatLng | null; b: LatLng | null }) {
  const map = useMap();
  useEffect(() => {
    if (!a || !b) return;
    const bounds = L.latLngBounds([a.lat, a.lng], [b.lat, b.lng]);
    map.fitBounds(bounds, { padding: [80, 80], animate: true });
  }, [map, a?.lat, a?.lng, b?.lat, b?.lng]);
  return null;
}

export default function RestaurantMap({
  restaurants,
}: {
  restaurants: Restaurant[];
}) {
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const [selectedRestaurant, setSelectedRestaurant] = useState<{
    id: string;
    name: string;
    address?: string;
    lat: number;
    lng: number;
  } | null>(null);

  const [routePoints, setRoutePoints] = useState<[number, number][]>([]);
  const [routeDistance, setRouteDistance] = useState<string | null>(null);
  const [routeDuration, setRouteDuration] = useState<string | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);

  const [flyTarget, setFlyTarget] = useState<LatLng | null>(null);
  const [fitA, setFitA] = useState<LatLng | null>(null);
  const [fitB, setFitB] = useState<LatLng | null>(null);

  const defaultCenter: [number, number] = [27.7172, 85.324];

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationLoading(false);
      },
      () => setLocationLoading(false),
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

  const fetchRoute = useCallback(async (from: LatLng, to: LatLng) => {
    setRouteLoading(true);
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      const routes = data.routes;
      if (!routes || routes.length === 0) return;

      const geometry = routes[0].geometry.coordinates as [number, number][];
      const distance = routes[0].distance as number;
      const duration = routes[0].duration as number;

      const points: [number, number][] = geometry.map(([lng, lat]) => [
        lat,
        lng,
      ]);

      setRoutePoints(points);
      setRouteDistance(
        distance >= 1000
          ? `${(distance / 1000).toFixed(1)} km`
          : `${Math.round(distance)} m`,
      );
      setRouteDuration(
        duration >= 3600
          ? `${(duration / 3600).toFixed(1)} hr`
          : `${Math.round(duration / 60)} min`,
      );

      // Fit map to show both points
      setFlyTarget(null);
      setFitA(from);
      setFitB(to);
    } catch {
      // silently fail
    } finally {
      setRouteLoading(false);
    }
  }, []);

  const handlePickRestaurant = useCallback(
    (r: Restaurant) => {
      const [lng, lat] = r.location!.coordinates;
      const sel = { id: r._id, name: r.name, address: r.address, lat, lng };
      setSelectedRestaurant(sel);
      setSearchQuery(r.name);
      setShowSuggestions(false);
      searchRef.current?.blur();

      if (userLocation) {
        fetchRoute(userLocation, { lat, lng });
      } else {
        setFlyTarget({ lat, lng });
      }
    },
    [userLocation, fetchRoute],
  );

  const handleMarkerClick = useCallback(
    (r: Restaurant) => {
      handlePickRestaurant(r);
    },
    [handlePickRestaurant],
  );

  const clearSelection = useCallback(() => {
    setSelectedRestaurant(null);
    setRoutePoints([]);
    setRouteDistance(null);
    setRouteDuration(null);
    setSearchQuery("");
    setShowSuggestions(false);
    setFlyTarget(null);
    setFitA(null);
    setFitB(null);
  }, []);

  const goToMyLocation = useCallback(() => {
    if (!userLocation) return;
    setFlyTarget(userLocation);
  }, [userLocation]);

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={defaultCenter}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
        zoomControl={false}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <FlyTo center={flyTarget} />
        <FitBounds a={fitA} b={fitB} />

        {routePoints.length > 0 && (
          <Polyline
            positions={routePoints}
            pathOptions={{
              color: "#E87A5D",
              weight: 5,
              opacity: 0.8,
            }}
          />
        )}

        {validRestaurants.map((restaurant) => {
          const [lng, lat] = restaurant.location!.coordinates;
          const isSelected = selectedRestaurant?.id === restaurant._id;

          return (
            <Marker
              key={restaurant._id}
              position={[lat, lng]}
              icon={isSelected ? selectedRestaurantIcon : restaurantIcon}
              eventHandlers={{
                click: () => handleMarkerClick(restaurant),
              }}
            >
              <Tooltip
                direction="bottom"
                offset={[0, 10]}
                opacity={1}
                permanent
                className="restaurant-label"
              >
                <span
                  style={{
                    fontWeight: isSelected ? 700 : 600,
                    color: isSelected ? "#E87A5D" : "#111827",
                    fontSize: "11px",
                  }}
                >
                  {restaurant.name}
                </span>
              </Tooltip>
            </Marker>
          );
        })}

        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userIcon}
          />
        )}
      </MapContainer>
      <div className="absolute top-4 left-4 z-2000 w-88 max-w-[calc(100%-2rem)] pointer-events-none">
        <div className="rounded-2xl bg-linear-to-r from-[#E87A5D]/10 to-[#F6B88F]/20 backdrop-blur-md px-5 py-5 border border-[#E87A5D]/30 shadow-md">
          <h1 className="text-xl font-bold text-gray-800 mb-1">
            Restaurant Map
          </h1>
          <p className="text-[12px] text-gray-600 leading-relaxed mb-3">
            Search and tap a result to zoom like Google Maps.
          </p>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-1000 w-88 max-w-[calc(100%-2rem)]">
        <div className="relative rounded-[14px] border border-black/10 shadow-lg overflow-visible bg-white/85 backdrop-blur-md">
          <div className="flex items-center">
            <input
              ref={searchRef}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search restaurant name..."
              className="flex-1 h-12 bg-transparent pl-3 pr-3 text-sm outline-none placeholder:text-gray-400"
            />
            {searchQuery && (
              <button
                onClick={clearSelection}
                className="pr-4 text-gray-500 hover:text-gray-700"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div
            className="mt-1 rounded-[14px] border border-black/10 shadow-xl overflow-hidden z-1100"
            style={{ backgroundColor: "#FFF8F4" }}
          >
            {suggestions.map((r, index) => (
              <button
                key={r._id}
                onClick={() => handlePickRestaurant(r)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition flex flex-col"
                style={{
                  borderTop:
                    index > 0 ? "1px solid rgba(0,0,0,0.05)" : undefined,
                }}
              >
                <span className="text-sm font-bold text-gray-900">
                  {r.name}
                </span>
                {r.address && (
                  <span className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                    {r.address}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {showSuggestions && searchQuery.trim() && suggestions.length === 0 && (
          <div
            className="mt-1 rounded-[14px] border border-black/10 shadow-xl px-4 py-3 z-1100"
            style={{ backgroundColor: "#FFF8F4" }}
          >
            <p className="text-sm text-gray-500">No matches found.</p>
          </div>
        )}
      </div>

      {selectedRestaurant && (
        <div className="absolute bottom-6 left-4 right-4 z-1000">
          <div
            className="rounded-[20px] border px-5 py-4 shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, rgba(232,122,93,0.1), rgba(246,184,143,0.2))",
              borderColor: "rgba(232,122,93,0.3)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{
                  background: "linear-gradient(135deg, #E87A5D, #F6B88F)",
                }}
              >
                <Utensils size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-base truncate">
                  {selectedRestaurant.name}
                </h3>
                {selectedRestaurant.address && (
                  <p className="text-xs text-gray-500 truncate">
                    {selectedRestaurant.address}
                  </p>
                )}
              </div>
            </div>

            {routeLoading && (
              <div className="flex justify-center pt-3">
                <Loader2
                  size={20}
                  className="animate-spin"
                  style={{ color: "#E87A5D" }}
                />
              </div>
            )}

            {routeDistance && routeDuration && (
              <div className="flex items-center gap-1.5 mt-3">
                <Navigation size={16} style={{ color: "#E87A5D" }} />
                <span
                  className="text-[13px] font-semibold"
                  style={{ color: "#E87A5D" }}
                >
                  {routeDistance} &middot; {routeDuration}
                </span>
              </div>
            )}

            <button
              onClick={clearSelection}
              className="w-full mt-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
              style={{
                color: "#E87A5D",
                border: "1px solid rgba(232,122,93,0.3)",
                backgroundColor: "transparent",
              }}
            >
              Clear Route
            </button>
          </div>
        </div>
      )}

      {userLocation && !selectedRestaurant && (
        <button
          onClick={goToMyLocation}
          className="absolute bottom-6 right-4 z-1000 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          style={{ color: "#E87A5D" }}
          aria-label="Go to my location"
        >
          <Locate size={20} />
        </button>
      )}

      {locationLoading && (
        <div className="absolute bottom-6 right-4 z-1000 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center">
          <Loader2
            size={20}
            className="animate-spin"
            style={{ color: "#E87A5D" }}
          />
        </div>
      )}

      <style jsx global>{`
        .restaurant-label {
          background: rgba(255, 255, 255, 0.92) !important;
          border: 1px solid rgba(0, 0, 0, 0.08) !important;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12) !important;
          border-radius: 10px !important;
          padding: 2px 6px !important;
          white-space: nowrap !important;
        }
        .restaurant-label::before {
          display: none !important;
        }
        @keyframes pulse-ring {
          0% {
            opacity: 0.4;
            transform: scale(0.8);
          }
          100% {
            opacity: 0;
            transform: scale(1.8);
          }
        }
      `}</style>
    </div>
  );
}
