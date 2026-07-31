import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Fira_Code } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-cormorant"
});
const firaCode = Fira_Code({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Aegis",
  description: "Real-time phishing detector",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} ${firaCode.variable}`} suppressHydrationWarning>
      <body className="antialiased min-h-screen text-white font-sans overflow-x-hidden relative"
        suppressHydrationWarning
        style={{
          background: "linear-gradient(119.15deg, #00162F 14.53%, #002F6B 60.01%, #E8E8E8 88.13%)",
          backgroundAttachment: "fixed"
        }}>

        {/* Giant background text decoration (Aegis watermark) */}
        <div className="fixed -z-10 text-white overflow-hidden select-none pointer-events-none watermark w-full text-center">
          Aegis
        </div>

        {children}
      </body>
    </html>
  );
}
