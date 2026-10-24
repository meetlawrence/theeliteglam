import { NextResponse } from "next/server";
import { getEventStatus } from "../../../../back-end/lib/utils/get-event-status";

export async function GET() {
  try {
    const eventStatus = await getEventStatus();
    return NextResponse.json({ success: true, data: eventStatus });
  } catch (error) {
    console.error("[GET /api/event/status]", error);
    return NextResponse.json(
      { success: false, error: "Unable to fetch event status." },
      { status: 500 },
    );
  }
}
