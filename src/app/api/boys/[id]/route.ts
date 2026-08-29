import { NextResponse } from "next/server";
import { deleteBoy } from "@/lib/db";

export const runtime = "nodejs";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    await deleteBoy(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "خطا در حذف";
    const status = message.includes("حذف") ? 403 : 500;
    console.error(err);
    return NextResponse.json({ error: message }, { status });
  }
}
