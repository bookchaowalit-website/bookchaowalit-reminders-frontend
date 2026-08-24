import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tideboard | Bookchaowalit",
  description: "A quiet local reminder board.",
  metadataBase: new URL("https://bookchaowalit.com"),
  authors: [{ name: "Bookchaowalit", url: "https://bookchaowalit.com" }],
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={geistSans.variable + " " + geistMono.variable}>{children}</body>
    </html>
  );
}
