/** Strip trailing slashes except keep "/" for root-style paths */
export function normalizePath(path: string): string {
  if (path === "/") return "/";
  return path.replace(/\/+$/, "") || "/";
}

export function isNavItemActive(
  pathname: string,
  to: string,
  end?: boolean,
): boolean {
  const p = normalizePath(pathname);
  const t = normalizePath(to);
  if (end) return p === t;
  return p === t || p.startsWith(`${t}/`);
}

/** Prefer the longest matching `to` so /mentor/courses/new beats /mentor/courses */
export function findBestNavMatch(
  pathname: string,
  items: { to: string; end?: boolean }[],
): string | null {
  let best: { to: string; len: number } | null = null;
  for (const item of items) {
    const t = normalizePath(item.to);
    if (!isNavItemActive(pathname, item.to, item.end)) continue;
    if (!best || t.length > best.len) {
      best = { to: item.to, len: t.length };
    }
  }
  return best?.to ?? null;
}
