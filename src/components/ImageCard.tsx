"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Image from "next/image";
import styles from "./ImageCard.module.css";

export interface ImageCardProps {
  item: {
    id_templates: number;
    title: string;
    layersData: any;
  };
  onClick: () => void;
}

export default function ImageCard({ item, onClick }: ImageCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    setIsImageLoaded(false);

    const fetchPreview = async () => {
      try {
        const response = await axios.post<{ url: string }>(
          "http://localhost:3001/image/label/preview",
          {
            ...item.layersData,
            templateId: item.id_templates,
          },
        );

        if (isMounted) {
          setImageUrl(`${response.data.url}?t=${Date.now()}`);
        }
      } catch (error) {
        console.error("Error al cargar vista previa:", error);
      }
    };

    fetchPreview();

    return () => {
      isMounted = false;
    };
  }, [item]);

  // get width y height
  const dimensions = useMemo(() => {
    if (!imageUrl) return null;

    const match = imageUrl.match(/_(\d+)_(\d+)\.[a-zA-Z]+(\?.*)?$/);
    if (match) {
      return {
        width: parseInt(match[1], 10),
        height: parseInt(match[2], 10),
      };
    }
    return null;
  }, [imageUrl]);

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

      {imageUrl && (
        <Image
          key={imageUrl}
          src={imageUrl}
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
