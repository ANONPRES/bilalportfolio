import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const display = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "FaceHarmony AI — Educational Facial Geometry Analysis",
  description:
    "Analyze facial proportions, symmetry, and harmony from a photo. Educational geometry insights powered by MediaPipe Face Mesh — not a beauty score.",
};

/**
 * Root application layout with dark glassmorphic chrome.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${display.variable} ${body.variable} antialiased`}>
        <div className="relative min-h-screen overflow-x-hidden">
          <div className="ambient-grid pointer-events-none absolute inset-0 opacity-40" />
          <Navbar />
          <main className="relative z-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
