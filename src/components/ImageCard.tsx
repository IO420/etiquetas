"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import styles from "./ImageCard.module.css";
import { TemplatePreviewItem } from "@/app/(front)/page";

interface ImageCardProps {
  item: TemplatePreviewItem;
  onClick: () => void;
}

export default function ImageCard({ item, onClick }: ImageCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const dimensions = useMemo(() => {
    if (!item.previewUrl) return null;
    const match = item.previewUrl.match(/_(\d+)_(\d+)\.[a-zA-Z]+(\?.*)?$/);
    if (match) {
      return {
        width: parseInt(match[1], 10),
        height: parseInt(match[2], 10),
      };
    }
    return null;
  }, [item.previewUrl]);

  const aspectRatio = dimensions
    ? `${dimensions.width} / ${dimensions.height}`
    : "600 / 850";

  return (
    <div className={styles.card} onClick={onClick} style={{ aspectRatio }}>
      <div
        className={`${styles.skeleton} ${
          isImageLoaded ? styles.skeletonHidden : ""
        }`}
      />

      {item.previewUrl && (
        <Image
          key={item.previewUrl}
          src={item.previewUrl}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`${styles.cardImage} ${
            isImageLoaded ? styles.visible : styles.hidden
          }`}
          onLoad={() => setIsImageLoaded(true)}
          unoptimized
        />
      )}

      <div className={styles.overlay}>
        <span>{item.title}</span>
      </div>
    </div>
  );
}
