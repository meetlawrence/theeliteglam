import { NextResponse } from "next/server";
import { eventService } from "../../../../back-end/services/event-service";

export async function GET() {
  const result = await eventService.getFirstEventId();
  return NextResponse.json(result, { status: result.status });
}
