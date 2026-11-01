import { unstable_cache } from "next/cache";
import { eventModel } from "@/back-end/models/event-model";

export const getCachedEventStatus = unstable_cache(
  () => eventModel.findStatus(),
  ["event-status"],
  { revalidate: 60, tags: ["event-status"] },
);
