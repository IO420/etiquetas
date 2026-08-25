"use client";

import axios from "axios";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import styles from "./resourcesPanel.module.css";

interface ImageItem {
  id_image: number;
  name: string;
  url: string;
  url_optimized: string;
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
  const [uploading, setUploading] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [page] = useState(1);

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const { data: response } = await axios.get<PaginatedResponse>(
        "http://localhost:3001/image/latest",
        {
          params: { page, limit: 50 },
        },
      );

      setImages(response.data);
    } catch (error) {
      console.error("Error al cargar las imágenes:", error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Solo se permiten archivos de imagen.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const { data: newImage } = await axios.post<ImageItem>(
        "http://localhost:3001/image/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setImages((prev) => [newImage, ...prev]);
    } catch (error: any) {
      console.error("Error al subir la imagen:", error);
      const message =
        error.response?.data?.message || "Hubo un error al subir la imagen.";
      alert(message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (id_image: number) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar esta imagen?",
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3001/image/${id_image}`);

      setImages((prev) => prev.filter((img) => img.id_image !== id_image));
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
      alert("Hubo un error al intentar eliminar la imagen.");
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
      e.target.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.types.includes("Files")) {
      setIsDraggingOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div
      className={`${styles.uploadContainer} ${
        isDraggingOver ? styles.dragOver : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDraggingOver && (
        <div className={styles.dragOverlay}>
          <span>Suelta tu imagen aquí para subirla</span>
        </div>
      )}

      <div className={styles.uploadSection}>
        <label className={styles.uploadBtn}>
          {uploading ? "Subiendo..." : "Subir Imagen"}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            disabled={uploading}
            hidden
          />
        </label>
      </div>

      <div className={styles.grid}>
        {images.map((item) => (
          <ImageResourceCard
            key={item.id_image}
            item={item}
            onDelete={handleDeleteImage}
          />
        ))}
      </div>
    </div>
  );
}

function ImageResourceCard({
  item,
  onDelete,
}: {
  item: ImageItem;
  onDelete: (id: number) => void;
}) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div
      className={styles.card}
      draggable
      onDragStart={handleDragStart}
      style={{ cursor: "grab" }}
    >
      <button
        type="button"
        className={styles.deleteBtn}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item.id_image);
        }}
        title="Eliminar imagen"
      >
        ✕
      </button>

      <Image
        src={item.url_optimized || item.url}
        alt={item.name}
        fill
        unoptimized
      />
      <span>{item.name}</span>
    </div>
  );
}
//IO