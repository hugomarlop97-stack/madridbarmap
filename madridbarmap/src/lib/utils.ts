import { Terraza, Tapa, Prisma } from "@prisma/client";

export function calculateMode<T>(arr: T[]): T | null {
  if (arr.length === 0) return null;

  const frequency: Map<T, number> = new Map();
  let maxFreq = 0;
  let mode: T = arr[0];

  for (const item of arr) {
    const count = (frequency.get(item) || 0) + 1;
    frequency.set(item, count);

    if (count > maxFreq) {
      maxFreq = count;
      mode = item;
    }
  }

  return mode;
}

export function calculateAverage(numbers: (Prisma.Decimal | number)[]): number {
  if (numbers.length === 0) return 0;

  const sum = numbers.reduce<number>((acc, num) => {
    const value = typeof num === "number" ? num : Number(num);
    return acc + value;
  }, 0);

  return Math.round((sum / numbers.length) * 100) / 100;
}

export function formatTerraza(terraza: Terraza): string {
  const labels: Record<Terraza, string> = {
    SIN_TERRAZA: "Sin terraza",
    PEQUENA: "Pequeña",
    GRANDE: "Grande",
  };
  return labels[terraza];
}

export function formatTapa(tapa: Tapa): string {
  const labels: Record<Tapa, string> = {
    SIN_TAPA: "Sin tapa",
    REGULAR: "Tapa regular",
    SUPER_TAPA: "Super tapa",
  };
  return labels[tapa];
}

export function formatPrice(price: number): string {
  return `${price.toFixed(2)}€`;
}
