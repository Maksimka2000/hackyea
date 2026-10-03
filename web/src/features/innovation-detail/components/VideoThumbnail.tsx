"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { useVideoThumbnail } from "../hooks/useVideoThumbnail";

type VideoThumbnailProps = Readonly<{
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
}>;

/** Preview image of the solution's video; opens the video on YouTube in a new tab. */
export function VideoThumbnail({ thumbnailUrl, title, videoUrl }: VideoThumbnailProps) {
  const t = useTranslations("InnovationDetail.video");
  const { isVisible, onError } = useVideoThumbnail();

  if (!isVisible) {
    return null;
  }

  return (
    <a
      className="group relative block aspect-video overflow-hidden rounded-card bg-tint shadow-card"
      href={videoUrl}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Image alt="" className="object-cover" fill onError={onError} sizes="(min-width: 1024px) 50rem, 100vw" src={thumbnailUrl} unoptimized />
      <span aria-hidden="true" className="absolute inset-0 grid place-items-center bg-hero/30 group-hover:bg-hero/50">
        <span className="grid size-16 place-items-center rounded-full bg-primary text-primary-foreground">
          <Play className="size-8 fill-current" />
        </span>
      </span>
      <span className="sr-only">
        {t("watch", { title })} ({t("opensInNewTab")})
      </span>
    </a>
  );
}
