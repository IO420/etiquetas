"use client";

import { useState } from "react";
import ImageCard from "@/components/ImageCard";
import styles from "./page.module.css";
import ModalDownload from "@/components/ModalDownload";
import SearchLabels from "@/components/SearchLabels/SearchLabels";
import ButtonTemplate from "@/components/ButtonTemplate/ButtonTemplate";

import { TEMPLATES } from "./templates";

export interface TemplateItem {
  id_templates: number;
  title: string;
  layersData: {
    canvasWidth?: number;
    canvasHeight?: number;
    layers: any[];
  };
}

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(
    null,
  );

  return (
    <section className={styles.main}>
      <div className={styles.searchContainer}>
        <h1 className={styles.title}>Plantillas de Etiquetas</h1>

        <div className={styles.searchContainer}>
          <SearchLabels value={""} />
          <ButtonTemplate />
        </div>
      </div>

      <div className={styles.masonryContainer}>
        {TEMPLATES.map((item) => (
          <div key={item.id_templates} className={styles.masonryItem}>
            <ImageCard item={item} onClick={() => setSelectedTemplate(item)} />
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <ModalDownload
          item={selectedTemplate}
          onClick={() => setSelectedTemplate(null)}
        />
      )}
    </section>
  );
}
//IO
