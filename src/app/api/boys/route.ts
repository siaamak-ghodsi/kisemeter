import { NextResponse } from "next/server";
import {
  CRITERIA,
  emptyScores,
  isValidScores,
  sumScores,
  type Scores,
} from "@/lib/criteria";
import { createBoy, listBoys } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const boys = await listBoys();
    return NextResponse.json({ boys });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "خطا در دریافت لیست" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) {
      return NextResponse.json({ error: "اسم پسر را بنویس" }, { status: 400 });
    }
    if (name.length > 40) {
      return NextResponse.json({ error: "اسم خیلی طولانیه" }, { status: 400 });
    }

    let scores: Scores = emptyScores();
    if (body.scores) {
      if (!isValidScores(body.scores)) {
        return NextResponse.json(
          { error: "امتیازها باید بین ۱ تا ۱۰ باشند" },
          { status: 400 },
        );
      }
      scores = body.scores;
    } else {
      // accept flat keys
      const built = { ...emptyScores() };
      for (const c of CRITERIA) {
        const v = Number(body[c.key]);
        if (!Number.isInteger(v) || v < 1 || v > 10) {
          return NextResponse.json(
            { error: `امتیاز «${c.label}» معتبر نیست` },
            { status: 400 },
          );
        }
        built[c.key] = v;
      }
      scores = built;
    }

    const total = sumScores(scores);
    const boy = await createBoy(name, scores, total);
    return NextResponse.json({ boy }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "خطا در ذخیره";
    const status = message.includes("قبلاً") || message.includes("رزرو") ? 409 : 500;
    console.error(err);
    return NextResponse.json({ error: message }, { status });
  }
}
