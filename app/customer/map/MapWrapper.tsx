"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("./_components/Map"), {
  ssr: false,
});

export default function MapWrapper({
  restaurants,
}: {
  restaurants: any[];
}) {
  return <Map restaurants={restaurants} />;
}