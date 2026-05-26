import { youtubeEmbedUrl } from "@/lib/youtube";

interface Props {
  url: string;
  title?: string;
  className?: string;
}

export function YouTubeEmbed({ url, title = "Vídeo YouTube", className = "" }: Props) {
  const embed = youtubeEmbedUrl(url);
  if (!embed) return null;
  return (
    <div className={`relative w-full aspect-video bg-ink rounded-2xl overflow-hidden ${className}`}>
      <iframe
        src={embed}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
