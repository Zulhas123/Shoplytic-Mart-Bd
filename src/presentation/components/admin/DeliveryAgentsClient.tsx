"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDateTime } from "@/shared/utils/format";

export type DeliveryAgentRow = {
  id: string;
  name: string;
  phone: string;
  address: string;
  vehicleType: string;
  deliveryZone: string;
  status: "ACTIVE" | "INACTIVE";
  joinedAt: string | Date;
  createdAt: string | Date;
};

export function DeliveryAgentsClient(props: { initialAgents: DeliveryAgentRow[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [deliveryZone, setDeliveryZone] = useState("");

  const agents = useMemo(() => props.initialAgents, [props.initialAgents]);

  async function createAgent() {
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/delivery-agents", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          address,
          vehicleType,
          deliveryZone,
          status: "ACTIVE"
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Create failed");
      setName("");
      setPhone("");
      setAddress("");
      setVehicleType("");
      setDeliveryZone("");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Create failed");
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(agentId: string, next: "ACTIVE" | "INACTIVE") {
    setError(null);
    try {
      const res = await fetch(`/api/admin/delivery-agents/${agentId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: next })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Update failed");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    }
  }

  async function deleteAgent(agentId: string) {
    if (!confirm("Delete this delivery agent?")) return;
    setError(null);
    try {
      const res = await fetch(`/api/admin/delivery-agents/${agentId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Delete failed");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Delivery agents</h2>
        <p className="text-sm text-slate-600">Register and manage delivery agents/porters.</p>
      </div>

      {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-900">Agent name</span>
            <input className="rounded-md border border-slate-200 px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-900">Phone</span>
            <input className="rounded-md border border-slate-200 px-3 py-2" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" />
          </label>
          <label className="grid gap-1 text-sm md:col-span-2">
            <span className="font-medium text-slate-900">Address</span>
            <input className="rounded-md border border-slate-200 px-3 py-2" value={address} onChange={(e) => setAddress(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-900">Vehicle type</span>
            <input className="rounded-md border border-slate-200 px-3 py-2" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} placeholder="e.g. Bike / Car" />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-900">Delivery zone</span>
            <input className="rounded-md border border-slate-200 px-3 py-2" value={deliveryZone} onChange={(e) => setDeliveryZone(e.target.value)} placeholder="e.g. Dhaka North" />
          </label>
        </div>
        <button
          type="button"
          className="mt-3 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          disabled={saving || !name.trim() || !phone.trim() || !address.trim() || !vehicleType.trim() || !deliveryZone.trim()}
          onClick={createAgent}
        >
          {saving ? "Saving..." : "Add agent"}
        </button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="divide-y divide-slate-100">
          {agents.length === 0 ? (
            <div className="p-6 text-sm text-slate-600">No agents yet.</div>
          ) : (
            agents.map((a) => (
              <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="font-medium">{a.name}</div>
                    <span className={["rounded-full border px-2 py-0.5 text-xs font-semibold", a.status === "ACTIVE" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-700"].join(" ")}>
                      {a.status}
                    </span>
                  </div>
                  <div className="text-slate-600">{a.phone}</div>
                  <div className="text-slate-600">{a.vehicleType} • {a.deliveryZone}</div>
                  <div className="text-xs text-slate-500">Joined: {formatDateTime(a.joinedAt)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    onClick={() => toggleStatus(a.id, a.status === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
                  >
                    {a.status === "ACTIVE" ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    type="button"
                    className="rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                    onClick={() => deleteAgent(a.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

