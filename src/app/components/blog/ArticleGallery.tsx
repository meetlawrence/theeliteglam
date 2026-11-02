import Image from "next/image";

interface ArticleGalleryProps {
  images: string[];
  title: string;
}

export function ArticleGallery({ images, title }: ArticleGalleryProps) {
  const validImages = images.filter((img) => img && img.trim() !== "");

  if (validImages.length === 0) return null;

  return (
    <section className="my-10">
      <div
        className={`columns-1 ${
          validImages.length === 2
            ? "sm:columns-2"
            : validImages.length >= 3
            ? "sm:columns-2 lg:columns-3"
            : ""
        } gap-4 sm:gap-6 space-y-4 sm:space-y-6`}
      >
        {validImages.map((imgUrl, idx) => (
          <div
            key={idx}
            className="break-inside-avoid relative w-full bg-[#121212] overflow-hidden group border border-[#C9A84C]/15"
          >
            <Image
              src={imgUrl}
              alt={`${title} Photo ${idx + 1}`}
              width={0}
              height={0}
              sizes="(max-width: 768px) 100vw, 33vw"
              className="w-full h-auto object-contain transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
}