import Image from "next/image";

interface ArticleGalleryProps {
  images: string[];
  title: string;
}

export function ArticleGallery({ images, title }: ArticleGalleryProps) {
  const validImages = images.filter((img) => img && img.trim() !== "");

  if (validImages.length === 0) return null;

  return (
    <section className="my-10 space-y-6">

      <div
        className={`grid gap-4 sm:gap-6 ${
          validImages.length === 1
            ? "grid-cols-1"
            : validImages.length === 2
            ? "grid-cols-1 sm:grid-cols-2"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {validImages.map((imgUrl, idx) => (
          <div
            key={idx}
            className="relative h-[260px] sm:h-[320px] w-full bg-[#121212] overflow-hidden group border border-[#C9A84C]/15"
          >
            <Image
              src={imgUrl}
              alt={`${title} - Photo ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
}