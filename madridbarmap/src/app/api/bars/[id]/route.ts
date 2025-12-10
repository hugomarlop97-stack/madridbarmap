import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateMode, calculateMedian } from "@/lib/utils";
import { BarDetail } from "@/types";

// GET /api/bars/[id] - Get bar details with reviews
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const bar = await prisma.bar.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            name: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!bar) {
      return NextResponse.json(
        { error: "Bar no encontrado" },
        { status: 404 }
      );
    }

    const terrazas = bar.reviews.map((r) => r.terraza);
    const tapas = bar.reviews.map((r) => r.tapa);
    const precios = bar.reviews.map((r) => r.precioDoble);

    const barDetail: BarDetail = {
      id: bar.id,
      name: bar.name,
      latitude: bar.latitude,
      longitude: bar.longitude,
      address: bar.address,
      createdAt: bar.createdAt,
      createdBy: bar.createdBy,
      reviews: bar.reviews.map((r) => ({
        id: r.id,
        terraza: r.terraza,
        precioDoble: r.precioDoble.toNumber(),
        tapa: r.tapa,
        createdAt: r.createdAt,
        user: r.user,
      })),
      stats: {
        reviewCount: bar.reviews.length,
        avgPrice: calculateMedian(precios),
        mostVotedTerraza: calculateMode(terrazas),
        mostVotedTapa: calculateMode(tapas),
      },
    };

    return NextResponse.json(barDetail);
  } catch (error) {
    console.error("Error fetching bar:", error);
    return NextResponse.json(
      { error: "Error al obtener el bar" },
      { status: 500 }
    );
  }
}
