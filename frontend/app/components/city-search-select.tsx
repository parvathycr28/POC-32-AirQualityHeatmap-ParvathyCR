"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type CitySearchSelectProps = {
  cities: string[];
  value: string;
  onChange: (city: string) => void;
  placeholder?: string;
};

export default function CitySearchSelect({
  cities,
  value,
  onChange,
  placeholder = "Search/select city",
}: CitySearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  const filteredCities = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return cities;
    }

    return cities.filter((city) =>
      city.toLowerCase().includes(query)
    );
  }, [cities, search]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  function handleOpen() {
    setOpen(true);

    // When opening an already-selected city,
    // start with an empty search so the full list is visible.
    setSearch("");
  }

  function handleSelect(city: string) {
    onChange(city);
    setSearch("");
    setOpen(false);
  }

  return (
    <div
      ref={containerRef}
      className="relative w-64"
    >
      {/* SEARCH / SELECT CONTROL */}
  <input
  type="text"
  role="combobox"
  aria-label={placeholder}
  aria-expanded={open}
  aria-haspopup="listbox"
  aria-controls="city-search-listbox"
  aria-autocomplete="list"
  value={open ? search : value}
  onFocus={handleOpen}
  onChange={(event) => {
    setSearch(event.target.value);
    setOpen(true);
  }}
  placeholder={placeholder}
  className="w-full rounded-md border border-[#1F2937] bg-[#0B1117] px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-[#38BDF8]"
/>

      {/* DROPDOWN */}
      {open && (
        <div 
          id="city-search-listbox"
          role="listbox"
          aria-label={`${placeholder} options`}
          className="absolute z-[1000] mt-1 max-h-72 w-full overflow-y-auto rounded-md border border-[#1F2937] bg-[#0B1117] shadow-xl">
          {filteredCities.length === 0 ? (
            <div className="px-3 py-3 text-sm text-slate-500">
              No cities found
            </div>
          ) : (
            filteredCities.map((city, index) => (
              <button
                type="button"
                role="option"
                aria-selected={city === value}

                key={`${city}-${index}`}
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                onClick={() => handleSelect(city)}
                className={`block w-full px-3 py-2 text-left text-sm transition ${
                  city === value
                    ? "bg-[#111827] text-[#38BDF8]"
                    : "text-slate-300 hover:bg-[#111827] hover:text-white"
                }`}
              >
                {city}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}