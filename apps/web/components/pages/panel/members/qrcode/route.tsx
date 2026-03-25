// app/api/qr/route.js
import { NextResponse } from "next/server";
import qrcode from "qrcode";

export async function GET(request) {
  // Extract the data to encode from a query parameter
  const { searchParams } = new URL(request.url);
  const text = searchParams.get("text") || "Default QR Code Value";

  try {
    // Generate the QR code as a PNG buffer
    const pngBuffer = await qrcode.toBuffer(text, { type: "png" });

    // Return the image buffer as a response
    return new NextResponse(pngBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 },
    );
  }
}
