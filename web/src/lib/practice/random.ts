// Small randomness helpers. Only call these from event handlers or lazy state initialisers
// of components that never render on the server (the practice modes mount client-side).

export function shuffle<T>(items: readonly T[]): T[] {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sample<T>(items: readonly T[], n: number): T[] {
  return shuffle(items).slice(0, n);
}

/**
 * Pick up to n items, at most `perGroup` from each group, so one topic does not fill a
 * whole session. Falls back to the leftovers if the cap leaves the session short.
 */
export function sampleBalanced<T>(items: readonly T[], n: number, group: (t: T) => string, perGroup: number): T[] {
  const picked: T[] = [];
  const rest: T[] = [];
  const counts = new Map<string, number>();
  for (const it of shuffle(items)) {
    const g = group(it);
    const c = counts.get(g) ?? 0;
    if (picked.length < n && c < perGroup) {
      picked.push(it);
      counts.set(g, c + 1);
    } else rest.push(it);
  }
  while (picked.length < n && rest.length) picked.push(rest.shift() as T);
  return shuffle(picked);
}
