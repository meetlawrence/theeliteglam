export function FinancialsView() {
  return (
    <div className="space-y-8">
      <div className="border border-[#1a170e] bg-[#080808] p-10 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <p className="text-[0.65rem] uppercase tracking-[0.36em] text-[#C9A84C]">Financial Dashboard</p>
        <h1 className="mt-3 text-4xl font-serif text-[#F5EDD6]">Revenue & Payments</h1>
      </div>

      <div className="border border-[#1a170e] bg-[#080808] p-8">
        <p className="text-[#9A8C6A]">Track revenue, payments, and financial transactions.</p>
        <p className="text-[#666] text-sm mt-4">Financial reports and transaction history will appear here.</p>
      </div>
    </div>
  );
}
