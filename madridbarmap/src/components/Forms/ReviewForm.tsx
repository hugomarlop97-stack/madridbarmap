"use client";

import { useState } from "react";
import { Terraza, Tapa } from "@prisma/client";
import { BarWithStats } from "@/types";

interface ReviewFormProps {
  bar: BarWithStats;
  onSubmit: (data: {
    terraza: Terraza;
    precioDoble: number;
    tapa: Tapa;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function ReviewForm({ bar, onSubmit, onCancel }: ReviewFormProps) {
  const [terraza, setTerraza] = useState<Terraza>("SIN_TERRAZA");
  const [precioDoble, setPrecioDoble] = useState("");
  const [tapa, setTapa] = useState<Tapa>("SIN_TAPA");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const precio = parseFloat(precioDoble);
    if (isNaN(precio) || precio < 0) {
      setError("El precio debe ser un número válido");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ terraza, precioDoble: precio, tapa });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar la reseña");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Añadir reseña</h2>
        <p className="text-gray-600 mb-4">{bar.name}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Terraza
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "SIN_TERRAZA", label: "Sin terraza" },
                { value: "PEQUENA", label: "Pequeña" },
                { value: "GRANDE", label: "Grande" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTerraza(option.value as Terraza)}
                  className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                    terraza === option.value
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                  disabled={isSubmitting}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="precioDoble"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Precio del doble (€)
            </label>
            <input
              type="number"
              id="precioDoble"
              value={precioDoble}
              onChange={(e) => setPrecioDoble(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 2.50"
              step="0.01"
              min="0"
              max="999.99"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tapa
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "SIN_TAPA", label: "Sin tapa" },
                { value: "REGULAR", label: "Regular" },
                { value: "SUPER_TAPA", label: "Super tapa" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTapa(option.value as Tapa)}
                  className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                    tapa === option.value
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                  disabled={isSubmitting}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar reseña"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
