import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/presentation/components/Navbar";
import { Footer } from "@/presentation/components/Footer";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`),
  title: {
    default: "Shoplytic",
    template: "%s | Shoplytic"
  },
  description: "Simple Commerce. Fast Shopping. Clean Experience.",
  applicationName: "Shoplytic",
  keywords: ["ecommerce", "shop", "storefront", "products", "checkout", "orders"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Shoplytic",
    title: "Shoplytic",
    description: "Simple Commerce. Fast Shopping. Clean Experience.",
    url: "/"
  },
  twitter: {
    card: "summary_large_image",
    title: "Shoplytic",
    description: "Simple Commerce. Fast Shopping. Clean Experience."
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={[inter.variable, "flex min-h-dvh flex-col bg-white text-slate-900"].join(" ")}>
        <Navbar />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
