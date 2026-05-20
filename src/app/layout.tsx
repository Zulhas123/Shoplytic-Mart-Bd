import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/presentation/components/Navbar";
import { Footer } from "@/presentation/components/Footer";

export const metadata: Metadata = {
  title: "Shoplytic",
  description: "Simple Commerce. Fast Shopping. Clean Experience."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col bg-white text-slate-900">
        <Navbar />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
