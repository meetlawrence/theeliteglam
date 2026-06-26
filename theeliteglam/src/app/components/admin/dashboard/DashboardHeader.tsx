export function DashboardHeader() {
  return (
    <section className="border border-[#1a170e] bg-[#080808] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.36em] text-[#C9A84C]">Admin dashboard</p>
          <h1 className="text-4xl font-serif text-[#F5EDD6]">Welcome back, operations lead</h1>
        </div>
        <div className="border border-[#1a170e] bg-[#0D0D0D] px-6 py-4 text-xs tracking-wider text-[#B6AC92] max-w-sm">
          Monitor pageant metrics and complete priority actions from one secure portal.
        </div>
      </div>
    </section>
  );
}
