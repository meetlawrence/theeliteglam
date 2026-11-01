import { NextResponse } from "next/server";
import { eventModel } from "@/back-end/models/event-model";

export async function GET() {
  try {
    const eventStatus = await eventModel.findStatus();
    return NextResponse.json(
      { success: true, data: eventStatus },
      {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=60",
        },
      },
    );
  } catch (error) {
    console.error("[GET /api/event/status]", error);
    return NextResponse.json(
      { success: false, message: "Unable to fetch event status." },
      { status: 500 },
    );
  }
}
