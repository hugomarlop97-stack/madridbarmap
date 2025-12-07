"use client";

import { BarWithStats } from "@/types";
import { formatTerraza, formatTapa, formatPrice } from "@/lib/utils";

interface BarInfoWindowProps {
  bar: BarWithStats;
  onAddReview: () => void;
  isLoggedIn: boolean;
}

export default function BarInfoWindow({
  bar,
  onAddReview,
  isLoggedIn,
}: BarInfoWindowProps) {
  return (
    <div className="min-w-[280px]">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-xl text-gray-900 leading-tight">{bar.name}</h3>
          {bar.address && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{bar.address}</p>
          )}
        </div>
        {bar.avgPrice && (
          <div className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full border border-amber-200 shadow-sm">
            {formatPrice(bar.avgPrice)}
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-3 space-y-2 border border-gray-100">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 flex items-center gap-1">
            🍺 Precio Doble
          </span>
          <span className="font-semibold text-gray-900">
            {bar.avgPrice ? formatPrice(bar.avgPrice) : "-"}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 flex items-center gap-1">
            ☀️ Terraza
          </span>
          <span className="font-semibold text-gray-900">
            {bar.mostVotedTerraza ? formatTerraza(bar.mostVotedTerraza) : "-"}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 flex items-center gap-1">
            🥘 Tapa
          </span>
          <span className="font-semibold text-gray-900">
            {bar.mostVotedTapa ? formatTapa(bar.mostVotedTapa) : "-"}
          </span>
        </div>
      </div>

      {bar.reviewCount === 0 && (
        <p className="text-xs text-center text-gray-400 mt-3 italic">
          Sé el primero en valorarlo
        </p>
      )}

      {isLoggedIn && (
        <button
          onClick={onAddReview}
          className="mt-4 w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 text-sm font-bold flex items-center justify-center gap-2"
        >
          <span>✍️</span> Añadir Valoración
        </button>
      )}
    </div>
  );
}
