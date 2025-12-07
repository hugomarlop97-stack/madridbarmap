"use client";

import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { BarWithStats } from "@/types";

interface BarMarkerProps {
  bar: BarWithStats;
  onClick: () => void;
}

export default function BarMarker({ bar, onClick }: BarMarkerProps) {
  // Color based on number of reviews
  const getColors = () => {
    if (bar.reviewCount === 0) return { bg: "bg-gray-500", text: "text-white" };
    if (bar.reviewCount < 5) return { bg: "bg-blue-600", text: "text-white" };
    if (bar.reviewCount < 10) return { bg: "bg-emerald-600", text: "text-white" };
    return { bg: "bg-amber-500", text: "text-white" }; // popular
  };

  const colors = getColors();

  return (
    <AdvancedMarker
      position={{ lat: bar.latitude, lng: bar.longitude }}
      onClick={onClick}
      title={bar.name}
    >
      <div
        className={`group cursor-pointer transition-all duration-200 transform hover:scale-110 hover:shadow-lg rounded-full px-3 py-1.5 shadow-md flex items-center justify-center gap-1 border-2 border-white ${colors.bg}`}
      >
        {bar.avgPrice && bar.avgPrice > 0 ? (
          <span className={`text-xs font-bold leading-none ${colors.text}`}>
            {bar.avgPrice.toFixed(2)}€
          </span>
        ) : (
          <span className="text-xs font-bold leading-none">🍺</span>
        )}
      </div>

      {/* Triangle pointer to make it look like a speech bubble */}
      <div className={`absolute left-1/2 -translate-x-1/2 bottom-[0px] w-2 h-2 rotate-45 border-r-2 border-b-2 border-white ${colors.bg} -z-10`}></div>
    </AdvancedMarker>
  );
}
