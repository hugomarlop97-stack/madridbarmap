import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createReviewSchema } from "@/lib/validations";

// POST /api/bars/[id]/reviews - Add a review to a bar
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para añadir una reseña" },
        { status: 401 }
      );
    }

    const { id: barId } = await params;

    // Check if bar exists
    const bar = await prisma.bar.findUnique({
      where: { id: barId },
    });

    if (!bar) {
      return NextResponse.json(
        { error: "Bar no encontrado" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validationResult = createReviewSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { terraza, precioDoble, tapa } = validationResult.data;

    // Check if user already reviewed this bar
    const existingReview = await prisma.review.findUnique({
      where: {
        barId_userId: {
          barId,
          userId: session.user.id,
        },
      },
    });

    if (existingReview) {
      // Update existing review
      const updatedReview = await prisma.review.update({
        where: { id: existingReview.id },
        data: {
          terraza,
          precioDoble,
          tapa,
        },
      });

      return NextResponse.json(updatedReview);
    }

    // Create new review
    const review = await prisma.review.create({
      data: {
        barId,
        userId: session.user.id,
        terraza,
        precioDoble,
        tapa,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Error al crear la reseña" },
      { status: 500 }
    );
  }
}
