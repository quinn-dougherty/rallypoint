import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Header from "@/components/Header";
import { Suspense } from "react";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Bounties Platform",
  description: "Outsource and fund things lean and quick",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <Suspense>
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center">
          <Header />
          {children}
        </main>
      </body>
    </html>
    // </Suspense>
  );
}
