import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "The Mortgage Calculator App | Max Purchase Price",
  description: "Calculate your maximum affordable home purchase price before you buy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lexend.variable} antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans bg-slate-50 touch-manipulation" suppressHydrationWarning>
        <Header />
        <div className="flex flex-col min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-5rem)]">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
