"use client";

import { useMemo, useState } from "react";
import { WHEEL_RESULT } from "@/lib/constants";

type Props = {
  names: string[];
};

const COLORS = [
  "#f7b6c8",
  "#e87a96",
  "#f29ab0",
  "#d45a7a",
  "#f8c9d4",
  "#ef9aaa",
  "#e98fa5",
  "#f3a8ba",
];

export function FortuneWheel({ names }: Props) {
  const slices = useMemo(() => {
    const base = names.length >= 2 ? names : ["حمید افقه", "سیامک قدسی"];
    return base;
  }, [names]);

  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const n = slices.length;
  const step = 360 / n;

  function spin() {
    if (spinning) return;
    setShowResult(false);
    setSpinning(true);
    const extra = 5 + Math.floor(Math.random() * 3);
    const jitter = Math.floor(Math.random() * 40) - 20;
    setRotation((r) => r + extra * 360 + 180 + jitter);
    window.setTimeout(() => {
      setSpinning(false);
      setShowResult(true);
    }, 4200);
  }

  // SVG polar helpers — labels sit inside each wedge
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 4;

  function polar(angleDeg: number, r: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function slicePath(i: number) {
    const start = i * step;
    const end = (i + 1) * step;
    const large = step > 180 ? 1 : 0;
    const p1 = polar(start, radius);
    const p2 = polar(end, radius);
    if (n === 1) {
      return `M ${cx} ${cy} m -${radius} 0 a ${radius} ${radius} 0 1 0 ${radius * 2} 0 a ${radius} ${radius} 0 1 0 -${radius * 2} 0`;
    }
    return `M ${cx} ${cy} L ${p1.x} ${p1.y} A ${radius} ${radius} 0 ${large} 1 ${p2.x} ${p2.y} Z`;
  }

  return (
    <section className="wheel-section" aria-label="گردونه شانس">
      <h2 className="section-title">گردونه شانس</h2>
      <p className="muted center">بچرخون ببین سرنوشت چی می‌گه…</p>

      <div className="wheel-stage">
        <div className="wheel-pointer" aria-hidden />
        <div
          className="wheel-spin"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <svg
            className="wheel-svg"
            viewBox={`0 0 ${size} ${size}`}
            role="img"
            aria-label="گردونه نام‌ها"
          >
            {slices.map((name, i) => {
              const mid = i * step + step / 2;
              const labelPos = polar(mid, radius * 0.62);
              const fontSize = n > 6 ? 11 : n > 4 ? 13 : 14;
              // Keep labels upright inside the wedge
              let textAngle = mid;
              if (mid > 90 && mid < 270) textAngle = mid + 180;
              const label =
                name.length > 12 ? `${name.slice(0, 11)}…` : name;
              return (
                <g key={`${name}-${i}`}>
                  <path
                    d={slicePath(i)}
                    fill={COLORS[i % COLORS.length]}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    fill="#4a2432"
                    fontSize={fontSize}
                    fontWeight="700"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textAngle}, ${labelPos.x}, ${labelPos.y})`}
                    style={{ pointerEvents: "none" }}
                  >
                    {label}
                  </text>
                </g>
              );
            })}
            <circle cx={cx} cy={cy} r="18" fill="#fff" />
            <circle cx={cx} cy={cy} r="10" fill="#b83d5f" />
          </svg>
        </div>
      </div>

      <button
        type="button"
        className="primary-btn wheel-btn"
        onClick={spin}
        disabled={spinning}
      >
        {spinning ? "داره می‌چرخه…" : "بچرخون گردونه"}
      </button>

      {showResult && (
        <div className="wheel-result" role="status">
          <p className="wheel-result-label">نتیجه گردونه</p>
          <p className="wheel-result-text">{WHEEL_RESULT}</p>
        </div>
      )}
    </section>
  );
}
