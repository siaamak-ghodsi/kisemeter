export const CRITERIA = [
  { key: "beauty", label: "زیبایی" },
  { key: "wealth", label: "ثروت" },
  { key: "height", label: "قد" },
  { key: "age", label: "سن" },
  { key: "job", label: "شغل" },
  { key: "car", label: "ماشین" },
  { key: "housing", label: "خانه اجاره ای یا تملیکی" },
  { key: "exCount", label: "تعداد اکس های در ارتباط" },
  { key: "motherRelation", label: "رابطه با مادر" },
  { key: "housework", label: "انجام کارهای خانه" },
  { key: "length", label: "طول آلت" },
  { key: "girth", label: "قطر آلت" },
  { key: "usage", label: "نحوه استفاده از آلت" },
  { key: "sti", label: "بیماری های مقاربتی" },
] as const;

export type CriterionKey = (typeof CRITERIA)[number]["key"];

export type Scores = Record<CriterionKey, number>;

export const MAX_PER_CRITERION = 10;
export const MAX_TOTAL = CRITERIA.length * MAX_PER_CRITERION;

export function emptyScores(): Scores {
  return Object.fromEntries(
    CRITERIA.map((c) => [c.key, 5]),
  ) as Scores;
}

export function maxScores(): Scores {
  return Object.fromEntries(
    CRITERIA.map((c) => [c.key, MAX_PER_CRITERION]),
  ) as Scores;
}

export function sumScores(scores: Scores): number {
  return CRITERIA.reduce((sum, c) => sum + (scores[c.key] ?? 0), 0);
}

export function isValidScores(scores: unknown): scores is Scores {
  if (!scores || typeof scores !== "object") return false;
  const s = scores as Record<string, unknown>;
  return CRITERIA.every((c) => {
    const v = s[c.key];
    return typeof v === "number" && Number.isInteger(v) && v >= 1 && v <= 10;
  });
}
