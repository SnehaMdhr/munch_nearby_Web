"use client";

import { useEffect, useState, Fragment } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

/* ----------------------------------
   Fix Leaflet default icon problem
----------------------------------- */
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

/* ----------------------------------
   Custom 📍 User Icon
----------------------------------- */
const userIcon = L.divIcon({
  html: `<div style="font-size:32px;">📍</div>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

/* ----------------------------------
   Types
----------------------------------- */
type Restaurant = {
  _id: string;
  name: string;
  address?: string;
  location?: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
};

/* ----------------------------------
   Routing Component
----------------------------------- */
function Routing({
  userLocation,
  destination,
}: {
  userLocation: { lat: number; lng: number };
  destination: { lat: number; lng: number };
}) {
  const map = useMap();

  useEffect(() => {
    if (!userLocation || !destination) return;

    const LRouting = (L as any).Routing;

    const routingControl = LRouting.control({
      waypoints: [
        L.latLng(userLocation.lat, userLocation.lng),
        L.latLng(destination.lat, destination.lng),
      ],
      routeWhileDragging: false,
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{ color: "#2563eb", weight: 5 }],
      },
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [userLocation, destination, map]);

  return null;
}

/* ----------------------------------
   Main Map Component
----------------------------------- */
export default function Map({ restaurants }: { restaurants: Restaurant[] }) {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [selectedRestaurant, setSelectedRestaurant] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const defaultCenter: [number, number] = [27.7172, 85.324];

  /* Get User Location */
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Location error:", error);
      }
    );
  }, []);

  /* Filter Valid Restaurants */
  const validRestaurants = restaurants.filter(
    (r) =>
      r.location &&
      r.location.coordinates &&
      r.location.coordinates.length === 2 &&
      typeof r.location.coordinates[0] === "number" &&
      typeof r.location.coordinates[1] === "number"
  );

  return (
    <MapContainer
      center={defaultCenter}
      zoom={13}
      style={{ height: "600px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Restaurant Markers */}
      {validRestaurants.map((restaurant) => {
        const lng = restaurant.location!.coordinates[0];
        const lat = restaurant.location!.coordinates[1];

        return (
          <Fragment key={restaurant._id}>
            <Marker
              position={[lat, lng]}
              eventHandlers={{
                click: () => {
                  if (userLocation) {
                    setSelectedRestaurant({ lat, lng });
                  }
                },
              }}
            >
              <Popup>
                <strong>{restaurant.name}</strong>
                <br />
                Click to show route
              </Popup>
            </Marker>
          </Fragment>
        );
      })}

      {/* User Location Marker */}
      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={userIcon}
        >
          <Popup>You are here 📍</Popup>
        </Marker>
      )}

      {/* Draw Route */}
      {userLocation && selectedRestaurant && (
        <Routing
          userLocation={userLocation}
          destination={selectedRestaurant}
        />
      )}
    </MapContainer>
  );
}