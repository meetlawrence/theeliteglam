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
      ref={galleryRef}
      className={`bg-[#060606] py-24 overflow-hidden transition-all duration-1000 ${inView ? "opacity-100" : "opacity-0"}`}
    >
      <div className="max-w-[1300px] mx-auto px-8">
        <SectionLabel text="Gallery" />
        <h2 className="font-cinzel text-[clamp(1.6rem,3.5vw,2.6rem)] text-[#F5EDD6] tracking-[0.06em] mt-4 mb-12">
          Moments from the Stage
        </h2>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ transform: `translateX(calc(-${activeSlide * 100}% / 1))` }}
        >
          {GALLERY.map((img, i) => (
            <div key={i} className="min-w-full h-[520px] relative flex-shrink-0">
              <div className="relative w-full h-full">
                <Image src={img.url} alt={img.caption} fill className="object-cover object-top" />
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,8,8,0.7)_0%,transparent_50%)]" />
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 font-cinzel text-[0.8rem] tracking-[0.3em] text-[#C9A84C] uppercase whitespace-nowrap">
                {img.caption}
              </div>
            </div>
          ))}
        </div>

        <CarouselBtn dir="left" onClick={prevSlide} />
        <CarouselBtn dir="right" onClick={nextSlide} />

        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {GALLERY.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`rounded-full transition-all duration-300 ${i === activeSlide ? "w-6 bg-[#C9A84C]" : "w-2 bg-[rgba(201,168,76,0.3)]"} h-1`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
