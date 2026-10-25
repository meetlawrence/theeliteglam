import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import { BlogPost } from "./blogData";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group bg-[#121212] border border-[#C9A84C]/15 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-[#C9A84C]/40 hover:-translate-y-1 shadow-lg">
      <div>
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-80" />
          
        </div>

        <div className="p-6 space-y-3">
          <div className="flex items-center gap-3 text-[0.7rem] text-[#7A6E52] font-['Raleway',sans-serif]">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {post.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {post.readTime}
            </span>
          </div>

          <h3 className="font-['Cinzel',serif] text-lg text-[#F5EDD6] group-hover:text-[#C9A84C] transition-colors line-clamp-2">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>

          <p className="font-['Raleway',sans-serif] text-xs text-[#9A8C6A] leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 pt-2">
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-[0.75rem] font-['Cinzel',serif] uppercase tracking-wider text-[#C9A84C] hover:text-[#F5EDD6] transition-colors group/link"
        >
          Read Article
          <ArrowRight size={12} className="transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}

export function BlogEmptyState() {
  return (
    <div className="text-center py-16 space-y-3 bg-[#121212] border border-[#C9A84C]/15 p-8">
      <Tag size={32} className="mx-auto text-[#7A6E52]" />
      <h3 className="font-['Cinzel',serif] text-lg text-[#F5EDD6]">No articles found</h3>
      <p className="font-['Raleway',sans-serif] text-xs text-[#9A8C6A]">
        Try adjusting your search query or switching category filters.
      </p>
    </div>
  );
}