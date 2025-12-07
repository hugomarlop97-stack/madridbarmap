"use client";

import { useState, useEffect, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";

interface PlacePrediction {
    place_id: string;
    description: string;
}

export default function PlacesAutocomplete() {
    const [query, setQuery] = useState("");
    const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const setSelectedPlaceId = useAppStore((state) => state.setSelectedPlaceId);

    useEffect(() => {
        const fetchPlaces = async () => {
            if (query.length < 3) {
                setPredictions([]);
                return;
            }

            try {
                const res = await fetch(`/api/places/search?query=${encodeURIComponent(query)}`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setPredictions(data);
                    setIsOpen(true);
                }
            } catch (error) {
                console.error("Search error:", error);
            }
        };

        const timeoutId = setTimeout(fetchPlaces, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    // Handle click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (placeId: string) => {
        setSelectedPlaceId(placeId);
        setIsOpen(false);
        // Ideally clear query or set it to selected place name
        // setQuery(""); 
    };

    return (
        <div ref={wrapperRef} className="relative w-full max-w-md">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar bar, restaurante..."
                className="w-full px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />

            {isOpen && predictions.length > 0 && (
                <ul className="absolute z-50 w-full mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {predictions.map((place) => (
                        <li
                            key={place.place_id}
                            onClick={() => handleSelect(place.place_id)}
                            className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer text-sm"
                        >
                            {place.description}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
