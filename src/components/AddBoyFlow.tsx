"use client";

import { useMemo, useState } from "react";
import {
  CRITERIA,
  emptyScores,
  sumScores,
  type Scores,
} from "@/lib/criteria";

type Props = {
  onCreated: () => void;
  onCancel: () => void;
};

type Step = "name" | "scores" | "saving";

export function AddBoyFlow({ onCreated, onCancel }: Props) {
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [scores, setScores] = useState<Scores>(emptyScores);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const criterion = CRITERIA[index];
  const previewTotal = useMemo(() => sumScores(scores), [scores]);

  async function save() {
    setStep("saving");
    setError(null);
    try {
      const res = await fetch("/api/boys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), scores }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا");
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ذخیره");
      setStep("scores");
    }
  }

  function nextScore() {
    if (index < CRITERIA.length - 1) {
      setIndex((i) => i + 1);
    } else {
      void save();
    }
  }

  return (
    <section className="add-flow" aria-label="افزودن پسر">
      <div className="add-flow-head">
        <h2>پسر جدید</h2>
        <button type="button" className="text-btn" onClick={onCancel}>
          انصراف
        </button>
      </div>

      {step === "name" && (
        <div className="stack">
          <label className="field-label" htmlFor="boy-name">
            اسمش چیه؟
          </label>
          <input
            id="boy-name"
            className="text-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثلاً آرش"
            autoComplete="off"
            maxLength={40}
            autoFocus
          />
          <button
            type="button"
            className="primary-btn"
            disabled={!name.trim()}
            onClick={() => setStep("scores")}
          >
            برو به امتیازدهی
          </button>
        </div>
      )}

      {(step === "scores" || step === "saving") && (
        <div className="stack">
          <p className="muted">
            امتیازدهی برای <strong>{name.trim()}</strong>
          </p>
          <div className="progress-track" aria-hidden>
            <div
              className="progress-fill"
              style={{
                width: `${((index + 1) / CRITERIA.length) * 100}%`,
              }}
            />
          </div>
          <p className="step-count">
            {index + 1} از {CRITERIA.length}
          </p>

          <h3 className="criterion-title">{criterion.label}</h3>
          <p className="muted">از ۱ تا ۱۰ چند می‌دی؟</p>

          <div className="score-grid" role="group" aria-label={criterion.label}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                className={
                  scores[criterion.key] === n
                    ? "score-btn selected"
                    : "score-btn"
                }
                onClick={() =>
                  setScores((s) => ({ ...s, [criterion.key]: n }))
                }
                disabled={step === "saving"}
              >
                {n}
              </button>
            ))}
          </div>

          <p className="muted">جمع فعلی: {previewTotal}</p>

          <div className="row-actions">
            <button
              type="button"
              className="ghost-btn"
              disabled={index === 0 || step === "saving"}
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
            >
              قبلی
            </button>
            <button
              type="button"
              className="primary-btn"
              disabled={step === "saving"}
              onClick={nextScore}
            >
              {step === "saving"
                ? "داره ذخیره می‌شه…"
                : index === CRITERIA.length - 1
                  ? "ثبت نهایی"
                  : "بعدی"}
            </button>
          </div>
        </div>
      )}

      {error && <p className="error-text">{error}</p>}
    </section>
  );
}
