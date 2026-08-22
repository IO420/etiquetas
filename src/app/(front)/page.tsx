"use client";

import { useState, useEffect } from "react";
import ImageCard from "@/components/ImageCard";
import styles from "./page.module.css";
import ModalDownload from "@/components/ModalDownload";
import SearchLabels from "@/components/SearchLabels/SearchLabels";
import ButtonTemplate from "@/components/ButtonTemplate/ButtonTemplate";

export interface TemplateItem {
  id_template: number;
  title: string;
  createdAt: string;
  previewUrl: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ImageCardProps {
  item: {
    id_template: number;
    title: string;
    previewUrl: string;
    createdAt?: string;
  };
  onClick: () => void;
}

export interface TemplatePreviewItem {
  id_template: number;
  title: string;
  previewUrl: string;
  createdAt?: string;
}

export interface ResolvedTemplate {
  id_template: number;
  title: string;
  canvasWidth: number;
  canvasHeight: number;
  layers: any[];
}

export default function Home() {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3001/templates/public/previews?page=${page}&limit=20`,
        );
        const result = await response.json();

        setTemplates(result.data);
        setMeta(result.meta);
      } catch (error) {
        console.error("Error al cargar las plantillas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [page]);

  return (
    <section className={styles.main}>
      <div className={styles.searchContainer}>
        <h1 className={styles.title}>Plantillas de Etiquetas</h1>

        <div className={styles.searchContainer}>
          <SearchLabels value={""} />
          <ButtonTemplate />
        </div>
      </div>

      {loading ? (
        <p>Cargando plantillas...</p>
      ) : (
        <>
          <div className={styles.masonryContainer}>
            {templates.map((item) => (
              <div key={item.id_template} className={styles.masonryItem}>
                <ImageCard
                  item={item}
                  onClick={() => setSelectedTemplate(item)}
                />
              </div>
            ))}
          </div>

          {meta && meta.totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                disabled={page <= 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Anterior
              </button>
              <span>
                Página {meta.page} de {meta.totalPages}
              </span>
              <button
                disabled={page >= meta.totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}

      {selectedTemplate && (
        <ModalDownload
          item={selectedTemplate}
          onClick={() => setSelectedTemplate(null)}
        />
      )}
    </section>
  );
}
