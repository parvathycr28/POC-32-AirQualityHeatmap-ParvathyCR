"use client";

import dynamic from "next/dynamic";

import type { AirQualityFeature } from "../lib/api";

type AirQualityMapProps = {
  features: AirQualityFeature[];
  pollutant: string;
  onCitySelect: (city: string) => void;
};

const Map = dynamic(
  () => import("./leaflet-map"),
  {
    ssr: false,
  }
);

export default function AirQualityMap({
  features,
  pollutant,
  onCitySelect,
}: AirQualityMapProps) {
  return (
    <div className="h-full w-full">
      <Map
        features={features}
        pollutant={pollutant}
        onCitySelect={onCitySelect}
      />
    </div>
  );
}