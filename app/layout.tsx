import type { Metadata, Viewport } from "next";
import { Playfair_Display, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

// Display - hero name, section headings, large statements
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

// Technical type for the systems work: labels, diagrams, code, numbers
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

// Technical prose beside the diagrams
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-plex-sans",
  display: "swap",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Dhiraj Jha | Systems Engineer",
  description:
    "Systems engineer working on Linux internals, distributed systems and backend infrastructure. CS and Math student at Fisk University, class of 2028. Software developer at Vanderbilt University, previously an SRE intern at Google. Building FlashFS and offtofly.",
  keywords: [
    "Dhiraj Jha",
    "Systems Engineer",
    "Linux Internals",
    "Distributed Systems",
    "Google Intern",
    "Fisk University",
    "Go",
    "C++",
    "Backend Engineer",
    "Nashville",
    "offtofly",
  ],
  authors: [{ name: "Dhiraj Jha", url: "https://jhadhiraj.com" }],
  creator: "Dhiraj Jha",
  metadataBase: new URL("https://jhadhiraj.com"),
  openGraph: {
    title: "Dhiraj Jha | Systems Engineer",
    description:
      "Systems engineer working on Linux internals, distributed systems and backend infrastructure. Software developer at Vanderbilt University, previously an SRE intern at Google. Building FlashFS and offtofly.",
    url: "https://jhadhiraj.com",
    siteName: "Dhiraj Jha Portfolio",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/assets/hero/og-card.jpg",
        width: 1200,
        height: 629,
        alt: "Dhiraj Jha looking out at the San Francisco skyline",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dhiraj Jha | Systems Engineer",
    description:
      "Systems engineer working on Linux internals, distributed systems and backend infrastructure. Software developer at Vanderbilt, previously an SRE intern at Google.",
    creator: "@jhadhiraj147",
    images: ["/assets/hero/og-card.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#d5d8dc" },
    { media: "(prefers-color-scheme: dark)",  color: "#0d1117" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${plexMono.variable} ${plexSans.variable} scroll-smooth`}
    >
      <body className="font-sans antialiased bg-page">
        {children}
      </body>
    </html>
  );
}
