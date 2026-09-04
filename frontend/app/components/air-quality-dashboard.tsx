"use client";

import { useEffect, useState } from "react";

import {
  getAirQuality,
  type AirQualityFeature,
} from "../lib/api";

import AirQualityMap from "./air-quality-map";
import IntelligenceSidebar from "./intelligence-sidebar";
import AirQualityChart from "./air-quality-chart";
import CitySearchSelect from "./city-search-select";
export default function AirQualityDashboard() {
  const [features, setFeatures] = useState<AirQualityFeature[]>([]);

  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  const [pollutant, setPollutant] = useState("pm25");

  const [cityA, setCityA] = useState("");

  const [cityB, setCityB] = useState("");

  const [selectedCity, setSelectedCity] = useState("");
  const cityAData = features.find(
  (feature) => feature.properties.city === cityA
);

const cityBData = features.find(
  (feature) => feature.properties.city === cityB
);
  const downloadSampleData = () => {

  const json = JSON.stringify(features, null, 2);

  const blob = new Blob([json], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = `air-quality-${pollutant}.json`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

  const chartData = features
  .filter(
    (feature) =>
      feature.properties.city === cityA ||
      feature.properties.city === cityB
  )
  .map((feature) => ({
    timestamp: feature.properties.timestamp,
    value: feature.properties.value,
    city: feature.properties.city,
  }))
  .sort(
    (a, b) =>
      new Date(a.timestamp).getTime() -
      new Date(b.timestamp).getTime()
  );

  const cities = Array.from(
  new Set(
    features
      .map(
        (feature) => feature.properties.city
      )
      .filter(Boolean)
  )
).sort((a, b) =>
  a.localeCompare(b)
);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        console.log("AIR QUALITY FUNCTION RUNNING");
        const response = await getAirQuality(pollutant);

        setFeatures(response.features);
        console.log("FEATURE COUNT:", response.features?.length);
        console.log("FIRST FEATURE:", response.features?.[0]);
        console.log("FastAPI air-quality response:", response);
      } catch (err) {
        console.error("Air quality request failed:", err);

        setError("Unable to load air-quality data.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [pollutant]);


  return (
    <main className="min-h-screen bg-[#030712] text-white">
      {/* HEADER */}
      <header className="border-b border-[#1F2937] px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#38BDF8]">
              REAL RAILS / DATA & INTELLIGENCE
            </div>

            <h1 className="mt-2 text-2xl font-semibold">
              Air Quality Heatmap
            </h1>
          </div>

          <div className="text-xs uppercase tracking-wider text-slate-500">
            {loading ? "LOADING DATA" : "LIVE DATA"}
          </div>
        </div>
      </header>

      {/* 70 / 30 LAYOUT */}
      <div className="grid min-h-[calc(100vh-89px)] grid-cols-1 lg:grid-cols-[70%_30%]">
        {/* MAIN STAGE — 70% */}
        <section className="min-w-0 border-b border-[#1F2937] p-5 lg:border-b-0 lg:border-r">

          {/* FILTER BAR */}
          <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                DATA FILTER
              </div>

              <h2 className="mt-1 text-lg font-semibold">
                Air Quality Map
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label
                htmlFor="pollutant"
                className="text-xs uppercase tracking-wider text-slate-500"
              >
                Pollutant
              </label>

              
<select
  value={pollutant}
  onChange={(event) => {
    setPollutant(event.target.value);
  }}
>
  <option value="pm25">PM2.5</option>
  <option value="pm10">PM10</option>
  <option value="no2">NO₂</option>
  <option value="so2">SO₂</option>
  <option value="co">CO</option>
  <option value="o3">O₃</option>
</select>



              <button
                type="button"
                onClick={downloadSampleData}
                disabled={features.length === 0}
                className="rounded-md border border-[#1F2937] bg-[#0B1117] px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-[#38BDF8] hover:text-[#38BDF8] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Download Data
              </button>
              <div className="mt-4 flex flex-wrap items-center gap-3">
  
  <span className="text-xs uppercase tracking-wider text-slate-500">
    Compare
  </span>

  {/* CITY A */}
  <CitySearchSelect
    cities={cities}
    value={cityA}
    onChange={(city) => {
    setCityA(city);
    setSelectedCity(city);
  }}

    placeholder="Search/select city A"
  />

  <span className="text-xs text-slate-600">
    vs
  </span>

  {/* CITY B */}
  <CitySearchSelect
    cities={cities}
    value={cityB}
    onChange={setCityB}
    placeholder="Search/select city B"
  />
</div>
</div>

{cityA && cityB && (
  <div className="mt-4 rounded-lg border border-[#1F2937] bg-[#0B1117] p-4">
    {(() => {
      const featureA = features.find(
        (feature) =>
          feature.properties.city === cityA
      );

      const featureB = features.find(
        (feature) =>
          feature.properties.city === cityB
      );

      if (!featureA || !featureB) {
        return (
          <p className="text-sm text-slate-500">
            Comparison data unavailable.
          </p>
        );
      }

      const difference =
        featureA.properties.value -
        featureB.properties.value;

      const percentage =
        featureB.properties.value !== 0
          ? (difference /
              featureB.properties.value) *
            100
          : 0;

      return (
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-500">
            CITY COMPARISON
          </div>

          <div className="mt-3 grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-slate-400">
                {cityA}
              </div>

              <div className="mt-1 text-2xl font-semibold text-[#38BDF8]">
                {featureA.properties.value}
              </div>

              <div className="text-xs text-slate-500">
                {featureA.properties.unit}
              </div>
            </div>

            <div>
              <div className="text-sm text-slate-400">
                {cityB}
              </div>

              <div className="mt-1 text-2xl font-semibold text-[#818CF8]">
                {featureB.properties.value}
              </div>

              <div className="text-xs text-slate-500">
                {featureB.properties.unit}
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-[#1F2937] pt-3 text-sm text-slate-300">
            {cityA} is{" "}
            <span className="font-semibold text-white">
              {Math.abs(percentage).toFixed(1)}%
            </span>{" "}
            {difference >= 0
              ? "higher"
              : "lower"}{" "}
            than {cityB}.
          </div>
        </div>
      );
    })()}
  </div>
)}


            </div>
          

          {/* MAP CARD */}
          <div className="h-[600px] min-h-[500px] overflow-hidden rounded-xl border border-[#1F2937] bg-[#0B1117]">

           {error ? (
  <div className="flex h-full items-center justify-center">
    <div className="max-w-md text-center">
      <p className="text-red-400">
        {error}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        The air-quality service is currently
        unavailable.
      </p>
    </div>
  </div>
) : loading ? (
  <div className="flex h-full items-center justify-center">
    <div className="text-center">
      <div className="text-sm uppercase tracking-wider text-[#38BDF8]">
        Loading air-quality data
      </div>

      <div className="mt-2 text-xs text-slate-500">
        Preparing map and intelligence layer...
      </div>
    </div>
  </div>
) : features.length === 0 ? (
  <div className="flex h-full items-center justify-center">
    <div className="text-center">
      <p className="text-sm text-slate-300">
        No air-quality observations available.
      </p>

      <p className="mt-2 text-xs text-slate-500">
        Try another pollutant or refresh the data.
      </p>
    </div>
  </div>
) : (
  <AirQualityMap
  features={features}
  pollutant={pollutant}
  onCitySelect={setSelectedCity}
/>
)}

          </div>
          <div className="mt-5">
            <AirQualityChart
              data={chartData}
              pollutant={pollutant}
            />
          </div>
        </section>

        {/* INTELLIGENCE SIDEBAR — 30% */}
        <IntelligenceSidebar
          features={features}
          loading={loading}
          selectedCity={selectedCity}
        />

      </div>
    </main>
  ); 
}