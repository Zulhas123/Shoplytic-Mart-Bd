import Link from "next/link";

function SocialIcon({
  children,
  label
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700">
      <span className="sr-only">{label}</span>
      {children}
    </span>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-3">
        <div className="flex flex-nowrap items-center justify-between gap-4 overflow-x-auto">
          <p className="shrink-0 text-sm font-semibold tracking-tight text-slate-900">
            Shoplytic
          </p>

          <nav
            aria-label="Footer"
            className="flex shrink-0 flex-nowrap items-center gap-4 text-sm"
          >
            <Link className="text-slate-600 hover:text-slate-900" href="/products">
              Products
            </Link>
            <Link className="text-slate-600 hover:text-slate-900" href="/cart">
              Cart
            </Link>
            <Link className="text-slate-600 hover:text-slate-900" href="/orders">
              Orders
            </Link>
          </nav>

          <div className="flex shrink-0 flex-nowrap items-center gap-2">
            <a
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              href="https://pixel-pivot.netlify.app/"
              target="_blank"
              rel="noreferrer"
            >
              <SocialIcon label="Pixel Pivot website">
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M3 12C3 7.582 6.582 4 11 4H13C17.418 4 21 7.582 21 12C21 16.418 17.418 20 13 20H11C6.582 20 3 16.418 3 12Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M8 12H16M12 8V16"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </SocialIcon>
              <span className="font-medium">Pixel Pivot</span>
            </a>

            <a
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              href="https://shorturl.at/xAmRX"
              target="_blank"
              rel="noreferrer"
            >
              <SocialIcon label="Fiverr profile">
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M8.5 6.8C8.5 5.254 9.754 4 11.3 4H16.5V6.2H11.6C11.103 6.2 10.7 6.603 10.7 7.1V9H16.5V11.2H10.7V20H8.5V11.2H6V9H8.5V6.8Z"
                    fill="currentColor"
                    opacity="0.9"
                  />
                </svg>
              </SocialIcon>
              <span className="font-medium">Fiverr</span>
            </a>
          </div>

          <p className="shrink-0 text-xs text-slate-500">(c) {year} Shoplytic</p>
        </div>
      </div>
    </footer>
  );
}
