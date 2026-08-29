"use client";

import type { Boy } from "@/lib/types";
import { MAX_TOTAL } from "@/lib/criteria";

type Props = {
  boys: Boy[];
  onRemove: (id: string) => Promise<void>;
  busyId: string | null;
};

export function RankingTable({ boys, onRemove, busyId }: Props) {
  if (boys.length === 0) {
    return (
      <p className="empty-state">هنوز کسی تو لیست نیست — یکی اضافه کن 💕</p>
    );
  }

  return (
    <ol className="rank-list">
      {boys.map((boy, i) => (
        <li key={boy.id} className={boy.locked ? "rank-item locked" : "rank-item"}>
          <div className="rank-badge" aria-hidden>
            {i + 1}
          </div>
          <div className="rank-main">
            <div className="rank-name-row">
              <span className="rank-name">{boy.name}</span>
            </div>
            <div className="rank-meter" aria-hidden>
              <div
                className="rank-meter-fill"
                style={{ width: `${(boy.total / MAX_TOTAL) * 100}%` }}
              />
            </div>
            <p className="rank-score">
              امتیاز: <strong>{boy.total}</strong> از {MAX_TOTAL}
            </p>
          </div>
          {!boy.locked && (
            <button
              type="button"
              className="remove-btn"
              disabled={busyId === boy.id}
              onClick={() => void onRemove(boy.id)}
              aria-label={`حذف ${boy.name}`}
            >
              {busyId === boy.id ? "…" : "حذف"}
            </button>
          )}
        </li>
      ))}
    </ol>
  );
}
