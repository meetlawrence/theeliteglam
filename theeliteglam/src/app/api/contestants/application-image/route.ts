import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { uploadContestantImage } from "@/back-end/db/cloudinary";
import { contestantTransactionService } from "@/back-end/services/contestant-transaction-service";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");
    const reference = formData.get("reference");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "An image file is required." },
        { status: 400 },
      );
    }

    if (typeof reference !== "string" || !reference.trim()) {
      return NextResponse.json(
        { success: false, error: "A payment reference is required." },
        { status: 400 },
      );
    }

    const transaction =
      await contestantTransactionService.getContestantTransactionByReference(reference.trim());
    if (!transaction.success || !transaction.data) {
      return NextResponse.json(
        { success: false, error: transaction.error || "Payment transaction not found." },
        { status: transaction.status || 404 },
      );
    }

    if (transaction.data.status !== "SUCCESS") {
      return NextResponse.json(
        { success: false, error: "A successful payment is required before uploading an application image." },
        { status: 403 },
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
    console.error("Contestant application image upload failed:", error);
    return NextResponse.json(
      { success: false, error: "Unable to upload contestant image." },
      { status: 500 },
    );
  }
}
