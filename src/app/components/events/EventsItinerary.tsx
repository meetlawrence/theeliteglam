"use client";

import { useEffect, useRef, useState } from "react";
import SectionLabel from "./SectionLabel";
import ItineraryRow from "./ItineraryRow";
import { ITINERARY } from "./eventsData";

export default function EventsItinerary() {
  const [inView, setInView] = useState(false);
  const [activeDay, setActiveDay] = useState(0);
  const itineraryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = itineraryRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.03 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={itineraryRef}
      className={`bg-[#060606] px-8 py-28 transition-all duration-1000 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"}`}
    >
      <div className="max-w-[1300px] mx-auto">
        <SectionLabel text="Event Itinerary" />
        <h2 className="font-cinzel text-[clamp(1.6rem,3.5vw,2.8rem)] text-[#F5EDD6] tracking-[0.06em] mt-4 mb-12">
          Four Days of Excellence
        </h2>

        <div className="flex flex-wrap border-b border-[rgba(201,168,76,0.15)] mb-12">
          {ITINERARY.map((day, i) => (
            <button
              key={day.day}
              onClick={() => setActiveDay(i)}
              className={`font-cinzel text-[0.72rem] tracking-[0.2em] uppercase transition-all duration-300 pb-4 px-8 ${
                activeDay === i
                  ? "text-accent border-b-2 border-accent"
                  : "text-[#9A8C6A] border-b-2 border-transparent"
              }`}
            >
              {day.day}
            </button>
          ))}
        </div>

        {ITINERARY.map((day, i) => (
          <div
            key={day.day}
            className={`${i === activeDay ? "grid grid-cols-1 gap-12 lg:grid-cols-[280px_1fr] lg:gap-16 items-start" : "hidden"} itinerary-inner`}
          >
            <div>
              <div className="font-cinzel text-[3.5rem] text-[rgba(201,168,76,0.12)] leading-none tracking-wider mb-2">
                {day.day.replace("Day ", "")}
              </div>
              <div className="font-raleway text-[0.7rem] tracking-[0.25em] uppercase text-accent mb-2">
                {day.date}
              </div>
              <div className="font-cinzel text-[1.15rem] text-[#F5EDD6] tracking-[0.04em] leading-[1.3]">
                {day.title}
              </div>
            </div>

            <div className="flex flex-col gap-0">
              {day.events.map((ev, j) => (
                <ItineraryRow
                  key={ev.name}
                  ev={ev}
                  index={j}
                  isLast={j === day.events.length - 1}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
