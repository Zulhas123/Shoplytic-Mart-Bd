import Image from "next/image";
import Link from "next/link";
import { HeroCarousel } from "@/presentation/components/HeroCarousel";

function Feature({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

function OfferCard({
  title,
  subtitle,
  badge
}: {
  title: string;
  subtitle: string;
  badge: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-sky-500/20 via-indigo-500/10 to-fuchsia-500/20 blur-2xl transition group-hover:scale-110" />
      <p className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
        {badge}
      </p>
      <p className="mt-4 text-lg font-semibold tracking-tight text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
      <div className="mt-5 flex items-center gap-2 text-sm font-medium text-slate-900">
        <span>Explore</span>
        <span aria-hidden="true" className="transition group-hover:translate-x-0.5">
          -&gt;
        </span>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="grid gap-10 md:grid-cols-2 md:items-center">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Fast, clean shopping experience
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              Shop smarter with a modern storefront built for speed.
            </h1>
            <p className="text-base leading-7 text-slate-600">
              Shoplytic makes online shopping feel effortless - curated products, transparent
              pricing, and a checkout flow that stays out of your way.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              href="/products"
            >
              Browse products
            </Link>
            <Link
              className="rounded-md border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              href="/cart"
            >
              View cart
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Feature
              title="Secure checkout"
              description="Clean flow, clear totals, and smooth order tracking after purchase."
            />
            <Feature
              title="Fast discovery"
              description="Find what you need quickly with a tidy layout and product cards."
            />
            <Feature
              title="Reliable delivery"
              description="Stay updated from order confirmation to delivery at your door."
            />
          </div>
        </div>

        <div className="space-y-4">
          <HeroCarousel />
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Support
              </p>
              <p className="mt-1 text-sm font-medium text-slate-900">Quick, helpful replies</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Pricing
              </p>
              <p className="mt-1 text-sm font-medium text-slate-900">No hidden surprises</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Quality
              </p>
              <p className="mt-1 text-sm font-medium text-slate-900">Curated and verified</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              Customer offers
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Simple deals that keep the experience premium - clear savings, quick checkout,
              and delivery updates you can trust.
            </p>
          </div>
          <Link className="text-sm font-semibold text-slate-900 hover:underline" href="/products">
            View all products
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <OfferCard
            badge="Bundle savings"
            title="Buy more, save more"
            subtitle="Add multiple items to your cart and enjoy better pricing without surprises."
          />
          <OfferCard
            badge="Fast ship"
            title="Quick dispatch"
            subtitle="Orders are prepared quickly so you can receive items sooner."
          />
          <OfferCard
            badge="New buyer"
            title="Welcome perks"
            subtitle="A friendly first-order experience designed to build confidence and loyalty."
          />
        </div>
      </section>

      <section className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 md:items-center md:p-10">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Product quality
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
            Showcase quality with details customers actually read.
          </h2>
          <p className="text-sm leading-6 text-slate-600">
            From clear descriptions to neat product presentation, Shoplytic is designed to
            highlight what matters: craftsmanship, materials, and the confidence to click
            &ldquo;Place order&rdquo; without hesitation.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
              High-quality imagery and clean layout that looks premium on any device.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Clear pricing and cart totals that reduce checkout drop-off.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Smooth browsing so customers can focus on products, not clutter.
            </li>
          </ul>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-indigo-500/10 to-fuchsia-500/10" />
          <div className="relative grid gap-4">
            <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="relative h-12 w-12 overflow-hidden rounded-xl">
                <Image
                  src="/quality-badge.svg"
                  alt="Quality badge"
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">Quality check</p>
                <p className="text-xs text-slate-600">
                  Curated products with clear info and clean presentation.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">Customer-first UX</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Friendly layout, readable typography, and quick actions.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">Trusted checkout</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Simple totals and consistent cart behavior.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">Fast navigation</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Get to products quickly and keep browsing smoothly.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">Offers that convert</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Highlight value with clean offer cards and strong CTAs.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                href="/products"
              >
                Start shopping
              </Link>
              <Link
                className="rounded-md border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                href="/register"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
