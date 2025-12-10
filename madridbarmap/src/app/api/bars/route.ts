import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createBarSchema } from "@/lib/validations";
import { calculateMode, calculateMedian } from "@/lib/utils";
import { BarWithStats } from "@/types";

// GET /api/bars - List all bars with aggregated stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get("placeId");

    const whereClause = placeId ? { googlePlaceId: placeId } : {};

    const bars = await prisma.bar.findMany({
      where: whereClause,
      include: {
        reviews: {
          select: {
            terraza: true,
            precioDoble: true,
            tapa: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const barsWithStats: BarWithStats[] = bars.map((bar: any) => {
      const terrazas = bar.reviews.map((r: any) => r.terraza);
      const tapas = bar.reviews.map((r: any) => r.tapa);
      const precios = bar.reviews.map((r: any) => r.precioDoble);

      return {
        id: bar.id,
        name: bar.name,
        latitude: bar.latitude,
        longitude: bar.longitude,
        address: bar.address,
        createdAt: bar.createdAt,
        reviewCount: bar.reviews.length,
        avgPrice: calculateMedian(precios),
        mostVotedTerraza: calculateMode(terrazas),
        mostVotedTapa: calculateMode(tapas),
        googlePlaceId: bar.googlePlaceId,
      };
    });

    return NextResponse.json(barsWithStats);
  } catch (error) {
    console.error("Error fetching bars:", error);
    return NextResponse.json(
      { error: "Error al obtener los bares" },
      { status: 500 }
    );
  }
}

// POST /api/bars - Create a new bar
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para añadir un bar" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationResult = createBarSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { name, latitude, longitude, address, googlePlaceId } = validationResult.data;

    const bar = await prisma.bar.create({
      data: {
        name,
        latitude,
        longitude,
        address,
        googlePlaceId,
        createdById: session.user.id,
      },
    });

    return NextResponse.json(bar, { status: 201 });
  } catch (error) {
    console.error("Error creating bar:", error);
    return NextResponse.json(
      { error: "Error al crear el bar" },
      { status: 500 }
    );
  }
}
