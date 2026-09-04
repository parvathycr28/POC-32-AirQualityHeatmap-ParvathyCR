"use client";
import { useEffect ,useState} from "react";

import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import {
  getPopulation,
  type AirQualityFeature,
} from "../lib/api";

type LeafletMapProps = {
  features: AirQualityFeature[];
  pollutant: string;
  onCitySelect: (city: string) => void;
};
function FitMapToFeatures({
  features,
}: {
  features: AirQualityFeature[];
}) {
  const map = useMap();

  useEffect(() => {
    const points = features
      .map((feature) => {
        const coordinates = feature.geometry?.coordinates;

        if (
          !Array.isArray(coordinates) ||
          coordinates.length < 2
        ) {
          return null;
        }

        const [longitude, latitude] = coordinates;

        if (
          !Number.isFinite(longitude) ||
          !Number.isFinite(latitude)
        ) {
          return null;
        }

        return [latitude, longitude] as [
          number,
          number
        ];
      })
      .filter(
        (
          point
        ): point is [number, number] => point !== null
      );

    if (points.length === 0) {
      return;
    }

    map.fitBounds(points, {
      padding: [40, 40],
      maxZoom: 4,
    });
  }, [features, map]);

  return null;
}
export default function LeafletMap({
  features,
  pollutant,
  onCitySelect,
}: LeafletMapProps) {
    const [populationByPoint, setPopulationByPoint] = useState<
    Record<string, number | null>
  >({});
  return (
    <MapContainer
      center={[20, 0]}
      zoom={5}
      className="h-full w-full"
    >
      <TileLayer
  attribution='&copy; OpenStreetMap contributors &copy; CARTO'
  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
/>
      <FitMapToFeatures features={features} />
  {features
    .filter((feature) => {
      const value = feature.properties.value;
      const coordinates = feature.geometry?.coordinates;

      return (
        Number.isFinite(value) &&
        value >= 0 &&
        Array.isArray(coordinates) &&
        coordinates.length >= 2 &&
        Number.isFinite(coordinates[0]) &&
        Number.isFinite(coordinates[1])
      );
    })
    .map((feature, index) => {
      const {
        city,
        country,
        value,
        unit,
        timestamp,
        population,
        exposure_score,
        regional_average,
        percentage_above_regional_average,
        source,
      } = feature.properties;

      const [longitude, latitude] = feature.geometry.coordinates;

      return (
        <CircleMarker
          key={`${city}-${timestamp}-${latitude}-${longitude}-${index}`}
          center={[latitude, longitude]}
          radius={8}
          pathOptions={{
            color: "#FFFFFF",
            weight: 2,
            fillColor:"#38BDF8",   
            fillOpacity: 0.9,
          }}
          eventHandlers={{
            click: () => {
              onCitySelect(city);
            },
          }}
        >
        <Popup
  eventHandlers={{
    add: async () => {
      const key = `${latitude},${longitude}`;

      if (populationByPoint[key] !== undefined) {
        return;
      }

      const population = await getPopulation(
        latitude,
        longitude
      );

      setPopulationByPoint((current) => ({
        ...current,
        [key]: population,
      }));
    },
  }}
>
<div className="h-full w-full overflow-hidden rounded-xl border border-[#1F2937] bg-[#030712] p-4 text-white">
  <div className="text-lg font-semibold">
    {city}
  </div>

  <div className="text-sm text-slate-300">
    {country}
  </div>

  <div className="mt-2">
    {pollutant}: {value} {unit}
  </div>

  <div>
    Exposure score:{" "}
    {exposure_score ?? "—"}
  </div>

  <div>
    Population:{" "}
    {populationByPoint[
      `${latitude},${longitude}`
    ] !== undefined
      ? populationByPoint[
          `${latitude},${longitude}`
        ] !== null
        ? Math.round(
            populationByPoint[
              `${latitude},${longitude}`
            ] as number
          ).toLocaleString()
        : "Unavailable"
      : "Loading..."}
  </div>

  <div>
    Regional average:{" "}
    {regional_average ?? "—"} {unit}
  </div>

  <div>
    Above regional average:{" "}
    {percentage_above_regional_average !==
    undefined
      ? `${percentage_above_regional_average.toFixed(1)}%`
      : "—"}
  </div>

  <div>
    Source: {source ?? "Unknown"}
  </div>
</div>
        </Popup>
      </CircleMarker>
    );
  })}
  </MapContainer>
);
}
