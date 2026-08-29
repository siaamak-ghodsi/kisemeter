"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { APP_NAME, HERO_DEDICATION, FOOTER_TEXT } from "@/lib/constants";

export function WelcomeGift() {
  const router = useRouter();
  const [opening, setOpening] = useState(false);

  function openGift() {
    if (opening) return;
    setOpening(true);
    window.setTimeout(() => {
      router.push("/app");
    }, 900);
  }

  return (
    <div className="welcome-shell">
      <header className="welcome-hero">
        <p className="welcome-kicker">یه هدیه مخصوص تو</p>
        <h1 className="welcome-title">{HERO_DEDICATION}</h1>
        <p className="welcome-sub">
          این جعبه رو باز کن تا وارد <strong>{APP_NAME}</strong> بشی
        </p>
      </header>

      <button
        type="button"
        className={opening ? "gift-btn opening" : "gift-btn"}
        onClick={openGift}
        aria-label="باز کردن هدیه و ورود به اپ"
        disabled={opening}
      >
        <span className="gift-glow" aria-hidden />
        <span className="gift-box" aria-hidden>
          <span className="gift-lid">
            <span className="gift-bow" />
          </span>
          <span className="gift-body">
            <span className="gift-ribbon-v" />
            <span className="gift-ribbon-h" />
          </span>
        </span>
        <span className="gift-hint">
          {opening ? "داره باز می‌شه…" : "روی کادو بزن"}
        </span>
      </button>

      <footer className="site-footer welcome-footer">
        <p>{FOOTER_TEXT}</p>
      </footer>
    </div>
  );
}
