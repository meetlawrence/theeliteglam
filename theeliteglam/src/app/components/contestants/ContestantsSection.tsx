"use client";

import HeroCarousel from "./HeroCarousel";
import ContestantGrid from "./ContestantGrid";
import LeaderboardSection from "./LeaderboardSection";
import ContestantModals from "./ContestantModals";
// import ApplyCta from "./ApplyCta";
import { useContestants } from "./useContestants";

export default function ContestantsSection() {
  const {
    pool,
    voted,
    carouselGender,
    setCarouselGender,
    carouselIdx,
    setCarouselIdx,
    gridFilter,
    setGridFilter,
    flash,
    selected,
    setSelected,
    voteTarget,
    setVoteTarget,
    handleVoteSuccess,
    openVotePayment,
    gridPool,
    femaleRanked,
    maleRanked,
    VOTE_LIMIT,
  } = useContestants();

  return (
    <div className="bg-[#080808] pt-19.5">
      <HeroCarousel
        pool={pool}
        carouselIdx={carouselIdx}
        setCarouselIdx={setCarouselIdx}
        carouselGender={carouselGender}
        setCarouselGender={setCarouselGender}
        voted={voted}
        openVotePayment={openVotePayment}
        flash={flash}
        VOTE_LIMIT={VOTE_LIMIT}
      />

      <ContestantGrid
        gridPool={gridPool}
        gridFilter={gridFilter}
        setGridFilter={setGridFilter}
        openVotePayment={openVotePayment}
        voted={voted}
        setSelected={setSelected}
        VOTE_LIMIT={VOTE_LIMIT}
        flash={flash}
      />

      <ContestantModals
        selected={selected}
        voteTarget={voteTarget}
        voted={voted}
        flash={flash}
        VOTE_LIMIT={VOTE_LIMIT}
        openVotePayment={openVotePayment}
        onCloseSelected={() => setSelected(null)}
        onCloseVoteTarget={() => setVoteTarget(null)}
        onVoteSuccess={(qty) => voteTarget && handleVoteSuccess(voteTarget.id, qty)}
      />

      {/* <ApplyCta /> */}

      <LeaderboardSection femaleRanked={femaleRanked} maleRanked={maleRanked} />
    </div>
  );
}
