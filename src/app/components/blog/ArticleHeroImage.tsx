import Image from "next/image";

interface ArticleHeroImageProps {
  image: string;
  title: string;
}

export function ArticleHeroImage({ image, title }: ArticleHeroImageProps) {
  return (
    <div className="relative h-[280px] sm:h-[420px] lg:h-[480px] w-full rounded-xl overflow-hidden mb-12 border border-[#C9A84C]/20 shadow-lg">
      <Image src={image} alt={title} fill priority className="object-cover" />
    </div>
  );
}