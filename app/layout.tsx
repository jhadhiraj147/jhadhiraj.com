import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

// UI chrome - navigation, buttons, labels, pills
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

// Display - hero name, section headings, large statements
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

// Body copy - descriptions, paragraphs, readable prose
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Dhiraj Jha | Systems Engineer",
  description:
    "Systems engineer with experience in Linux internals, distributed systems and scalable backend design. CS and Math student at Fisk University, class of 2028. Intern at Google and Vanderbilt University. Founder of offtofly, the deterministic travel operating system.",
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
      "Systems engineer with experience in Linux internals, distributed systems and AI automation. CS and Math student at Fisk University, class of 2028. Intern at Google and Vanderbilt University. Founder of offtofly.",
    url: "https://jhadhiraj.com",
    siteName: "Dhiraj Jha Portfolio",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dhiraj Jha | Systems Engineer",
    description:
      "Systems engineer with Linux internals, distributed systems and AI automation experience. Intern at Google and Vanderbilt. Founder of offtofly.",
    creator: "@jhadhiraj147",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eaf6ff" },
    { media: "(prefers-color-scheme: dark)",  color: "#0f172a" },
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
      className={`${spaceGrotesk.variable} ${playfairDisplay.variable} ${inter.variable} scroll-smooth`}
    >
      <body className="font-sans antialiased bg-white">
        {children}
      </body>
    </html>
  );
}
