"use client";
import { useMemo } from "react";
import type { AirQualityFeature } from "../lib/api";

type IntelligenceSidebarProps = {
  features: AirQualityFeature[];
  loading: boolean;
  selectedCity?: string;
};

export default function IntelligenceSidebar({
  features,
  loading,
  selectedCity,
}: IntelligenceSidebarProps) {
  const selectedFeature =
    features.find(
      (feature) =>
        feature.properties.city?.toLowerCase() ===
        selectedCity?.toLowerCase()
    ) ?? features[0];

  return (
    <aside className="h-full overflow-y-auto border-l border-[#1F2937] bg-[#0B1117] p-6">
      {/* HEADER */}
      <div className="text-xs uppercase tracking-[0.18em] text-[#38BDF8]">
        AIR QUALITY INTELLIGENCE
      </div>

      <h2 className="mt-3 text-2xl font-semibold text-white">
        Pollution & Exposure
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        Pollution measurements are transformed into
        city-level exposure intelligence.
      </p>

      {/* CURRENT MEASUREMENT */}
      <div className="mt-8 border-t border-[#1F2937] pt-6">
        <div className="text-xs uppercase tracking-wider text-slate-500">
          Current Measurement
        </div>

        {loading ? (
          <p className="mt-3 text-sm text-slate-400">
            Loading air-quality data...
          </p>
        ) :selectedFeature ? (
          <div className="mt-3">
            <div className="text-3xl font-semibold text-[#38BDF8]">
              {selectedFeature.properties.value}
            </div>

            <div className="mt-1 text-sm text-slate-400">
              {selectedFeature.properties.unit}
            </div>

            <div className="mt-3 text-sm text-white">
              {selectedFeature.properties.city}
            </div>

            <div className="mt-1 text-xs text-slate-500">
              {selectedFeature.properties.pollutant}
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">
            No air-quality data available.
          </p>
        )}
      </div>

      {/* EXPOSURE SCORE */}
      <div className="mt-8 border-t border-[#1F2937] pt-6">
        <div className="text-xs uppercase tracking-wider text-slate-500">
          Exposure Score
        </div>

        {selectedFeature ? (
          <div className="mt-3">
            <div className="text-2xl font-semibold text-white">
              {selectedFeature.properties.exposure_score ?? "—"}
            </div>

            <p className="mt-2 text-sm text-slate-400">
              A higher score indicates greater measured
              pollution exposure.
            </p>
          </div>
        ) : (
          <div className="mt-3 text-sm text-slate-500">
            —
          </div>
        )}
      </div>

      {/* WHY THIS MATTERS */}
      <div className="mt-8 border-t border-[#1F2937] pt-6">
        <div className="text-xs uppercase tracking-wider text-slate-500">
          Why This Matters
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-300">
          Air pollution is more than an environmental
          statistic. Mapping pollution alongside population
          exposure helps identify where poor air quality can
          affect the greatest number of people.
        </p>
      </div>

      {/* WHO CONTROLS THE RAIL */}
      <div className="mt-8 border-t border-[#1F2937] pt-6">
        <div className="text-xs uppercase tracking-wider text-slate-500">
          Who Controls the Rail
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-300">
          Public agencies, environmental regulators, data
          providers, and technology platforms shape how air
          quality is measured, interpreted, and acted upon.
        </p>
      </div>

      {/* SOURCE */}
      {selectedFeature && (
        <div className="mt-8 border-t border-[#1F2937] pt-6">
          <div className="text-xs uppercase tracking-wider text-slate-500">
            Data Source
          </div>

          <p className="mt-3 text-sm text-slate-300">
            {selectedFeature.properties.source ?? "Unknown"}
          </p>
        </div>
      )}
    </aside>
  );
}