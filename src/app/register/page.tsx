import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md space-y-3 rounded-lg border border-slate-200 bg-white p-6">
      <h1 className="text-xl font-semibold">Registration disabled</h1>
      <p className="text-sm text-slate-600">
        Customers do not need an account. Admin access is available via the login page.
      </p>
      <Link
        className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        href="/login"
      >
        Go to admin login
      </Link>
    </div>
  );
}

