"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Slide = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

export function HeroCarousel() {
  const slides: Slide[] = useMemo(
    () => [
      {
        title: "New Season Drops",
        description:
          "Fresh picks updated weekly - discover trending essentials, best sellers, and new arrivals in one smooth browse.",
        imageSrc: "/hero-abstract-1.svg",
        imageAlt: "Abstract colorful gradient background"
      },
      {
        title: "Deals That Feel Premium",
        description:
          "Limited-time offers with clear pricing, fast checkout, and reliable delivery tracking from cart to door.",
        imageSrc: "/hero-abstract-2.svg",
        imageAlt: "Abstract storefront gradient illustration"
      },
      {
        title: "Quality You Can Trust",
        description:
          "Curated products, verified details, and a clean shopping experience designed to keep things simple.",
        imageSrc: "/hero-abstract-3.svg",
        imageAlt: "Abstract wave gradient illustration"
      }
    ],
    []
  );

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveIndex((idx) => (idx + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(id);
  }, [slides.length]);

  const active = slides[activeIndex];

  return (
    <section
      aria-label="Highlights"
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="grid gap-0 md:grid-cols-2">
        <div className="relative min-h-[240px] md:min-h-[320px]">
          <Image
            priority
            src={active.imageSrc}
            alt={active.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-slate-950/10 to-transparent" />
        </div>

        <div className="flex flex-col justify-between gap-6 p-6 md:p-8">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Featured
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
              {active.title}
            </h2>
            <p className="text-sm leading-6 text-slate-600 md:text-base">
              {active.description}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2" role="tablist" aria-label="Select slide">
              {slides.map((s, idx) => (
                <button
                  key={s.title}
                  type="button"
                  role="tab"
                  aria-selected={idx === activeIndex}
                  aria-label={`Show slide ${idx + 1}`}
                  className={[
                    "h-2.5 w-2.5 rounded-full transition",
                    idx === activeIndex ? "bg-slate-900" : "bg-slate-300 hover:bg-slate-400"
                  ].join(" ")}
                  onClick={() => setActiveIndex(idx)}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                onClick={() =>
                  setActiveIndex((idx) => (idx - 1 + slides.length) % slides.length)
                }
              >
                Prev
              </button>
              <button
                type="button"
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setActiveIndex((idx) => (idx + 1) % slides.length)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
