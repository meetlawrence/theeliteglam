"use client";

import HeroCarousel from "./HeroCarousel";
import ContestantGrid from "./ContestantGrid";
import LeaderboardSection from "./LeaderboardSection";
import ContestantModals from "./ContestantModals";
import { useContestants } from "./useContestants";

export function ContestantsPageSection() {
  const {
    pool,
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
  } = useContestants();

  return (
    <div className="bg-[#080808] pt-19.5">
      <HeroCarousel
        pool={pool}
        carouselIdx={carouselIdx}
        setCarouselIdx={setCarouselIdx}
        carouselGender={carouselGender}
        setCarouselGender={setCarouselGender}
        openVotePayment={openVotePayment}
        flash={flash}
      />

      <ContestantGrid
        gridPool={gridPool}
        gridFilter={gridFilter}
        setGridFilter={setGridFilter}
        openVotePayment={openVotePayment}
        setSelected={setSelected}
        flash={flash}
      />

      <ContestantModals
        selected={selected}
        voteTarget={voteTarget}
        flash={flash}
        openVotePayment={openVotePayment}
        onCloseSelected={() => setSelected(null)}
        onCloseVoteTarget={() => setVoteTarget(null)}
        onVoteSuccess={(qty) => voteTarget && handleVoteSuccess(voteTarget.id, qty)}
      />

      <LeaderboardSection femaleRanked={femaleRanked} maleRanked={maleRanked} />
    </div>
  );
}
