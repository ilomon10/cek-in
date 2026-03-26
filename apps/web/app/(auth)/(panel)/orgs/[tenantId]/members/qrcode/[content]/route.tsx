import { NextRequest, NextResponse } from "next/server";
import qrcode from "qrcode";

export async function GET(
  _req: NextRequest,
  ctx: { params: { content: string } },
) {
  // Extract the data to encode from a query parameter
  const { content } = await ctx.params;

  try {
    // Generate the QR code as a PNG buffer
    const pngBuffer = await qrcode.toBuffer(content, { type: "png" });

    // Return the image buffer as a response
    return new NextResponse(pngBuffer as any, {
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
