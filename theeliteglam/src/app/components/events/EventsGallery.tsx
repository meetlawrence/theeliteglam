"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import SectionLabel from "./SectionLabel";
import CarouselBtn from "./CarouselBtn";
import { GALLERY } from "./eventsData";

export default function EventsGallery() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [inView, setInView] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = galleryRef.current;
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

  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + GALLERY.length) % GALLERY.length);
  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % GALLERY.length);

  return (
    <section
      id="gallery"
      ref={galleryRef}
      className={`bg-[#060606] py-24 overflow-hidden transition-all duration-1000 ${inView ? "opacity-100" : "opacity-0"}`}
    >
      <div className="max-w-[1300px] mx-auto px-8">
        <SectionLabel text="Gallery" />
        <h2 className="font-cinzel text-[clamp(1.6rem,3.5vw,2.6rem)] text-[#F5EDD6] tracking-[0.06em] mt-4 mb-12">
          Moments from the Event
        </h2>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-600 ease-in-out"
          style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        >
          {GALLERY.map((img, i) => (
            <div key={i} className="min-w-full h-130 relative shrink-0 bg-[#020202]">
              <div className="relative h-full w-full overflow-hidden">
                <Image src={img.url} alt={img.caption} fill className="object-cover object-[center_30%]" />
              </div>
              
              <div className="absolute inset-0 bg-[linear-gradient(to_top,#060606_0%,rgba(6,6,6,0.85)_40%,transparent_100%)] pointer-events-none" />
              
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 font-cinzel text-[0.8rem] tracking-[0.3em] text-[#C9A84C] uppercase whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                {img.caption}
              </div>
            </div>
          ))}
        </div>

        <CarouselBtn dir="left" onClick={prevSlide} />
        <CarouselBtn dir="right" onClick={nextSlide} />

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2.5 z-10">
          {GALLERY.map((_, i) => {
            const isActive = i === activeSlide;
            return (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1 rounded-full transition-all duration-300 ${isActive ? "w-8 bg-[#C9A84C]" : "w-3 bg-[rgba(201,168,76,0.3)]"}`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}