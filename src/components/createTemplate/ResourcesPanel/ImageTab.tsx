"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./resourcesPanel.module.css";

interface ImageItem {
  id_image: number;
  name: string;
  url: string;
}

interface PaginatedResponse {
  data: ImageItem[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export default function ImagesTab() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const { data: response } = await axios.get<PaginatedResponse>(
          "http://localhost:3001/image/latest",
          {
            params: { page, limit: 10 },
          }
        );

        setImages(response.data);
      } catch (error) {
        console.error("Error al cargar las imágenes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [page]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className={styles.grid}>
      {images.map((item) => (
        <ImageResourceCard key={item.id_image} item={item} />
      ))}
    </div>
  );
}

function ImageResourceCard({ item }: { item: ImageItem }) {
  return (
    <div className={styles.card}>
      <Image
        src={item.url}
        alt={item.name}
        fill
        unoptimized
      />
      <span>{item.name}</span>
    </div>
  );
}