// src/app/api/scanner/route.ts
import { NextResponse } from "next/server";
import { scoreProduct } from "../../../lib/recommenderEngine";

/**
 * POST /api/scanner
 * body: { barcode: string, prefs?: UserPreferences }
 * Response: OpenFoodFacts product + score
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { barcode, prefs } = body;
    if (!barcode) {
      return NextResponse.json({ error: "barcode required" }, { status: 400 });
    }

    // Query OpenFoodFacts (world)
    const offUrl = `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(barcode)}.json`;
    const res = await fetch(offUrl, { next: { revalidate: 60 * 60 } });
    if (!res.ok) {
      return NextResponse.json({ error: "OpenFoodFacts fetch failed", status: res.status }, { status: 502 });
    }
    const data = await res.json();

    if (data.status === 0) {
      return NextResponse.json({ error: "product_not_found" }, { status: 404 });
    }
    const product = data.product;

    const score = scoreProduct(product, prefs);

    return NextResponse.json({ product, score });
  } catch (err: any) {
    console.error("api/scanner error", err);
    return NextResponse.json({ error: err?.message || "internal error" }, { status: 500 });
  }
}
