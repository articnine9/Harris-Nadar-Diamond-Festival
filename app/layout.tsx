import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { EVENT } from "@/lib/ondine/event";
import "./globals.css";

const display = Bodoni_Moda({ subsets: ["latin"], style: ["normal", "italic"], weight: ["400", "500"], variable: "--font-display", display: "swap" });
const body = Hanken_Grotesk({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-body", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: `${EVENT.name} ${EVENT.dateLabel} | D. Harris Nadar Diamonds & Jewellery`,
  description: `${EVENT.dateLabel}: ${EVENT.leadOffer}, free certification and private bridal consultations at the showroom.`,
};

export const viewport: Viewport = {
  themeColor: "#060c11",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
