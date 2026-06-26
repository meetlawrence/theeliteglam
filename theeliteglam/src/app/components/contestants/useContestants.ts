"use client";

import { useEffect, useState } from "react";
import { Contestant, Gender } from "./types";

const BASE: Contestant[] = [
  { id: 1, name: "Adaeze Okonkwo",   state: "Lagos",         age: 23, gender: "female", number: "F01", bio: "A fierce advocate for mental health awareness and female entrepreneurship across Southern Nigeria.", image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=700&q=80", votes: 4821, occupation: "Entrepreneur & Brand Strategist", advocacy: "Mental Health Awareness", funFact: "Speaks four Nigerian languages fluently.", tribe: "Igbo" },
  { id: 2, name: "Fatima Abdullahi", state: "Abuja",         age: 21, gender: "female", number: "F02", bio: "A passionate medical student using her platform to drive community health initiatives in underserved areas.", image: "https://images.unsplash.com/photo-1770393391946-7d9b658deec3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=700&q=80", votes: 3976, occupation: "Medical Student", advocacy: "Rural Healthcare Access", funFact: "Founded a free health clinic at age 19.", tribe: "Hausa-Fulani" },
  { id: 3, name: "Chisom Eze",       state: "Enugu",         age: 24, gender: "female", number: "F03", bio: "A creative fashion designer committed to sustainable African fashion and environmental consciousness.", image: "https://images.unsplash.com/photo-1593351799227-75df2026356b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=700&q=80", votes: 3502, occupation: "Fashion Designer", advocacy: "Sustainable Fashion & Climate Action", funFact: "Her designs have been worn at Lagos Fashion Week.", tribe: "Igbo" },
  { id: 4, name: "Blessing Idibia",  state: "Port Harcourt", age: 22, gender: "female", number: "F04", bio: "A gifted performing artist who uses music and drama to counsel and uplift at-risk youth in the Niger Delta.", image: "https://images.unsplash.com/photo-1713845784497-fe3d7ed176d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=700&q=80", votes: 2988, occupation: "Performing Artist & Counsellor", advocacy: "Youth Development & Arts Therapy", funFact: "Has performed in 6 countries before age 22.", tribe: "Ijaw" },
  { id: 5, name: "Ngozi Obi",        state: "Anambra",       age: 25, gender: "female", number: "F05", bio: "A legal practitioner championing gender equality and the rights of women and girls in the Nigerian legal system.", image: "https://images.unsplash.com/photo-1613876215075-276fd62c89a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=700&q=80", votes: 2644, occupation: "Legal Practitioner", advocacy: "Gender Equality & Women's Rights", funFact: "Called to bar at 23 with First Class Honours.", tribe: "Igbo" },
  { id: 6, name: "Emeka Dike",       state: "Lagos",         age: 26, gender: "male",   number: "M01", bio: "A visionary architect and clean energy advocate designing sustainable housing for low-income communities.", image: "https://images.unsplash.com/photo-1642257859842-c95f9fa8121d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=700&q=80", votes: 4413, occupation: "Architect & Energy Consultant", advocacy: "Clean Energy & Affordable Housing", funFact: "Designed Nigeria's first solar-powered community centre.", tribe: "Igbo" },
  { id: 7, name: "Tunde Bakare",     state: "Ogun",          age: 24, gender: "male",   number: "M02", bio: "An award-winning filmmaker using storytelling to reshape how Africa is perceived on the global stage.", image: "https://images.unsplash.com/photo-1624670319970-37aa780d4874?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=700&q=80", votes: 3755, occupation: "Filmmaker & Creative Director", advocacy: "African Narrative & Media Representation", funFact: "His debut short film screened at Cannes.", tribe: "Yoruba" },
  { id: 8, name: "Chukwuma Eze",     state: "Rivers",        age: 23, gender: "male",   number: "M03", bio: "A professional sports coach using athletics to instil discipline, teamwork and leadership in young Nigerians.", image: "https://images.unsplash.com/photo-1659444003277-6cb0a5ffc8bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=700&q=80", votes: 3101, occupation: "Sports Coach & Youth Mentor", advocacy: "Youth Empowerment Through Sport", funFact: "Trained three national athletics champions.", tribe: "Igbo" },
  { id: 9, name: "Abubakar Musa",    state: "Kano",          age: 27, gender: "male",   number: "M04", bio: "A social entrepreneur revolutionising food production in Northern Nigeria through tech-driven agriculture.", image: "https://images.unsplash.com/photo-1588178454780-441fa5b99fa5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=700&q=80", votes: 2719, occupation: "Agricultural Innovator", advocacy: "Food Security & Rural Development", funFact: "His agri-tech startup feeds 10,000 families monthly.", tribe: "Hausa" },
];

const VOTE_LIMIT = 3;

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
    const timer = setTimeout(() => setCarouselIdx(0), 0);
    return () => clearTimeout(timer);
  }, [carouselGender]);

  const handleVoteSuccess = (id: number, qty: number) => {
    setVoted((current) => ({ ...current, [id]: (current[id] ?? 0) + qty }));
    setContestants((current) => current.map((c) => c.id === id ? { ...c, votes: c.votes + qty } : c));
    setFlash(id);
    setTimeout(() => setFlash(null), 900);
  };

  const openVotePayment = (contestant: Contestant) => {
    if ((voted[contestant.id] ?? 0) >= VOTE_LIMIT) return;
    setVoteTarget(contestant);
  };

  const pool = contestants.filter((contestant) => contestant.gender === carouselGender);
  const gridPool = contestants.filter((contestant) => gridFilter === "all" || contestant.gender === gridFilter);
  const femaleRanked = [...contestants].filter((contestant) => contestant.gender === "female").sort((a, b) => b.votes - a.votes);
  const maleRanked = [...contestants].filter((contestant) => contestant.gender === "male").sort((a, b) => b.votes - a.votes);

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
    VOTE_LIMIT,
  };
}
