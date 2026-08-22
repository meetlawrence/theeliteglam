import { LogOut } from "lucide-react";

export function AdminFooter() {
  return (
    <footer>
      {/* Bottom bar */}
      <div className="border-t border-[#C9A84C]/10 py-6 px-8">
        <div className="max-w-325 mx-auto flex justify-between items-center flex-wrap gap-4 font-raleway text-xs  tracking-[0.08em] text-[#5A5040]">
          <p>
            © 2025 The Elite Glam. All rights reserved. Unveiling Excellence. Embracing Diversity
          </p>
          <div className="flex gap-8">
            {["Privacy Policy", "Terms of Use", "Cookie Policy"].map((item) => (
              <a key={item} href="#" className="hover:text-[#C9A84C] transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
