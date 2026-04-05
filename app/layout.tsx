import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://canstack.vercel.app"),
  title: "CanStack",
  description:
    "A Canadian contractor benefits dashboard with onboarding, recommendations, tax estimates, RRSP planning, and subscription gating.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={`${fraunces.variable} ${manrope.variable}`}>
        {children}
      </body>
    </html>
  );
}
