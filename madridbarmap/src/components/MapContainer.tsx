"use client";

import { useState, useEffect, useCallback } from "react";
import { Session } from "next-auth";
import { MapComponent } from "./Map";
import { CreateBarForm, ReviewForm } from "./Forms";
import { LoadingSpinner } from "./UI";
import { BarWithStats, MapClickEvent } from "@/types";
import { Terraza, Tapa } from "@prisma/client";
import { useAppStore } from "@/store/useAppStore";

interface MapContainerProps {
  session: Session | null;
}

export default function MapContainer({ session }: MapContainerProps) {
  const [bars, setBars] = useState<BarWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [createBarCoords, setCreateBarCoords] = useState<MapClickEvent | null>(null);
  const [reviewBar, setReviewBar] = useState<BarWithStats | null>(null);

  const fetchBars = useCallback(async () => {
    try {
      const response = await fetch("/api/bars");
      if (!response.ok) throw new Error("Error al cargar los bares");
      const data = await response.json();
      setBars(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const { refreshTrigger } = useAppStore();

  useEffect(() => {
    fetchBars();
  }, [fetchBars, refreshTrigger]);

  const handleRightClick = useCallback((coords: MapClickEvent) => {
    setCreateBarCoords(coords);
  }, []);

  const handleAddReview = useCallback((bar: BarWithStats) => {
    setReviewBar(bar);
  }, []);

  const handleCreateBar = async (data: { name: string; address?: string }) => {
    if (!createBarCoords) return;

    const response = await fetch("/api/bars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        latitude: createBarCoords.lat,
        longitude: createBarCoords.lng,
        address: data.address,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al crear el bar");
    }

    setCreateBarCoords(null);
    await fetchBars();
  };

  const handleSubmitReview = async (data: {
    terraza: Terraza;
    precioDoble: number;
    tapa: Tapa;
  }) => {
    if (!reviewBar) return;

    const response = await fetch(`/api/bars/${reviewBar.id}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al crear la reseña");
    }

    setReviewBar(null);
    await fetchBars();
  };

  if (isLoading) {
    return (
      <div className="flex-1">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
              fetchBars();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <MapComponent
        bars={bars}
        isLoggedIn={!!session?.user}
        onRightClick={handleRightClick}
        onAddReview={handleAddReview}
      />

      {/* Hint for logged-in users */}
      {session?.user && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md text-sm text-gray-700">
          Click derecho en el mapa para añadir un bar
        </div>
      )}

      {/* Create Bar Modal */}
      {createBarCoords && (
        <CreateBarForm
          coordinates={createBarCoords}
          onSubmit={handleCreateBar}
          onCancel={() => setCreateBarCoords(null)}
        />
      )}

      {/* Review Modal */}
      {reviewBar && (
        <ReviewForm
          bar={reviewBar}
          onSubmit={handleSubmitReview}
          onCancel={() => setReviewBar(null)}
        />
      )}
    </div>
  );
}
