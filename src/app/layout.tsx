import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import LoadingScreen from "@/components/LoadingScreen";
import Script from "next/script";

const firaCode = Fira_Code({ subsets: ["latin"], weight: ["300", "700"] });

export const metadata: Metadata = {
  title: "Emmanuel U. Iziogo | Full-Stack Engineer",
  description:
    "Portfolio of Emmanuel U. Iziogo, a Full-Stack Engineer skilled in FastAPI, Django, Express.js, TypeScript, React, Next.js, Tailwind CSS, UI/UX and cloud-based integrations.",
  metadataBase: new URL("https://softverse.vercel.app"),
  keywords: [
    "Emmanuel U. Iziogo",
    "Emmanuel U. Iziogo portfolio",
    "Emmanuel U. Iziogo full-stack Engineer",
    "AI Engineer",
    "AI portfolio",
    "Website developer",
    "Software Engineer",
  ],
  authors: [{ name: "Emmanuel U. Iziogo" }],
  openGraph: {
    title: "Emmanuel U. Iziogo | Full-Stack Engineer",
    description:
      "Showcasing projects in Python, FastAPI, Django, Express.js, TypeScript, React, Next.js, and full-stack development.",
    url: "https://softverse.vercel.app",
    siteName: "Emmanuel U. Iziogo Portfolio",
    images: ["/images/Portfolio.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Emmanuel U. Iziogo Portfolio",
    description:
      "Full-Stack Engineer | FastAPI | Django | Express.js | TypeScript | React | Next.js | Tailwind CSS",
    images: ["/images/Portfolio.png"],
  },
  verification: {
    google: "3tVbPHEteGqMaeFM55uziuPmeqEb7xkEACxbDzcUahE",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={firaCode.className}>
        <Script
          id="schema-org"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Emmanuel U. Iziogo",
              jobTitle: "Full-Stack Engineer",
              description:
                "Full-Stack Engineer skilled in FastAPI, Django, Express.js, TypeScript, React, Next.js, Tailwind CSS, UI/UX Design, and building modern web experiences.",
              url: "https://softverse.vercel.app",
              sameAs: [
                "https://github.com/FlameGreat-1",
                "https://www.linkedin.com/in/flamegreat",
                "https://x.com/Flame_Great1?s=09",
                "https://instagram.com/FlameGreat_1",
              ],
            }),
          }}
        />
        <LoadingScreen />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
