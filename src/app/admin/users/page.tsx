import { PrismaUserRepository } from "@/infrastructure/repositories/PrismaUserRepository";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await new PrismaUserRepository().list();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Users</h2>
      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="divide-y divide-slate-100">
          {users.length === 0 ? (
            <div className="p-6 text-sm text-slate-600">No users yet.</div>
          ) : (
            users.map((u) => (
              <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
                <div className="space-y-1">
                  <div className="font-medium">{u.email}</div>
                  <div className="text-slate-600">{u.name}</div>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold">
                  {u.role}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
