import { cache } from "react";
import { prisma } from "@/back-end/db/db-connect";
import { evaluateEventStatus } from "./event-status";

const defaultEventStatus = {
  isRegistrationOpen: false,
  isTicketsOpen: false,
  isVotingOpen: false,
  isContestantsVisible: false,
};

export const getEventStatus = cache(async () => {
  const event = await prisma.event.findFirst({
    select: {
      isRegistrationOpen: true,
      isTicketsOpen: true,
      isVotingOpen: true,
      isContestantsVisible: true,
    },
  });

  return event ? evaluateEventStatus(event) : defaultEventStatus;
});
