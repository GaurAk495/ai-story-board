import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Storyboard AI — Turn Ideas Into Cinematic Visuals",
    template: "%s | Storyboard AI",
  },
  description:
    "Transform any story idea into a fully visualized, shot-by-shot AI storyboard in seconds. Choose your art style — Anime, Cinematic, Stickman & more. Powered by Gemini AI and Pollinations.ai.",
  keywords: [
    "AI storyboard generator",
    "storyboard AI",
    "AI image generator",
    "cinematic storyboard",
    "Pollinations AI",
    "Gemini AI story",
    "anime storyboard",
    "visual storytelling AI",
    "script to storyboard",
    "AI filmmaking tool",
  ],
  authors: [{ name: "Storyboard AI" }],
  creator: "Storyboard AI",
  metadataBase: new URL("https://ai-story-board.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ai-story-board.vercel.app",
    title: "Storyboard AI — Turn Ideas Into Cinematic Visuals",
    description:
      "Transform any idea into a shot-by-shot storyboard in seconds. Multiple art styles — Anime, Cinematic Movie, Stickman, Kids Book & more.",
    siteName: "Storyboard AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Storyboard AI — AI-Powered Visual Storyboarding",
    description:
      "Script to storyboard in seconds. Choose Anime, Cinematic, Stickman & more styles. Powered by Gemini AI + Pollinations.ai.",
    creator: "@GaurAk495",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050510] text-white font-sans">
        {children}
      </body>
    </html>
  );
}
