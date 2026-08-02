"use client";

import { useEffect, useState } from "react";
import type { Contestant, Gender } from "./types";

const BASE: Contestant[] = [];

function normalizeContestant(item: Record<string, unknown>, index: number): Contestant {
  const genderValue = String(item.gender ?? item.Gender ?? "female").toLowerCase();
  const gender = genderValue === "male" ? "male" : "female";

  const rawId = item.id ?? item._id ?? item.contestantId;
  const id = typeof rawId === "number" ? rawId : Number(rawId) || index + 1;

  const votesValue =
    typeof item.votes === "number"
      ? item.votes
      : typeof item.voteCount === "number"
        ? item.voteCount
        : typeof item._count === "object" && item._count !== null && "votes" in item._count
          ? Number((item._count as { votes?: number }).votes ?? 0)
          : 0;

  const imageValue =
    typeof item.image === "string" && item.image.trim()
      ? item.image
      : typeof item.photo === "string" && item.photo.trim()
        ? item.photo
        : "/images/placeholder.png";

  return {
    id,
    name: String(item.name ?? item.fullName ?? "Unnamed contestant"),
    state: String(item.state ?? item.location ?? ""),
    age: Number(item.age) || 0,
    gender,
    number: String(item.number ?? item.contestantNumber ?? ""),
    bio: String(item.bio ?? item.description ?? ""),
    image: imageValue,
    votes: votesValue,
    occupation: String(item.occupation ?? ""),
    advocacy: String(item.advocacy ?? ""),
    funFact: String(item.funFact ?? item.fun_fact ?? ""),
    tribe: String(item.tribe ?? ""),
  };
}

function readStoredContestants(): Contestant[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem("eliteGlamClientContestants");
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.map((item: Record<string, unknown>, index: number) => normalizeContestant(item, index))
      : [];
  } catch (error) {
    console.error("Failed to read stored contestants", error);
    return [];
  }
}

function writeStoredContestants(contestants: Contestant[]) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem("eliteGlamClientContestants", JSON.stringify(contestants));
  } catch (error) {
    console.error("Failed to persist contestants", error);
  }
}

export function useContestants() {
  const [contestants, setContestants] = useState<Contestant[]>(BASE);
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
      const storedContestants = readStoredContestants();

      if (isMounted) {
        setContestants(storedContestants);
      }

      try {
        const response = await fetch("/api/contestants/get-contestants", { cache: "no-store" });
        if (!response.ok) {
          const message = response.status === 401 || response.status === 403
            ? "Contestants API requires admin authentication"
            : "Contestants API is unavailable";
          throw new Error(message);
        }

        const payload = await response.json();
        const rawData = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];

        const fetchedContestants = rawData.map((item: Record<string, unknown>, index: number) =>
          normalizeContestant(item, index)
        );

        const mergedContestants = fetchedContestants.length
          ? fetchedContestants
          : storedContestants;

        if (isMounted) {
          setContestants(mergedContestants);
        }

        writeStoredContestants(mergedContestants);
      } catch (error) {
        console.error("Failed to fetch contestants", error);
        if (isMounted) {
          setContestants(storedContestants);
        }
      }
    };

    void loadContestants();

    const handleContestantsUpdated = () => {
      const nextContestants = readStoredContestants();
      setContestants(nextContestants);
    };

    window.addEventListener("elite-glam-contestants-updated", handleContestantsUpdated);

    const timer = setTimeout(() => setCarouselIdx(0), 0);
    return () => {
      isMounted = false;
      window.removeEventListener("elite-glam-contestants-updated", handleContestantsUpdated);
      clearTimeout(timer);
    };
  }, []);

  const handleVoteSuccess = (id: number, qty: number) => {
    setVoted((current) => ({ ...current, [id]: (current[id] ?? 0) + qty }));
    setContestants((current) =>
      current.map((c) => (c.id === id ? { ...c, votes: c.votes + qty } : c))
    );
    setFlash(id);
    setTimeout(() => setFlash(null), 900);
  };

  const openVotePayment = (contestant: Contestant) => {
    setVoteTarget(contestant);
  };

  const pool = contestants.filter((contestant) => contestant.gender === carouselGender);
  const gridPool = contestants.filter(
    (contestant) => gridFilter === "all" || contestant.gender === gridFilter
  );
  const femaleRanked = [...contestants]
    .filter((contestant) => contestant.gender === "female")
    .sort((a, b) => b.votes - a.votes);
  const maleRanked = [...contestants]
    .filter((contestant) => contestant.gender === "male")
    .sort((a, b) => b.votes - a.votes);

  return {
    pool,
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
