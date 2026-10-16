"use client";

import HeroCarousel from "./HeroCarousel";
import ContestantGrid from "./ContestantGrid";
import LeaderboardSection from "./LeaderboardSection";
import ContestantModals from "./ContestantModals";
import { useContestants } from "./useContestants";

export function ContestantsPageSection() {
  const {
    pool,
    contestants,
    isLoading,
    loadError,
    reloadContestants,
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
        hasContestants={contestants.length > 0}
        isLoading={isLoading}
        loadError={loadError}
        carouselIdx={carouselIdx}
        setCarouselIdx={setCarouselIdx}
        carouselGender={carouselGender}
        setCarouselGender={setCarouselGender}
        openVotePayment={openVotePayment}
        flash={flash}
      />

      {loadError && (
        <div className="border-y border-red-900/40 bg-red-950/20 px-6 py-5 text-center">
          <p role="alert" className="font-raleway text-sm text-red-300">
            {loadError}
          </p>
          <button
            type="button"
            onClick={reloadContestants}
            className="mt-3 border border-red-300/30 px-4 py-2 font-raleway text-xs uppercase tracking-wider text-red-200 hover:bg-red-900/30"
          >
            Try again
          </button>
        </div>
      )}

      <ContestantGrid
        gridPool={gridPool}
        isLoading={isLoading}
        loadError={loadError}
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
