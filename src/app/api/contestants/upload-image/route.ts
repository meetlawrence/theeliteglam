import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { uploadContestantImage } from "@/back-end/db/cloudinary";
import { authMiddleware } from "@/back-end/lib/route-middleware/admin";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(req: NextRequest) {
  const authResult = await authMiddleware(req);
  if (!authResult.success) {
    return authResult.response;
  }

  try {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "An image file is required." },
        { status: 400 },
      );
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json(
        { success: false, error: "Upload a JPG, PNG, or WebP image." },
        { status: 400 },
      );
    }

    if (file.size === 0 || file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { success: false, error: "Image must be no larger than 5 MB." },
        { status: 400 },
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const imageData = `data:${file.type};base64,${bytes.toString("base64")}`;
    const imageUrl = await uploadContestantImage(imageData);

    return NextResponse.json({ success: true, data: { imageUrl } });
  } catch (error) {
    console.error("Contestant image upload failed:", error);
    return NextResponse.json(
      { success: false, error: "Unable to upload contestant image." },
      { status: 500 },
    );
  }
}