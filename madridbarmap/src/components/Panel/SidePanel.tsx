"use client";

import { useAppStore } from "@/store/useAppStore";
import BarDetails from "./BarDetails";
import ReviewForm from "./ReviewForm";

export default function SidePanel() {
    const { selectedPlaceId, panelMode, setPanelMode, setSelectedPlaceId } = useAppStore();

    if (!selectedPlaceId) {
        return (
            <div className="p-6 text-center text-zinc-500 flex flex-col items-center justify-center h-full">
                <h2 className="text-xl font-semibold mb-2 text-zinc-700">Bienvenido a Terrazapp</h2>
                <p className="mb-4">Busca un bar o selecciona uno en el mapa para ver detalles y añadir reseñas.</p>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
                    <p className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                        </svg>
                        <span><strong>Regístrate con Google</strong> para guardar valoraciones</span>
                    </p>
                </div>
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
