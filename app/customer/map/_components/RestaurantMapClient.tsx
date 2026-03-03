"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Utensils, MapPin, Navigation } from "lucide-react";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

import type { Restaurant } from "../../../_components/RestaurantMapSheet";

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

function makeRestaurantIcon() {
  return L.divIcon({
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
}

function makeUserIcon() {
  return L.divIcon({
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
          <MapPin
            size={32}
            fill="#E87A5D"
            fillOpacity={0.3}
            strokeWidth={2.5}
          />
        </div>
        <style>{`@keyframes ping { 75%, 100% { transform: scale(1.8); opacity: 0; } }`}</style>
      </div>,
    ),
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -35],
  });
}

function FitToSelection({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], 15, { animate: true });
  }, [map, center.lat, center.lng]);
  return null;
}

function Routing({
  userLocation,
  destination,
  restaurantIcon,
  userIcon,
}: {
  userLocation: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  restaurantIcon: L.DivIcon;
  userIcon: L.DivIcon;
}) {
  const map = useMap();
  const routingControlRef = useRef<any>(null);

  useEffect(() => {
    if (!map || !userLocation || !destination) return;

    const LRouting = (L as any).Routing;
    const control = LRouting.control({
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

    routingControlRef.current = control;

    return () => {
      if (!routingControlRef.current) return;
      try {
        routingControlRef.current.setWaypoints([]);
        if (map?.getContainer()) map.removeControl(routingControlRef.current);
      } catch {
      } finally {
        routingControlRef.current = null;
      }
    };
  }, [map, userLocation, destination, restaurantIcon, userIcon]);

  return null;
}

export default function RestaurantMapClient({
  restaurantId,
  restaurants,
}: {
  restaurantId: string | null;
  restaurants: Restaurant[];
}) {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const restaurantIcon = useMemo(() => makeRestaurantIcon(), []);
  const userIcon = useMemo(() => makeUserIcon(), []);

  const selected = useMemo(() => {
    if (!restaurantId) return null;
    return restaurants.find((r) => r._id === restaurantId) ?? null;
  }, [restaurantId, restaurants]);

  // derive destination
  const destination = useMemo(() => {
    if (!selected?.location?.coordinates) return null;
    const [lng, lat] = selected.location.coordinates;
    return { lat, lng };
  }, [selected]);

  // geolocation
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

  // fallback center if no selection
  const defaultCenter: [number, number] = [27.7172, 85.324];

  if (!selected || !destination) {
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-500">
        Select a restaurant to view it on the map.
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <MapContainer
        center={defaultCenter}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* ✅ Auto focus map on selected restaurant */}
        <FitToSelection center={destination} />

        {/* ✅ Only one restaurant marker */}
        <Marker
          position={[destination.lat, destination.lng]}
          icon={restaurantIcon}
        >
          <Popup>
            <div className="p-1 text-center">
              <h3 className="font-bold text-gray-800">{selected.name}</h3>
              <p className="text-xs text-gray-500">{selected.address}</p>
              <p className="text-xs text-[#E87A5D] mt-1 font-semibold flex items-center justify-center gap-1">
                <Navigation size={12} /> Showing Selected
              </p>
            </div>
          </Popup>
        </Marker>

        {/* user marker */}
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

        {/* route */}
        {userLocation && (
          <Routing
            userLocation={userLocation}
            destination={destination}
            restaurantIcon={restaurantIcon}
            userIcon={userIcon}
          />
        )}
      </MapContainer>
    </div>
  );
}
