import type { Metadata, Viewport } from "next";
import { Jost, Style_Script, IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";
import { EVENT } from "@/lib/ondine/event";
import "./globals.css";

const display = localFont({ src: "./fonts/AriensNobela.otf", variable: "--font-display", display: "swap" });
const script = Style_Script({ subsets: ["latin"], weight: "400", variable: "--font-script", display: "swap" });
const body = Jost({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-body", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: `${EVENT.name} ${EVENT.year} · ${EVENT.dateLabel} | D. Harris Nadar Diamonds & Jewellery`,
  description: `${EVENT.dateLabel}: ${EVENT.leadOffer}. ${EVENT.tagline}. Reserve a showroom visit at ${EVENT.venue}, Nagercoil.`,
};

export const viewport: Viewport = {
  themeColor: "#221a52",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${script.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
