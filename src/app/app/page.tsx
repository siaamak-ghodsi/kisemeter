import { KissMeterApp } from "@/components/KissMeterApp";
import { listBoys } from "@/lib/db";
import type { Boy } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AppPage() {
  let initialBoys: Boy[] = [];
  let initialError: string | null = null;
  try {
    initialBoys = await listBoys();
  } catch (err) {
    console.error(err);
    initialError = "خطا در بارگذاری لیست";
  }

  return (
    <KissMeterApp initialBoys={initialBoys} initialError={initialError} />
  );
}
