interface AdminContestantHeaderProps {
  query: string;
  onQueryChange: (value: string) => void;
  onCreate?: () => void;
}

export default function AdminContestantHeader({
  query,
  onQueryChange,
}: AdminContestantHeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-[0.6rem] uppercase tracking-[0.36em] text-[#C9A84C]">
          Contestants Management
        </p>
        <h2 className="font-cinzel text-3xl text-cream tracking-widest leading-tight mb-1">All Contestants</h2>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search name or number"
          className="min-w-[200px] p-2 bg-[#0D0D0D] border border-[#1a170e] text-[#F5EDD6]"
        />
      </div>
    </div>
  );
}
