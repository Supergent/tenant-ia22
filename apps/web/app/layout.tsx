import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@jn7ed9ecyrkk0hy21eehbbj6bx7sk268/components";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Minimal Todo App",
  description: "A minimal, ultra-simple todo list with real-time updates",
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-background text-text-primary`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
