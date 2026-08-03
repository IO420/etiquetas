"use client";

import { useState } from "react";
import axios from "axios";
import styles from "./ModalDownload.module.css";
import ImageCard from "./ImageCard";

interface ModalDownloadProps {
  item: {
    id_templates: number;
    title: string;
    layersData: any;
  };
  onClose: () => void;
}

export default function ModalDownload({ item, onClose }: ModalDownloadProps) {
  const [downloading, setDownloading] = useState<"png" | "pdf" | null>(null);

  const handleDownload = async (type: "png" | "pdf") => {
    setDownloading(type);
    const endpoint = type === "pdf" ? "/image/label/pdf" : "/image/label";
    const extension = type === "pdf" ? "pdf" : "png";

    try {
      const response = await axios.post(
        `http://localhost:3001${endpoint}`,
        item.layersData,
        { responseType: "blob" },
      );

      const blob = new Blob([response.data], {
        type: type === "pdf" ? "application/pdf" : "image/png",
      });
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `${item.id_templates}.${extension}`);
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(`Error descargando ${type.toUpperCase()}:`, error);
      alert(`Ocurrió un error al generar el archivo ${type.toUpperCase()}`);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
        <h2>{item.title}</h2>

        <div>
          <ImageCard item={item} onClick={() => null} />

          <p>Selecciona el formato en el que deseas descargar la etiqueta:</p>

          <div className={styles.buttonGroup}>
            <button
              onClick={() => handleDownload("png")}
              disabled={downloading !== null}
              className={styles.pngBtn}
            >
              {downloading === "png" ? "Generando PNG..." : "Descargar PNG"}
            </button>

            <button
              onClick={() => handleDownload("pdf")}
              disabled={downloading !== null}
              className={styles.pdfBtn}
            >
              {downloading === "pdf" ? "Generando PDF..." : "Descargar PDF"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
