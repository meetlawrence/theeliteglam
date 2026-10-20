export interface EventStatus {
  isRegistrationOpen: boolean;
  isTicketsOpen: boolean;
  isVotingOpen: boolean;
  isContestantsVisible: boolean;
}

export function evaluateEventStatus(event: EventStatus) {
  return {
    isRegistrationOpen: event.isRegistrationOpen,
    isTicketsOpen: event.isTicketsOpen,
    isVotingOpen: event.isVotingOpen,
    isContestantsVisible: event.isContestantsVisible,
  };
}
