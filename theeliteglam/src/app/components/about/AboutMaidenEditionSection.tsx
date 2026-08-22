import { SectionLabel } from "./AboutShared";

type AboutMaidenEditionSectionProps = {
  images: string[];
};

export function AboutMaidenEditionSection({ images }: AboutMaidenEditionSectionProps) {
  return (
    <div className="bg-[#060606] px-8 py-28">
      <div className="mx-auto max-w-[1300px]">
        <SectionLabel text="Maiden Edition" />
        <div className="mt-10 grid gap-20 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="mb-6 font-['Cinzel',serif] text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.1] tracking-[0.05em] text-[#F5EDD6]">
              Where It All{" "}
              <span className="bg-[linear-gradient(135deg,#C9A84C,#F0C04A)] bg-clip-text text-transparent">
                Began
              </span>
            </h2>
            {[
              "The maiden edition of The Elite Glam was held in Calabar in 2025, marking a watershed moment in Nigerian pageantry. For the first time, a nationally organised pageant placed equal weight on male and female contestants — two crowns, one stage, one standard.",
              "With over 200 applicants from across Nigeria's six geopolitical zones, the inaugural season drew contestants of extraordinary calibre. The competition spanned four days of talent showcases, cultural presentations, panel interviews, and a dazzling Grand Finale that drew a live audience of over 2,000 guests.",
              "The event generated significant media coverage, trended nationally on social media, and was broadcast to audiences across West Africa — setting the tone for what The Elite Glam would become.",
            ].map((para, index) => (
              <p key={index} className="mb-4 font-['Raleway',sans-serif] text-[0.95rem] leading-[1.85] text-[#9A8C6A]">
                {para}
              </p>
            ))}

            <div className="mt-10 grid gap-6 border-t border-[rgba(201,168,76,0.12)] pt-8 sm:grid-cols-3">
              {[
                { value: "200+", label: "Applicants" },
                { value: "2,000+", label: "Live Audience" },
                { value: "4", label: "Competition Days" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="font-['Cinzel',serif] text-[1.8rem] leading-[1] tracking-[0.04em] text-[#F0C04A]">
                    {value}
                  </div>
                  <div className="mt-1 font-['Raleway',sans-serif] text-[0.65rem] uppercase tracking-[0.22em] text-[#9A8C6A]">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-rows-[260px_200px]">
            <div className="col-span-2 h-[260px] border border-[rgba(201,168,76,0.12)] bg-cover bg-[center_10%]" style={{ backgroundImage: `url(${images[0]})` }} />
            <div className="h-[200px] border border-[rgba(201,168,76,0.12)] bg-cover bg-[center_10%]" style={{ backgroundImage: `url(${images[1]})` }} />
            <div className="h-[200px] border border-[rgba(201,168,76,0.12)] bg-cover bg-[center_10%]" style={{ backgroundImage: `url(${images[2]})` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
