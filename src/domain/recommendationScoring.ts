/**
 * Скоринг без ML: пересечение стеков по технологиям.
 *
 * Нам важен только `score` (чтобы отсортировать).
 * Процент схожести = доля совпавших тегов относительно target-списка.
 */

function normalizeToken(s: string): string {
  return s.trim().toLowerCase();
}

export function scoreStackOverlap(
  profileStack: string[],
  targetTags: string[],
): { score: number; reason: string } {
  const target = targetTags.filter(Boolean);
  if (target.length === 0) {
    return { score: 0, reason: "no target technologies" };
  }
  if (profileStack.length === 0) {
    return { score: 0, reason: "empty profile stack" };
  }

  const p = new Set(profileStack.map(normalizeToken));
  let hits = 0;
  for (const t of target) {
    if (p.has(normalizeToken(t))) hits += 1;
  }

  const overlap = hits / target.length;
  const score = Math.min(1, overlap);
  const reason =
    hits > 0 ? `stack overlap ${(overlap * 100).toFixed(0)}%` : "no stack overlap";
  return { score, reason };
}
