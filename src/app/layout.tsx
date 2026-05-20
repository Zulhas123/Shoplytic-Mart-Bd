import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/presentation/components/Navbar";

export const metadata: Metadata = {
  title: "Shoplytic",
  description: "Simple Commerce. Fast Shopping. Clean Experience."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="mx-auto w-full max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}

