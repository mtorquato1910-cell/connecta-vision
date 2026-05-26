/**
 * Helpers para lidar com URLs do YouTube.
 * Suporta os formatos mais comuns:
 *   - youtube.com/watch?v=ID
 *   - youtu.be/ID
 *   - youtube.com/embed/ID
 *   - youtube.com/shorts/ID
 *   - youtube.com/v/ID
 */

export function extractYoutubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Se já parece um ID puro (11 chars alfanuméricos + - + _)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  try {
    const u = new URL(trimmed);
    // youtu.be/ID
    if (u.hostname.endsWith("youtu.be")) {
      const id = u.pathname.replace(/^\//, "").split("/")[0];
      return id || null;
    }
    if (u.hostname.endsWith("youtube.com") || u.hostname.endsWith("youtube-nocookie.com")) {
      // /watch?v=ID
      const v = u.searchParams.get("v");
      if (v) return v;
      // /embed/ID, /v/ID, /shorts/ID
      const m = u.pathname.match(/^\/(?:embed|v|shorts)\/([a-zA-Z0-9_-]{11})/);
      if (m) return m[1];
    }
  } catch {
    // não é URL válida
  }
  return null;
}

export function isYoutubeUrl(url: string | null | undefined): boolean {
  return extractYoutubeId(url) !== null;
}

export function youtubeEmbedUrl(url: string): string | null {
  const id = extractYoutubeId(url);
  if (!id) return null;
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
}

export function youtubeThumbnail(url: string, quality: "default" | "hq" | "max" = "hq"): string | null {
  const id = extractYoutubeId(url);
  if (!id) return null;
  const file = quality === "max" ? "maxresdefault" : quality === "hq" ? "hqdefault" : "default";
  return `https://i.ytimg.com/vi/${id}/${file}.jpg`;
}
