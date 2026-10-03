const YOUTUBE_ID = /^[\w-]{11}$/;
const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com"]);
const EMBED_PATHS = ["/embed/", "/shorts/", "/v/"];

function readYoutubeId(url: URL): string | null {
  if (url.hostname === "youtu.be") {
    return url.pathname.slice(1).split("/")[0] ?? null;
  }

  if (!YOUTUBE_HOSTS.has(url.hostname)) {
    return null;
  }

  const embedPath = EMBED_PATHS.find((prefix) => url.pathname.startsWith(prefix));
  return embedPath ? (url.pathname.slice(embedPath.length).split("/")[0] ?? null) : url.searchParams.get("v");
}

/** The YouTube preview image for a video link, or null when the link is not a recognisable YouTube video. */
export function getVideoThumbnailUrl(videoUrl: string | null): string | null {
  if (!videoUrl) {
    return null;
  }

  try {
    const id = readYoutubeId(new URL(videoUrl));
    return id && YOUTUBE_ID.test(id) ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
  } catch {
    return null;
  }
}
