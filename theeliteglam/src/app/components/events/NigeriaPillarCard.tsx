"use client";

import Image from "next/image";

const delayClasses = ["delay-200", "delay-300", "delay-400", "delay-500", "delay-600"];

export default function NigeriaPillarCard({
  pillar,
  index,
  inView,
}: {
  pillar: { heading: string; body: string; image: string };
  index: number;
  inView: boolean;
}) {
  const delayClass = inView ? delayClasses[index % delayClasses.length] : "delay-0";
  return (
    <div
      className={`group relative overflow-hidden min-h-85 flex flex-col justify-end p-7 cursor-default transition-all duration-400 ${delayClass} border border-[rgba(201,168,76,0.12)] shadow-none hover:border-[rgba(201,168,76,0.4)] hover:shadow-[0_0_40px_rgba(201,168,76,0.08)]`}
    >
      <div className="absolute inset-0">
        <Image
          src={pillar.image}
          alt={pillar.heading}
          fill
          className="object-cover object-top opacity-[0.35] transition-opacity duration-500 group-hover:opacity-50"
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.95)_0%,rgba(0,0,0,0.6)_50%,rgba(0,0,0,0.2)_100%)]" />
      <div className="relative">
        <div className="font-cinzel text-base mb-3 text-primary group-hover:text-accent transition-colors duration-300">
          {pillar.heading}
        </div>
        <p className="font-raleway text-[0.82rem] text-muted-foreground leading-[1.7]">
          {pillar.body}
        </p>
      </div>
    </div>
  );
}
