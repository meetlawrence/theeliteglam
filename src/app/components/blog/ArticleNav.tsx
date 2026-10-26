import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ArticleNavProps {
  readTime: string;
}

export function ArticleNav() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-[#C9A84C]/15">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-xs font-['Raleway',sans-serif] uppercase tracking-widest text-muted-foreground hover:text-[#C9A84C] transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Journal
      </Link>
    </div>
  );
}

export function ArticleFooterNav({ readTime }: ArticleNavProps) {
  return (
      <div className="mt-16 pt-8 border-[#C9A84C]/20 flex items-center justify-between">
        <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-['Raleway',sans-serif] uppercase tracking-widest text-muted-foreground hover:text-[#C9A84C] transition-colors"
        >
            <ArrowLeft size={14} />
            All Stories
        </Link>
    </div>
  );
}