export const dynamic = "force-static";

export default function ManualPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">User manual</h1>
        <p className="text-sm text-slate-600">
          Step-by-step guide to use the application from A to Z.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-base font-semibold">Quick start</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
          <li>Open <span className="font-medium">Products</span> and choose items you want to buy.</li>
          <li>Add items to <span className="font-medium">Cart</span>, then go to <span className="font-medium">Checkout</span>.</li>
          <li>Fill shipping info (name + phone + address) and place the order.</li>
          <li>Open <span className="font-medium">Orders</span> to track and view invoice.</li>
        </ol>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-base font-semibold">A to Z guide</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">A) Browse products</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
              <li>Go to <span className="font-medium">Products</span> to view all items.</li>
              <li>Click a product to see details.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">B) Add to cart</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
              <li>From product pages, add items to cart.</li>
              <li>Open <span className="font-medium">Cart</span> to adjust quantity and review totals.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">C) Checkout</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
              <li>Go to <span className="font-medium">Checkout</span> from the cart.</li>
              <li>Enter full name, phone (recommended), and address.</li>
              <li>Email is optional.</li>
              <li>Click <span className="font-medium">Place order</span> to create the order.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">D) View orders</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
              <li>Go to <span className="font-medium">Orders</span> to see your order list.</li>
              <li>Click an order to view shipping + items.</li>
              <li>Use <span className="font-medium">Invoice</span> for printable invoice.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">E) Payment (if enabled)</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
              <li>Open the invoice page and submit payment reference if required.</li>
              <li>After submission, the order can be marked as paid by the system/admin.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">F) Account (optional)</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
              <li>Use <span className="font-medium">Register</span> to create an account.</li>
              <li>Use <span className="font-medium">Login</span> to access profile and admin (if permitted).</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">G) Profile</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
              <li>Open <span className="font-medium">Profile</span> to view your account info.</li>
              <li>Use <span className="font-medium">Logout</span> from the top bar when finished.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">H) Admin (for admins only)</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
              <li>Open <span className="font-medium">Settings</span> to access admin pages.</li>
              <li><span className="font-medium">Order history</span>: confirm/reject/review orders.</li>
              <li><span className="font-medium">Customer logs</span>: list all orders with customer contact + products.</li>
              <li><span className="font-medium">Users</span>: view registered users.</li>
              <li><span className="font-medium">Products/Categories</span>: manage catalog.</li>
              <li><span className="font-medium">Settings (password)</span>: change admin password.</li>
            </ul>
          </section>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-base font-semibold">Tips</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
          <li>Always enter phone number at checkout so the admin can contact you.</li>
          <li>If you don’t see your phone on old orders, it may not have been saved at that time.</li>
          <li>Use the invoice page when you need a print-friendly view.</li>
        </ul>
      </div>
    </div>
  );
}

