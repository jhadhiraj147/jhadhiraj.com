import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const consoleFont = localFont({
  src: "../public/fonts/WebPlus_IBM_VGA_8x16.woff",
  variable: "--font-console",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Terminal",
  description:
    "Dhiraj Jha — Embedded Systems | System Engineer. Software Developer (part-time) at Vanderbilt University. CS + Mathematics at Fisk University and ECE at Vanderbilt University. Graduation: May 2028. Previously an intern at Google.",
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
  metadataBase: new URL("https://www.jhadhiraj.com"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Dhiraj Jha | Embedded Systems | System Engineer",
    description:
      "Software Developer (part-time) at Vanderbilt University. Systems software, Linux internals, and backend infrastructure. Previously a Software Developer Intern at Google.",
    url: "https://www.jhadhiraj.com",
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
    title: "Dhiraj Jha | Embedded Systems | System Engineer",
    description:
      "Software Developer (part-time) at Vanderbilt University. Systems software and backend infrastructure. Previously a Software Developer Intern at Google.",
    creator: "@jhadhiraj147",
    images: ["/assets/hero/og-card.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#032630",
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={consoleFont.variable}
    >
      <body className="font-mono bg-page">
        <a className="skip-link" href="#terminal-command">Skip to terminal input</a>
        {children}
      </body>
    </html>
  );
}
