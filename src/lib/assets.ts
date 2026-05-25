/** Resolve a public asset path against the Vite base URL (e.g. /mfg-ops-quiz/). */
export function assetUrl(path: string): string {
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  const base = import.meta.env.BASE_URL;
  return `${base}${normalized}`;
}
