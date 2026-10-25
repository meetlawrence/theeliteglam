import { Search } from "lucide-react";

interface BlogFilterProps {
  categories: readonly string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function BlogFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}: BlogFilterProps) {
  return (
    <section className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 pb-6 border-b border-[#C9A84C]/15">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-4 py-2 text-xs font-['Raleway',sans-serif] tracking-wider uppercase whitespace-nowrap transition-all  border ${
              selectedCategory === cat
                ? "bg-[#C9A84C] text-[#080808] border-[#C9A84C] font-semibold shadow-[0_0_15px_rgba(201,168,76,0.2)]"
                : "bg-[#121212] text-[#9A8C6A] border-[#C9A84C]/20 hover:border-[#C9A84C]/50 hover:text-[#F5EDD6]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="relative min-w-[260px]">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A6E52]" />
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-[#121212] border border-[#C9A84C]/20 pl-10 pr-4 py-2.5 text-xs font-['Raleway',sans-serif] text-[#F5EDD6] placeholder-[#5A5040] focus:outline-none focus:border-[#C9A84C] transition-colors"
        />
      </div>
    </section>
  );
}