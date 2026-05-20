"use client";

import { useEffect, useState } from "react";

export type MeUser = {
  id: string;
  email: string;
  name: string;
  address: string | null;
  role: "USER" | "ADMIN";
};

export function useMe() {
  const [user, setUser] = useState<MeUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await res.json();
        if (!canceled) setUser(data.user ?? null);
      } catch {
        if (!canceled) setUser(null);
      } finally {
        if (!canceled) setLoading(false);
      }
    })();
    return () => {
      canceled = true;
    };
  }, []);

  return { user, loading, refresh: async () => window.location.reload() };
}

