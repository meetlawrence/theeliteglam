"use client";

import type { Contestant } from "./types";
import { VotePaymentModal, ContestantModal } from "./Modals";

export default function ContestantModals({
  selected,
  voteTarget,
  flash,
  openVotePayment,
  onCloseSelected,
  onCloseVoteTarget,
  onVoteSuccess,
}: {
  selected: Contestant | null;
  voteTarget: Contestant | null;
  flash: number | null;
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
