"use client";

export function InvoiceClientActions() {
  return (
    <button
      type="button"
      className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
      onClick={() => window.print()}
    >
      Print / Save PDF
    </button>
  );
}

