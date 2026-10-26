import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BlogPost } from "./blogData";

interface FeaturedPostProps {
  post: BlogPost;
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <article className="group bg-[#0D0D0D] border border-[#222222] hover:border-[#C9A84C]/40 transition-colors duration-500 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-7 relative h-[300px] sm:h-[400px] lg:h-auto w-full overflow-hidden bg-[#141414]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-102"
          />
        </div>

        <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between text-[0.7rem] font-['Raleway',sans-serif] tracking-[0.2em] text-[#8C8C8C] uppercase">
              <span className="text-[#C9A84C] font-medium">{post.category}</span>
              <span>{post.date}</span>
            </div>

            <h2 className="font-['Cinzel',serif] text-2xl sm:text-3xl font-light text-[#F5EDD6] leading-snug group-hover:text-[#C9A84C] transition-colors">
              <Link href={`/blog/${post.slug}`} className="focus:outline-none">
                {post.title}
              </Link>
            </h2>

            <p className="font-['Raleway',sans-serif] text-sm text-[#A3A3A3] font-light leading-relaxed">
              {post.excerpt}
            </p>
          </div>

          <div className="pt-8 mt-8 border-t border-[#1F1F1F] flex items-center justify-between">
            <span className="font-['Raleway',sans-serif] text-[0.7rem] tracking-[0.15em] text-[#666666] uppercase">
              {post.readTime}
            </span>

            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-2 text-xs font-['Cinzel',serif] tracking-[0.15em] text-[#F5EDD6] group-hover:text-[#C9A84C] transition-colors uppercase font-medium"
            >
              Read Article
              <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}