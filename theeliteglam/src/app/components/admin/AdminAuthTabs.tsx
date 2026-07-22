type AdminTab = "login" | "create";

type AdminAuthTabsProps = {
  activeTab: AdminTab;
  onChange: (tab: AdminTab) => void;
};

export default function AdminAuthTabs({ activeTab, onChange }: AdminAuthTabsProps) {
  return (
    <div className="flex border-b border-[#222] mb-8">
      <button
        type="button"
        onClick={() => onChange("login")}
        className={`flex-1 pb-3 text-xs font-bold tracking-widest uppercase transition-colors ${
          activeTab === "login"
            ? "text-[#F5EDD6] border-b-2 border-[#C9A84C]"
            : "text-[#444] hover:text-muted-foreground"
        }`}
      >
        Login
      </button>

      <button
        type="button"
        onClick={() => onChange("create")}
        className={`flex-1 pb-3 text-xs font-bold tracking-widest uppercase transition-colors ${
          activeTab === "create"
            ? "text-[#F5EDD6] border-b-2 border-[#C9A84C]"
            : "text-[#444] hover:text-muted-foreground"
        }`}
      >
        Create Account
      </button>
    </div>
  );
}

export type { AdminTab };
