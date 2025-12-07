"use client";

import { useState } from "react";
import { Terraza, Tapa } from "@prisma/client";
import { useAppStore } from "@/store/useAppStore";

interface ReviewFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export default function ReviewForm({ onSuccess, onCancel }: ReviewFormProps) {
    const { selectedPlaceId } = useAppStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [precio, setPrecio] = useState("");
    const [terraza, setTerraza] = useState<Terraza>("SIN_TERRAZA");
    const [tapa, setTapa] = useState<Tapa>("SIN_TAPA");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPlaceId) return;

        setLoading(true);
        setError(null);

        try {
            // 1. Ensure Bar exists (or create it)
            // For now, we assume we post to /api/bars with placeId, and if it doesn't exist, we might need a separate flow or logic.
            // But adhering to the layout, we normally POST to /api/bars/[id]/reviews
            // If the bar doesn't exist in our DB, we first need to create it using Google Details.

            // Fetch details first to get name/coords if needed for creation
            let barId = "";

            // Check if bar exists by googlePlaceId
            const checkRes = await fetch(`/api/bars?placeId=${selectedPlaceId}`);
            const checkJson = await checkRes.json();

            if (Array.isArray(checkJson) && checkJson.length > 0) {
                barId = checkJson[0].id;
            } else {
                // Create the bar!
                // We need google details to create it.
                const placeRes = await fetch(`/api/places/${selectedPlaceId}`);
                const placeData = await placeRes.json();

                const createRes = await fetch("/api/bars", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: placeData.name,
                        address: placeData.formatted_address,
                        latitude: placeData.geometry.location.lat,
                        longitude: placeData.geometry.location.lng,
                        googlePlaceId: selectedPlaceId
                    })
                });

                if (!createRes.ok) throw new Error("Error creando el bar");
                const newBar = await createRes.json();
                barId = newBar.id;
            }

            // 2. Post Review
            const reviewRes = await fetch(`/api/bars/${barId}/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    precioDoble: parseFloat(precio),
                    terraza,
                    tapa
                })
            });

            if (!reviewRes.ok) throw new Error("Error guardando la reseña");

            useAppStore.getState().triggerRefresh();
            onSuccess();
        } catch (err) {
            console.error(err);
            setError("Error al guardar. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-4">
            <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
                <span>📝</span> Nueva Reseña
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Price Input */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <span>🍺</span> Precio del Doble (€)
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            step="0.01"
                            required
                            min="0"
                            value={precio}
                            onChange={(e) => setPrecio(e.target.value)}
                            className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-lg text-lg font-bold text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                            placeholder="0.00"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">€</span>
                    </div>
                </div>

                {/* Terrace Check */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <span>☀️</span> Terraza
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { val: "SIN_TERRAZA", label: "Sin", icon: "🚫" },
                            { val: "PEQUENA", label: "Pequeña", icon: "👌" },
                            { val: "GRANDE", label: "Grande", icon: "🌳" },
                        ].map((opt) => (
                            <label
                                key={opt.val}
                                className={`
                                    cursor-pointer flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all
                                    ${terraza === opt.val
                                        ? "border-amber-500 bg-amber-50 text-amber-900"
                                        : "border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:bg-gray-50"}
                                `}
                            >
                                <input
                                    type="radio"
                                    name="terraza"
                                    value={opt.val}
                                    checked={terraza === opt.val}
                                    onChange={() => setTerraza(opt.val as Terraza)}
                                    className="sr-only"
                                />
                                <span className="text-xl mb-1">{opt.icon}</span>
                                <span className="text-xs font-medium">{opt.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Tapa Check */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <span>🥘</span> Tapa
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { val: "SIN_TAPA", label: "Nada", icon: "🥜" },
                            { val: "REGULAR", label: "Normal", icon: "🥪" },
                            { val: "SUPER_TAPA", label: "¡Top!", icon: "🥘" },
                        ].map((opt) => (
                            <label
                                key={opt.val}
                                className={`
                                    cursor-pointer flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all
                                    ${tapa === opt.val
                                        ? "border-amber-500 bg-amber-50 text-amber-900"
                                        : "border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:bg-gray-50"}
                                `}
                            >
                                <input
                                    type="radio"
                                    name="tapa"
                                    value={opt.val}
                                    checked={tapa === opt.val}
                                    onChange={() => setTapa(opt.val as Tapa)}
                                    className="sr-only"
                                />
                                <span className="text-xl mb-1">{opt.icon}</span>
                                <span className="text-xs font-medium">{opt.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">{error}</p>}

                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-3 px-4 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all transform active:scale-95 disabled:opacity-50"
                    >
                        {loading ? "Guardando..." : "Publicar"}
                    </button>
                </div>
            </form>
        </div>
    );
}
