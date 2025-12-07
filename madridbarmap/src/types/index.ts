import { Terraza, Tapa } from "@prisma/client";

export interface BarWithStats {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string | null;
  createdAt: Date;
  reviewCount: number;
  avgPrice: number;
  mostVotedTerraza: Terraza | null;
  mostVotedTapa: Tapa | null;
  googlePlaceId?: string | null;
}

export interface ReviewData {
  id: string;
  terraza: Terraza;
  precioDoble: number;
  tapa: Tapa;
  createdAt: Date;
  user: {
    name: string | null;
    image: string | null;
  };
}

export interface BarDetail {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string | null;
  createdAt: Date;
  createdBy: {
    name: string | null;
  };
  reviews: ReviewData[];
  stats: {
    reviewCount: number;
    avgPrice: number;
    mostVotedTerraza: Terraza | null;
    mostVotedTapa: Tapa | null;
  };
}

export interface CreateBarInput {
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
}

export interface CreateReviewInput {
  terraza: Terraza;
  precioDoble: number;
  tapa: Tapa;
}

export interface MapClickEvent {
  lat: number;
  lng: number;
}
