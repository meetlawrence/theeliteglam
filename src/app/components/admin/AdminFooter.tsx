import { LogOut } from "lucide-react";

export function AdminFooter() {
  return (
    <footer>
      {/* Bottom bar */}
      <div className="border-t border-[#C9A84C]/10 py-6 px-8">
        <div className="max-w-325 mx-auto flex justify-around items-center flex-wrap gap-4 font-raleway text-xs text-[#5A5040]">
          <div className="flex items-center gap-6 flex-wrap">
            <p>© 2025 The Elite Glam. All rights reserved.</p>
            <span className="text-[#C9A84C]/30 hidden sm:inline">•</span>
            <p className="text-[#8B7D60]">
              Website by{" "}
              <a
                href="https://meetlawrence.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C9A84C] hover:underline tracking-wide transition-colors"
              >
                MeetLawrence
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
