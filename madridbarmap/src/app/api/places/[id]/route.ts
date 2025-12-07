import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const placeId = (await params).id;

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "Server API Key missing" }, { status: 500 });
    }

    try {
        // Fields to fetch
        const fields = "name,formatted_address,geometry,photos,rating,user_ratings_total,formatted_phone_number,website";

        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.status !== "OK") {
            throw new Error(data.error_message || "Google API Error");
        }

        return NextResponse.json(data.result);
    } catch (error) {
        console.error("Place Details Error:", error);
        return NextResponse.json({ error: "Failed to fetch place details" }, { status: 500 });
    }
}
