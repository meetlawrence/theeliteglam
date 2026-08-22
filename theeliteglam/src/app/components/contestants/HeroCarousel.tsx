import type { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { Heart, ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { Contestant, Gender } from "./types";

export function HeroCarousel({
  pool,
  carouselIdx,
  setCarouselIdx,
  carouselGender,
  setCarouselGender,
  openVotePayment,
  flash,
}: {
  pool: Contestant[];
  carouselIdx: number;
  setCarouselIdx: Dispatch<SetStateAction<number>>;
  carouselGender: Gender;
  setCarouselGender: Dispatch<SetStateAction<Gender>>;
  openVotePayment: (c: Contestant) => void;
  flash: number | null;
}) {
  const prev = () => setCarouselIdx((i: number) => (i - 1 + pool.length) % pool.length);
  const next = () => setCarouselIdx((i: number) => (i + 1) % pool.length);

  return (
    <div className="relative pt-20 pb-24 overflow-hidden bg-linear-to-b from-[#0a0a0a] to-[#080808]">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-cinzel text-[clamp(5rem,20vw,18rem)] font-black text-[rgba(201,168,76,0.045)] tracking-[0.04em] leading-none whitespace-nowrap">
          POPULAR VOTE
        </span>
      </div>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(201,168,76,0.07)_0%,transparent_70%)]" />

      <div className="text-center relative mb-12">
        <div className="mx-auto flex items-center justify-center gap-3 text-[0.68rem] tracking-[0.5em] uppercase text-[#C9A84C] mb-3">
          <span className="inline-block w-7 h-px bg-[#C9A84C]" />
          Cast Your Vote · Season 2026–2027
          <span className="inline-block w-7 h-px bg-[#C9A84C]" />
        </div>
        <h1 className="font-cinzel text-[clamp(1.8rem,4.5vw,3.6rem)] text-[#F5EDD6] tracking-[0.07em] leading-[1.1] mb-2">
          Who Deserves the{" "}
          <span className="bg-[linear-gradient(135deg,#C9A84C,#F0C04A)] bg-clip-text text-transparent">
            Crown?
          </span>
        </h1>
      </div>

      <div className="flex justify-center gap-0 mb-14">
        {(["female", "male"] as Gender[]).map((g, idx) => (
          <button
            key={g}
            onClick={() => setCarouselGender(g)}
            className={`font-cinzel text-[0.7rem] tracking-[0.22em] uppercase px-9 py-2 transition-all duration-300 ${carouselGender === g ? "text-[#080808] bg-[linear-gradient(135deg,#C9A84C,#8B6914)]" : "text-muted-foreground bg-transparent border border-[rgba(201,168,76,0.12)]"} ${idx === 1 ? "-ml-px" : ""}`}
          >
            {g === "female" ? "Female" : "Male"}
          </button>
        ))}
      </div>

      <div className="relative">
        <div
          style={{ perspective: "1200px", perspectiveOrigin: "50% 40%" }}
          className="h-120 relative flex items-center justify-center"
        >
          {pool.map((c, i) => {
            const offset = (i - carouselIdx + pool.length) % pool.length;
            const signed = offset > pool.length / 2 ? offset - pool.length : offset;
            if (Math.abs(signed) > 2) return null;

            const abs = Math.abs(signed);
            const scale = 1 - abs * 0.13;
            const rotateY = -signed * 18;
            const tx = signed * 230;
            const tz = -abs * 90;
            const opacity = 1 - abs * 0.22;
            const zIndex = 10 - abs;
            const isCenter = signed === 0;

            return (
              <div
                key={c.id}
                onClick={() => !isCenter && setCarouselIdx(i)}
                className="absolute w-65 h-105"
                style={{
                  transform: `translateX(${tx}px) translateZ(${tz}px) rotateY(${rotateY}deg) scale(${scale})`,
                  transformOrigin: "center center",
                  zIndex,
                  opacity,
                  transition: "all 0.55s cubic-bezier(0.4,0,0.2,1)",
                  cursor: isCenter ? "default" : "pointer",
                }}
              >
                <div
                  className={`w-full h-full relative overflow-hidden ${isCenter ? "border-[rgba(201,168,76,0.55)]" : "border-[rgba(201,168,76,0.18)]"}`}
                >
                  <div className="absolute inset-0">
                    <Image src={c.image} alt={c.name} fill className="object-cover object-top" />
                  </div>
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                    <span className="font-cinzel text-[0.6rem] tracking-[0.18em] text-[#C9A84C] bg-black/70 px-2 py-1 border border-[rgba(201,168,76,0.3)]">
                      {c.number}
                    </span>
                    {isCenter && (
                      <span className="font-raleway text-[0.52rem] tracking-[0.18em] text-[#080808] bg-linear-to-r from-[#C9A84C] to-[#8B6914] px-2 py-1 uppercase">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="font-cinzel text-[0.95rem] text-[#F5EDD6] leading-[1.2] mb-1">
                      {c.name}
                    </div>
                    <div className="font-raleway text-[0.62rem] tracking-[0.2em] text-[#C9A84C] uppercase mb-3">
                      {c.state} · Age {c.age}
                    </div>
                    {isCenter && (
                      <div className="flex items-center justify-between pt-3 border-t border-[rgba(201,168,76,0.18)]">
                        <div className="flex items-center gap-2">
                          <Heart
                            size={13}
                            className={`text-[#C9A84C] ${flash === c.id ? "fill-[#C9A84C]" : ""}`}
                          />
                          <span
                            className={`font-cinzel text-[0.82rem] ${flash === c.id ? "text-accent" : "text-[#C4B896]"}`}
                          >
                            {c.votes.toLocaleString()}
                          </span>
                        </div>
                        <button
                          onClick={() => openVotePayment(c)}
                          className="font-cinzel text-[0.6rem] flex items-center gap-2 tracking-[0.18em] uppercase px-3 py-2 bg-[linear-gradient(135deg,#C9A84C,#8B6914)] text-[#080808]"
                        >
                          <Star size={10} /> Vote
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={prev}
          className="absolute top-1/2 -translate-y-1/2 left-8 w-12 h-12 flex items-center justify-center  bg-[rgba(8,8,8,0.75)] border border-[rgba(201,168,76,0.3)] z-20"
        >
          <ChevronLeft size={22} className="text-[#C9A84C]" />
        </button>
        <button
          onClick={next}
          className="absolute top-1/2 -translate-y-1/2 right-8 w-12 h-12 flex items-center justify-center bg-[rgba(8,8,8,0.75)] border border-[rgba(201,168,76,0.3)] z-20"
        >
          <ChevronRight size={22} className="text-[#C9A84C]" />
        </button>

        <div className="flex justify-center gap-2 mt-10">
          {pool.map((_, i) => (
            <button
              key={i}
              onClick={() => setCarouselIdx(i)}
              className={`h-1 rounded-full transition-all duration-300 ${i === carouselIdx ? "w-7 bg-[#C9A84C]" : "w-2 bg-[rgba(201,168,76,0.25)]"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HeroCarousel;
