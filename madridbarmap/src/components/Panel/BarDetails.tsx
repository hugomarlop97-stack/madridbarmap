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

// Reusable Stats Grid Component - Shows Price/Terrace/Tapa prominently
function StatsGrid({ bar }: { bar: BarWithStats | null }) {
    if (!bar) {
        return (
            <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-3 min-h-[72px]">
                    <span className="text-2xl">💶</span>
                    <span className="text-xs text-gray-400 mt-1">Sin datos</span>
                </div>
                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-3 min-h-[72px]">
                    <span className="text-2xl">☀️</span>
                    <span className="text-xs text-gray-400 mt-1">Sin datos</span>
                </div>
                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-3 min-h-[72px]">
                    <span className="text-2xl">🍽️</span>
                    <span className="text-xs text-gray-400 mt-1">Sin datos</span>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-2 mt-3">
            {/* Price - Most important */}
            <div className="flex flex-col items-center justify-center bg-amber-50 rounded-xl p-3 min-h-[80px] border border-amber-100">
                <span className="text-[10px] text-amber-500 font-semibold uppercase tracking-wide">Caña/Doble</span>
                <span className="text-2xl font-bold text-amber-700 mt-1">
                    {bar.avgPrice ? `${bar.avgPrice.toFixed(2)}€` : "—"}
                </span>
            </div>

            {/* Terrace */}
            <div className="flex flex-col items-center justify-center bg-green-50 rounded-xl p-3 min-h-[80px] border border-green-100">
                <span className="text-[10px] text-green-600 font-semibold uppercase tracking-wide">Terraza</span>
                <span className="text-2xl mt-1">
                    {bar.mostVotedTerraza === 'SIN_TERRAZA' && "❌"}
                    {bar.mostVotedTerraza === 'PEQUENA' && "🪑"}
                    {bar.mostVotedTerraza === 'GRANDE' && "🏖️"}
                    {!bar.mostVotedTerraza && "❓"}
                </span>
                <span className="text-[10px] text-green-700 font-medium">
                    {bar.mostVotedTerraza === 'SIN_TERRAZA' && "No tiene"}
                    {bar.mostVotedTerraza === 'PEQUENA' && "Pequeña"}
                    {bar.mostVotedTerraza === 'GRANDE' && "Grande"}
                    {!bar.mostVotedTerraza && "Sin datos"}
                </span>
            </div>

            {/* Tapa */}
            <div className="flex flex-col items-center justify-center bg-orange-50 rounded-xl p-3 min-h-[80px] border border-orange-100">
                <span className="text-[10px] text-orange-500 font-semibold uppercase tracking-wide">Tapa</span>
                <span className="text-2xl mt-1">
                    {bar.mostVotedTapa === 'SIN_TAPA' && "❌"}
                    {bar.mostVotedTapa === 'REGULAR' && "🥒"}
                    {bar.mostVotedTapa === 'SUPER_TAPA' && "🥘"}
                    {!bar.mostVotedTapa && "❓"}
                </span>
                <span className="text-[10px] text-orange-700 font-medium">
                    {bar.mostVotedTapa === 'SIN_TAPA' && "No ponen"}
                    {bar.mostVotedTapa === 'REGULAR' && "Normal"}
                    {bar.mostVotedTapa === 'SUPER_TAPA' && "¡Raciones!"}
                    {!bar.mostVotedTapa && "Sin datos"}
                </span>
            </div>
        </div>
    );
}

export default function BarDetails() {
    const { selectedPlaceId, setPanelMode, bottomSheetExpanded, setBottomSheetExpanded } = useAppStore();

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
    if (loading) return <div className="p-8 flex justify-center"><LoadingSpinner /></div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;
    if (!googleData) return <div className="p-8">No se encontró el lugar.</div>;

    return (
        <div className="flex flex-col h-full">
            {/* HEADER - Always visible, shows CORE data first */}
            <div
                className="bg-white p-4 cursor-pointer"
                onClick={() => setBottomSheetExpanded(!bottomSheetExpanded)}
            >
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-bold text-gray-900 truncate">{googleData.name}</h1>
                        {internalBar && internalBar.reviewCount > 0 && (
                            <p className="text-xs text-gray-500 mt-0.5">
                                {internalBar.reviewCount} valoración{internalBar.reviewCount > 1 ? 'es' : ''} de usuarios
                            </p>
                        )}
                    </div>
                    {/* Expand/Collapse indicator */}
                    <button
                        className="ml-2 p-1 text-gray-400 transition-transform duration-200"
                        style={{ transform: bottomSheetExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        aria-label={bottomSheetExpanded ? "Colapsar" : "Expandir"}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 9l6 6 6-6" />
                        </svg>
                    </button>
                </div>

                {/* STATS GRID - The core value proposition, ALWAYS visible */}
                <StatsGrid bar={internalBar} />

                {/* Hint to expand */}
                {!bottomSheetExpanded && (
                    <p className="text-center text-xs text-gray-400 mt-3">
                        Toca para ver más detalles
                    </p>
                )}
            </div>

            {/* EXPANDED CONTENT - Google details (secondary info) */}
            {bottomSheetExpanded && (
                <div className="flex-1 overflow-y-auto border-t border-gray-100 bg-gray-50">
                    <div className="p-4 space-y-4">
                        {/* Address */}
                        <div className="flex items-start gap-3">
                            <span className="text-lg">📍</span>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Dirección</p>
                                <p className="text-sm text-gray-600">{googleData.formatted_address}</p>
                            </div>
                        </div>

                        {/* Google Rating */}
                        {googleData.rating && (
                            <div className="flex items-start gap-3">
                                <span className="text-lg">⭐</span>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Valoración Google</p>
                                    <p className="text-sm text-gray-600">
                                        {googleData.rating} ({googleData.user_ratings_total} reseñas)
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Website */}
                        {googleData.website && (
                            <div className="flex items-start gap-3">
                                <span className="text-lg">🌐</span>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Sitio Web</p>
                                    <a
                                        href={googleData.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        Visitar web
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* CTA - Fixed at bottom, always visible */}
            <div className="sticky bottom-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
                <button
                    className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3.5 px-4 rounded-xl shadow-md transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 min-h-[48px]"
                    onClick={() => setPanelMode("review")}
                >
                    <span>✍️</span>
                    {internalBar ? "Añadir mi valoración" : "Escribir primera valoración"}
                </button>
            </div>
        </div>
    );
}
