import "../globals.css";
import { cinzel, playfair, raleway } from "@/app/fonts";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${raleway.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
