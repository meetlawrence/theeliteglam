"use client";

import { Contestant } from "./types";
import { VotePaymentModal, ContestantModal } from "./Modals";

export default function ContestantModals({
  selected,
  voteTarget,
  voted,
  flash,
  VOTE_LIMIT,
  openVotePayment,
  onCloseSelected,
  onCloseVoteTarget,
  onVoteSuccess,
}: {
  selected: Contestant | null;
  voteTarget: Contestant | null;
  voted: Record<number, number>;
  flash: number | null;
  VOTE_LIMIT: number;
  openVotePayment: (contestant: Contestant) => void;
  onCloseSelected: () => void;
  onCloseVoteTarget: () => void;
  onVoteSuccess: (qty: number) => void;
}) {
  return (
    <>
      {selected && (
        <ContestantModal
          contestant={selected}
          votesLeft={VOTE_LIMIT - (voted[selected.id] ?? 0)}
          flashing={flash === selected.id}
          onVote={() => openVotePayment(selected)}
          onClose={onCloseSelected}
        />
      )}

      {voteTarget && (
        <VotePaymentModal
          contestant={voteTarget}
          onSuccess={(qty) => {
            onVoteSuccess(qty);
            onCloseVoteTarget();
          }}
          onClose={onCloseVoteTarget}
        />
      )}
    </>
  );
}
