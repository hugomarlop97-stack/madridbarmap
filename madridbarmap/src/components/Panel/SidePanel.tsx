"use client";

import { useAppStore } from "@/store/useAppStore";
import BarDetails from "./BarDetails";
import ReviewForm from "./ReviewForm";

export default function SidePanel() {
    const { selectedPlaceId, panelMode, setPanelMode, setSelectedPlaceId } = useAppStore();

    if (!selectedPlaceId) {
        return (
            <div className="p-8 text-center text-zinc-500 flex flex-col items-center justify-center h-full">
                <h2 className="text-xl font-semibold mb-2">Bienvenido a Terrazapp</h2>
                <p>Busca un bar o selecciona uno en el mapa para ver detalles y añadir reseñas.</p>
            </div>
        );
    }

    return (
        <div className="relative h-full flex flex-col">
            {/* Close Button for Mobile/Overlay */}
            <button
                onClick={() => setSelectedPlaceId(null)}
                className="absolute top-2 right-2 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 z-10 transition-colors"
                title="Cerrar"
            >
                ✕
            </button>

            <div className="flex-1 overflow-y-auto">
                {panelMode === "review" ? (
                    <ReviewForm
                        onSuccess={() => setPanelMode("details")}
                        onCancel={() => setPanelMode("details")}
                    />
                ) : (
                    <BarDetails />
                )}
            </div>
        </div>
    );
}
