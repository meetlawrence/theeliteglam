import { User, Tag, Calendar } from "lucide-react";
import { BlogPost } from "./blogData";

interface ArticleHeaderProps {
  post: BlogPost;
}

export function ArticleHeader({ post }: ArticleHeaderProps) {
  return (
    <header className="space-y-6 mb-10">
      <h1 className="font-['Cinzel',serif] text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide text-[#F5EDD6] leading-[1.2]">
        {post.title}
      </h1>

      <div className="flex flex-wrap items-center gap-6 pt-2 font-['Raleway',sans-serif] text-xs text-[#9A8C6A] border-t border-[#C9A84C]/10 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 flex items-center justify-center text-[#C9A84C]">
            <User size={12} />
          </div>
          <span className="text-[#F5EDD6]">{post.author || "Editorial Team"}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Tag size={13} className="text-[#C9A84C]" />
          <span>Category: <strong className="text-[#F5EDD6]">{post.category}</strong></span>
        </div>

        <div className="flex items-center gap-1.5">
          <Calendar size={13} className="text-[#C9A84C]" />
          <span>{post.date}</span>
        </div>
      </div>
    </header>
  );
}