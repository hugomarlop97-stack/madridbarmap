"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { LoadingSpinner } from "../UI";
import { BarWithStats } from "@/types";

interface GooglePlaceDetails {
    place_id: string;
    name: string;
    formatted_address: string;
    formatted_phone_number?: string;
    website?: string;
    rating?: number;
    user_ratings_total?: number;
    geometry: {
        location: { lat: number; lng: number };
    };
    photos?: { photo_reference: string }[];
}

export default function BarDetails() {
    const { selectedPlaceId, setPanelMode } = useAppStore();

    const [googleData, setGoogleData] = useState<GooglePlaceDetails | null>(null);
    const [internalBar, setInternalBar] = useState<BarWithStats | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedPlaceId) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            setInternalBar(null);
            setGoogleData(null);

            try {
                // 1. Fetch Google Details
                const googleRes = await fetch(`/api/places/${selectedPlaceId}`);
                const googleJson = await googleRes.json();

                if (googleJson.error) throw new Error(googleJson.error);
                setGoogleData(googleJson);

                // 2. Check if we have it in our DB
                const internalRes = await fetch(`/api/bars?placeId=${selectedPlaceId}`);
                const internalJson = await internalRes.json();

                if (Array.isArray(internalJson) && internalJson.length > 0) {
                    setInternalBar(internalJson[0]);
                }
            } catch (err) {
                console.error(err);
                setError("Error cargando los detalles del lugar");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedPlaceId]);

    if (!selectedPlaceId) return null;
    if (loading) return <div className="p-8"><LoadingSpinner /></div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;
    if (!googleData) return <div className="p-8">No se encontró el lugar.</div>;

    return (
        <div className="space-y-6">
            <div className="p-4">
                <h1 className="text-2xl font-bold text-gray-900">{googleData.name}</h1>
                <p className="text-gray-600 text-sm mt-1">{googleData.formatted_address}</p>

                {googleData.rating && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-amber-600">
                        <span>★ {googleData.rating}</span>
                        <span className="text-gray-400">({googleData.user_ratings_total} reseñas en Google)</span>
                    </div>
                )}

                <div className="mt-4 flex gap-2">
                    {googleData.website && (
                        <a
                            href={googleData.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 text-sm hover:underline"
                        >
                            Sitio Web
                        </a>
                    )}
                </div>
            </div>

            <hr className="border-gray-100" />

            {/* Enhanced Stats Display */}
            <div className="px-4">
                <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="bg-amber-100 text-amber-700 p-1 rounded">📊</span> Valoración MadridBarMap
                    </h3>

                    {internalBar ? (
                        <div className="grid grid-cols-3 gap-4 text-center divide-x divide-gray-100">
                            {/* Price */}
                            <div className="flex flex-col items-center">
                                <span className="text-xs text-gray-500 mb-1">Doble</span>
                                <div className="text-lg font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded-lg w-full">
                                    {internalBar.avgPrice ? `${internalBar.avgPrice.toFixed(2)}€` : "-"}
                                </div>
                            </div>

                            {/* Terrace */}
                            <div className="flex flex-col items-center pl-4">
                                <span className="text-xs text-gray-500 mb-1">Terraza</span>
                                <div className="text-2xl" title={internalBar.mostVotedTerraza || ""}>
                                    {internalBar.mostVotedTerraza === 'SIN_TERRAZA' && "🚫"}
                                    {internalBar.mostVotedTerraza === 'PEQUENA' && "👌"}
                                    {internalBar.mostVotedTerraza === 'GRANDE' && "🌳"}
                                    {!internalBar.mostVotedTerraza && "❓"}
                                </div>
                                <div className="text-[10px] text-gray-400 mt-1 truncate w-full">
                                    {internalBar.mostVotedTerraza?.replace("SIN_TERRAZA", "No tiene")?.replace("PEQUENA", "Pequeña")?.replace("GRANDE", "Grande") || "-"}
                                </div>
                            </div>

                            {/* Tapa */}
                            <div className="flex flex-col items-center pl-4">
                                <span className="text-xs text-gray-500 mb-1">Tapa</span>
                                <div className="text-2xl" title={internalBar.mostVotedTapa || ""}>
                                    {internalBar.mostVotedTapa === 'SIN_TAPA' && "🥜"}
                                    {internalBar.mostVotedTapa === 'REGULAR' && "🥪"}
                                    {internalBar.mostVotedTapa === 'SUPER_TAPA' && "🥘"}
                                    {!internalBar.mostVotedTapa && "❓"}
                                </div>
                                <div className="text-[10px] text-gray-400 mt-1 truncate w-full">
                                    {internalBar.mostVotedTapa?.replace("SIN_TAPA", "Nada")?.replace("REGULAR", "Normal")?.replace("SUPER_TAPA", "¡Top!") || "-"}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-4 text-gray-500 text-sm bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            Sé el primero en valorar este sitio
                        </div>
                    )}
                </div>
            </div>

            <div className="px-4 pb-8">
                <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all transform active:scale-95 flex items-center justify-center gap-2"
                    onClick={() => setPanelMode("review")}
                >
                    <span>✍️</span>
                    {internalBar ? "Añadir mi valoración" : "Escribir primera valoración"}
                </button>
            </div>
        </div>
    );
}
