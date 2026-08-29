import { Pool } from "pg";
import { LOCKED_BOYS } from "./constants";
import { maxScores, MAX_TOTAL, type Scores } from "./criteria";
import type { Boy } from "./types";

declare global {
  // eslint-disable-next-line no-var
  var __kissMeterPool: Pool | undefined;
}

function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!global.__kissMeterPool) {
    global.__kissMeterPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 5,
    });
  }
  return global.__kissMeterPool;
}

type BoyRow = {
  id: string;
  name: string;
  locked: boolean;
  scores: Scores;
  total: number;
  created_at: Date;
};

function mapBoy(row: BoyRow): Boy {
  return {
    id: row.id,
    name: row.name,
    locked: row.locked,
    scores: row.scores,
    total: row.total,
    createdAt: row.created_at.toISOString(),
  };
}

const LOCKED_SEED = [
  { id: "locked-hamid-afagheh", name: "حمید افقه" },
  { id: "locked-siamak-ghodsi", name: "سیامک قدسی" },
] as const;

export async function ensureLockedBoys() {
  const pool = getPool();
  const scores = maxScores();
  const { rows } = await pool.query<{ name: string }>(
    `SELECT name FROM boys WHERE locked = TRUE`,
  );
  const existing = new Set(rows.map((r) => r.name));
  for (const boy of LOCKED_SEED) {
    if (existing.has(boy.name)) continue;
    await pool.query(
      `INSERT INTO boys (id, name, locked, scores, total)
       VALUES ($1, $2, TRUE, $3::jsonb, $4)
       ON CONFLICT (name) DO NOTHING`,
      [boy.id, boy.name, JSON.stringify(scores), MAX_TOTAL],
    );
  }
}

export async function listBoys(): Promise<Boy[]> {
  await ensureLockedBoys();
  const pool = getPool();
  const { rows } = await pool.query<BoyRow>(
    `SELECT id, name, locked, scores, total, created_at
     FROM boys
     ORDER BY total DESC, locked DESC, created_at ASC`,
  );
  return rows.map(mapBoy);
}

export async function createBoy(name: string, scores: Scores, total: number) {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("نام الزامی است");
  if (LOCKED_BOYS.includes(trimmed as (typeof LOCKED_BOYS)[number])) {
    throw new Error("این نام از قبل رزرو شده است");
  }

  const pool = getPool();
  const id = crypto.randomUUID();
  try {
    const { rows } = await pool.query<BoyRow>(
      `INSERT INTO boys (id, name, locked, scores, total)
       VALUES ($1, $2, FALSE, $3::jsonb, $4)
       RETURNING id, name, locked, scores, total, created_at`,
      [id, trimmed, JSON.stringify(scores), total],
    );
    return mapBoy(rows[0]);
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    if (code === "23505") throw new Error("این پسر قبلاً اضافه شده");
    throw err;
  }
}

export async function deleteBoy(id: string) {
  const pool = getPool();
  const { rows } = await pool.query<{ locked: boolean; name: string }>(
    `SELECT locked, name FROM boys WHERE id = $1`,
    [id],
  );
  if (!rows[0]) throw new Error("پیدا نشد");
  if (rows[0].locked) throw new Error("این دو تا حذف‌شدنی نیستن 💕");
  await pool.query(`DELETE FROM boys WHERE id = $1 AND locked = FALSE`, [id]);
}
