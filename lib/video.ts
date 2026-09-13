export function videoEmbedUrl(value: string): string | null {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.username || url.password) return null;
  let id: string | null = null;
  if (url.hostname === "youtu.be") id = url.pathname.slice(1);
  if (["youtube.com", "www.youtube.com"].includes(url.hostname)) {
    id =
      url.pathname === "/watch"
        ? url.searchParams.get("v")
        : url.pathname.match(/^\/(?:embed|shorts)\/([\w-]+)$/)?.[1] || null;
  }
  if (id && /^[\w-]{11}$/.test(id))
    return `https://www.youtube-nocookie.com/embed/${id}`;
  if (
    ["vimeo.com", "www.vimeo.com"].includes(url.hostname) &&
    /^\/\d+$/.test(url.pathname)
  )
    return `https://player.vimeo.com/video/${url.pathname.slice(1)}`;
  return null;
}
