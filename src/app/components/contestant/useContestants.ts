"use client";

import { useEffect, useState } from "react";
import type { Contestant, Gender } from "./types";

function normalizeContestant(item: Record<string, unknown>, index: number): Contestant {
  const genderValue = String(item.gender ?? "").toLowerCase();
  const gender: Gender = genderValue === "male" ? "male" : "female";
  const voteCount =
    typeof item._count === "object" && item._count !== null && "votes" in item._count
      ? Number((item._count as { votes?: number }).votes ?? 0)
      : Number(item.votes ?? item.score ?? 0);

  return {
    id: index + 1,
    databaseId: String(item.id ?? ""),
    name: String(item.stageName || item.name || "Contestant"),
    stageName: String(item.stageName ?? item.name ?? ""),
    state: String(item.state ?? ""),
    age: Number(item.age) || 0,
    gender,
    number: String(item.rank ?? item.number ?? String(index + 1).padStart(2, "0")),
    bio: String(item.bio ?? ""),
    image:
      typeof item.image === "string" && item.image.trim()
        ? item.image
        : "/images/contestant-placeholder.svg",
    votes: Number.isFinite(voteCount) ? voteCount : 0,
    occupation: String(item.occupation ?? ""),
    advocacy: String(item.advocacy ?? ""),
    funFact: String(item.funFact ?? ""),
    tribe: String(item.tribe ?? ""),
  };
}

export function useContestants() {
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [voted, setVoted] = useState<Record<number, number>>({});
  const [carouselGender, setCarouselGender] = useState<Gender>("female");
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [gridFilter, setGridFilter] = useState<"all" | Gender>("all");
  const [flash, setFlash] = useState<number | null>(null);
  const [selected, setSelected] = useState<Contestant | null>(null);
  const [voteTarget, setVoteTarget] = useState<Contestant | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadContestants = async () => {
      setIsLoading(true);
      setLoadError("");

      try {
        const response = await fetch("/api/contestants/get-contestants", {
          cache: "no-store",
        });
        const payload = await response.json();

        if (!response.ok || payload?.success === false) {
          throw new Error(
            payload?.message ||
              "Contestants API is unavailable",
          );
        }

        const rawData: unknown = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : null;
        if (!Array.isArray(rawData)) {
          throw new Error("Contestants API returned an invalid response");
        }

        const approvedContestants = rawData.reduce<Contestant[]>(
          (approved, item) => {
            if (
              item &&
              typeof item === "object" &&
              "status" in item &&
              String(item.status).toUpperCase() === "ACTIVE"
            ) {
              approved.push(
                normalizeContestant(
                  item as Record<string, unknown>,
                  approved.length,
                ),
              );
            }
            return approved;
          },
          [],
        );

        if (isMounted) setContestants(approvedContestants);
      } catch (error) {
        console.error("Failed to fetch approved contestants", error);
        if (isMounted) {
          setContestants([]);
          setLoadError(
            error instanceof Error
              ? error.message
              : "Unable to load contestants.",
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadContestants();
    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  const handleVoteSuccess = (id: number, qty: number) => {
    setVoted((current) => ({ ...current, [id]: (current[id] ?? 0) + qty }));
    setContestants((current) =>
      current.map((contestant) =>
        contestant.id === id
          ? { ...contestant, votes: contestant.votes + qty }
          : contestant,
      ),
    );
    setFlash(id);
    setTimeout(() => setFlash(null), 900);
  };

  const openVotePayment = (contestant: Contestant) => {
    setVoteTarget(contestant);
  };

  const pool = contestants.filter((contestant) => contestant.gender === carouselGender);
  const gridPool = contestants.filter(
    (contestant) => gridFilter === "all" || contestant.gender === gridFilter,
  );
  const femaleRanked = [...contestants]
    .filter((contestant) => contestant.gender === "female")
    .sort((a, b) => b.votes - a.votes);
  const maleRanked = [...contestants]
    .filter((contestant) => contestant.gender === "male")
    .sort((a, b) => b.votes - a.votes);

  return {
    pool,
    isLoading,
    loadError,
    reloadContestants: () => setReloadKey((current) => current + 1),
    contestants,
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
  };
}
