import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meridian – AI Career Intelligence",
  description: "The intelligent resume builder that rewrites, repositions, and critiques your professional narrative in real time.",
  keywords: "resume builder, AI resume, career intelligence, job application",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
