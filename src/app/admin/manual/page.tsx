export const dynamic = "force-static";

export default function AdminManualPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Admin manual</h2>
        <p className="text-sm text-slate-600">
          How to operate the admin panel, manage products, orders, customers, and deliveries.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h3 className="text-base font-semibold">Admin role</h3>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
          <li>Manage catalog (products and categories).</li>
          <li>Review and update orders (confirm/reject and monitor status).</li>
          <li>Review customer logs and contact details.</li>
          <li>Manage delivery operations (agents, assignments, tracking, and reports).</li>
          <li>Maintain security (change admin password regularly).</li>
        </ul>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h3 className="text-base font-semibold">Catalog management</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
          <li>
            Go to <span className="font-medium">Admin → Products</span> to add/edit/delete products.
          </li>
          <li>
            Use <span className="font-medium">Categories</span> to create categories and keep product listing organized.
          </li>
          <li>When creating a product, ensure name, description, and price are provided.</li>
        </ol>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h3 className="text-base font-semibold">Order operations</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
          <li>
            Go to <span className="font-medium">Admin → Orders</span> to view order history.
          </li>
          <li>
            For <span className="font-medium">PENDING</span> orders, click <span className="font-medium">Confirm</span> or{" "}
            <span className="font-medium">Reject</span>.
          </li>
          <li>Use customer name/phone to contact the customer when needed.</li>
        </ol>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h3 className="text-base font-semibold">Delivery agent process</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
          <li>
            Register agents in <span className="font-medium">Admin → Delivery agents</span> (name, phone, address, vehicle, zone).
          </li>
          <li>
            Assign orders in <span className="font-medium">Admin → Deliveries</span> using <span className="font-medium">Assign agent…</span>.
          </li>
          <li>
            Update <span className="font-medium">Delivery status</span> (ASSIGNED → PENDING → COMPLETED) or set CANCELED if required.
          </li>
          <li>
            Update <span className="font-medium">Payment status</span> (UNPAID/PAID/COD) and set <span className="font-medium">Delivery charge</span> if applicable.
          </li>
          <li>
            Check performance in <span className="font-medium">Admin → Delivery reports</span> (agent summary, earnings, category sales, daily/monthly stats).
          </li>
        </ol>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h3 className="text-base font-semibold">Security & settings</h3>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
          <li>
            Use <span className="font-medium">Admin → Settings (password)</span> to change admin password.
          </li>
          <li>Do not share admin credentials.</li>
        </ul>
      </div>
    </div>
  );
}

