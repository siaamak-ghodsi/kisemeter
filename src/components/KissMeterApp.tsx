"use client";

import { useCallback, useState } from "react";
import { APP_NAME, HERO_DEDICATION, FOOTER_TEXT } from "@/lib/constants";
import type { Boy } from "@/lib/types";
import { AddBoyFlow } from "./AddBoyFlow";
import { FortuneWheel } from "./FortuneWheel";
import { RankingTable } from "./RankingTable";

type Props = {
  initialBoys: Boy[];
  initialError?: string | null;
};

export function KissMeterApp({ initialBoys, initialError = null }: Props) {
  const [boys, setBoys] = useState<Boy[]>(initialBoys);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [adding, setAdding] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/boys", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا");
      setBoys(data.boys);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در بارگذاری");
    } finally {
      setLoading(false);
    }
  }, []);

  async function removeBoy(id: string) {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/boys/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا در حذف");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در حذف");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <p className="hero-for">{HERO_DEDICATION}</p>
        <h1 className="brand">{APP_NAME}</h1>
        <p className="hero-tagline">
          کیو بیشتر دوست داری؟ امتیاز بده، رتبه‌بندی کن، گردونه رو بچرخون.
        </p>
      </header>

      <main className="main">
        {loading && <p className="empty-state">داره لود می‌شه…</p>}

        {!loading && error && (
          <div className="error-banner">
            <p>{error}</p>
            <button type="button" className="ghost-btn" onClick={() => void load()}>
              دوباره تلاش کن
            </button>
          </div>
        )}

        {!loading && !error && !adding && (
          <>
            <section className="panel">
              <div className="panel-head">
                <h2 className="section-title">جدول رتبه‌بندی</h2>
                <button
                  type="button"
                  className="primary-btn compact"
                  onClick={() => setAdding(true)}
                >
                  + افزودن پسر
                </button>
              </div>
              <RankingTable
                boys={boys}
                onRemove={removeBoy}
                busyId={busyId}
              />
            </section>

            <FortuneWheel names={boys.map((b) => b.name)} />
          </>
        )}

        {adding && (
          <AddBoyFlow
            onCancel={() => setAdding(false)}
            onCreated={() => {
              setAdding(false);
              void load();
            }}
          />
        )}
      </main>

      <footer className="site-footer">
        <p>{FOOTER_TEXT}</p>
      </footer>
    </div>
  );
}
