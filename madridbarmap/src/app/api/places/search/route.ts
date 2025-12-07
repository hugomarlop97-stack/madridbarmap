import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
        return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "Server API Key missing" }, { status: 500 });
    }

    try {
        // Restrict to Madrid (approximate bounds or radius)
        // 40.4168° N, 3.7038° W
        const location = "40.4168,-3.7038";
        const radius = "20000"; // 20km
        const types = "bar|cafe|restaurant|night_club";

        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
            query
        )}&location=${location}&radius=${radius}&types=${encodeURIComponent(
            types
        )}&key=${apiKey}`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
            throw new Error(data.error_message || "Google API Error");
        }

        return NextResponse.json(data.predictions);
    } catch (error) {
        console.error("Places Search Error:", error);
        return NextResponse.json({ error: "Failed to fetch places" }, { status: 500 });
    }
}
