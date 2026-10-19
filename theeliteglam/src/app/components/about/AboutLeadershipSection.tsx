

type AboutLeadershipSectionProps = {
  image: string;
};

export function AboutLeadershipSection({ image }: AboutLeadershipSectionProps) {
  return (
    <div id="founder" className="mx-auto grid max-w-[1300px] gap-24 px-8 py-28 lg:grid-cols-[1fr_1.1fr] lg:items-center">
      <div className="relative">
        <div className="absolute left-[-18px] right-[18px] bottom-[-18px] top-[18px] border border-[rgba(201,168,76,0.2)]" />
        <div className="relative overflow-hidden pb-[130%]">
          <img
            src={image}
            alt="Founder & CEO | The EliteGlam Pageant Nigeria"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
          <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-[linear-gradient(to_top,rgba(8,8,8,0.55),transparent)]" />
        </div>
        <div className="absolute bottom-7 left-7 right-7 border border-[rgba(201,168,76,0.2)] bg-[rgba(8,8,8,0.82)] px-5 py-4 backdrop-blur">
          <div className="mb-1 font-['Cinzel',serif] text-[1rem] tracking-[0.06em] text-[#F5EDD6]">
            Emmanuel Oku
          </div>
          <div className="font-['Raleway',sans-serif] text-[0.65rem] uppercase tracking-[0.28em] text-[#C9A84C]">
            Founder & Chief Executive Officer
          </div>
        </div>
      </div>

      <div>
        <h2 className="mt-6 mb-7 font-['Cinzel',serif] text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.1] tracking-[0.05em] text-[#F5EDD6]">
          Built on a Dream,
          <br />
          <span className="bg-[linear-gradient(135deg,#C9A84C,#F0C04A)] bg-clip-text text-transparent">
            Driven by Purpose
          </span>
        </h2>

        <div className="mb-7 border-l-2 border-[rgba(201,168,76,0.35)] pl-6">
          <p className="font-['Playfair_Display',serif] text-[1rem] italic leading-[1.8] text-[#C4B896]">
            “I believe beauty is most powerful when it is guided by purpose. My vision has always been to create a platform where individuality is celebrated, potential is nurtured, and every voice has the opportunity to inspire meaningful change.”
          </p>
        </div>

        {[
          "Emmanuel Oku is a Nigerian entrepreneur, creative director, and pageant producer with over a decade of experience in Nigeria's entertainment and fashion industries.",
          "Driven by a vision to redefine African representation in global pageantry, Emmanuel founded The EliteGlam Pageant Nigeria in 2025, establishing a platform dedicated to celebrating diversity, empowering emerging talents, and championing beauty with purpose.",
          "Under his leadership, EliteGlam has forged strategic partnerships with internationally recognised pageant organisations, expanded opportunities for Nigerian talents on the global stage, and achieved remarkable international success, highlighted by Nigeria’s crowning as Miss Continental World 2026/2027.",
          "With a commitment to excellence, innovation, and purposeful leadership, Emmanuel continues to position EliteGlam as an emerging force in international pageantry, building a lasting legacy of empowerment, inclusivity, and African excellence.",
        ].map((para, index) => (
          <p key={index} className="mb-4 font-['Raleway',sans-serif] text-[0.95rem] leading-[1.85] text-[#9A8C6A]">
            {para}
          </p>
        ))}
      </div>
    </div>
  );
}
