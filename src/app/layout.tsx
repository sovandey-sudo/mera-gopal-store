import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Mera Gopal | Divine Seva",
    template: "%s | Mera Gopal",
  },
  description:
    "Mera Gopal – Divine Seva. Laddu Gopal products, Radha Rani dresses, devotional essentials, gemstones and astrology services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen w-full overflow-x-hidden`}
      >
        <Header />

        <main className="w-full flex-1 min-w-0">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}