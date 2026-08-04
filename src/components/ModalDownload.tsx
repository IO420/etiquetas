"use client";

import { useState } from "react";
import axios from "axios";
import styles from "./ModalDownload.module.css";
import ImageCard, { ImageCardProps } from "./ImageCard";

export default function ModalDownload({ item, onClick }: ImageCardProps) {
  const [downloading, setDownloading] = useState<"png" | "pdf" | null>(null);

  const [layersData, setLayersData] = useState(() =>
    JSON.parse(JSON.stringify(item.layersData)),
  );

  const handleInputChange = (index: number, newValue: string) => {
    setLayersData((prevData: any) => {
      const updatedLayers = [...prevData.layers];
      updatedLayers[index] = {
        ...updatedLayers[index],
        text: newValue,
      };
      return {
        ...prevData,
        layers: updatedLayers,
      };
    });
  };

  const handleDownload = async (type: "png" | "pdf") => {
    setDownloading(type);
    const endpoint = type === "pdf" ? "/image/label/pdf" : "/image/label";
    const extension = type === "pdf" ? "pdf" : "png";

    try {
      const response = await axios.post(
        `http://localhost:3001${endpoint}`,
        layersData,
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

  const currentItem = {
    ...item,
    layersData,
    id_templates: -item.id_templates,
  };

  return (
    <div className={styles.backdrop} onClick={onClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClick}>
          ✕
        </button>
        <h2>{item.title}</h2>

        <section className={styles.flexSection}>
          <ImageCard item={currentItem} onClick={() => null} />

          <div className={styles.containerInputs}>
            <p>Personaliza los campos de tu etiqueta:</p>

            <div className={styles.inputsForm}>
              {layersData.layers.map((layer: any, index: number) => {
                if (!layer.label) return null;

                return (
                  <div key={index} className={styles.inputGroup}>
                    <label htmlFor={`field-${index}`}>{layer.label}:</label>
                    <input
                      id={`field-${index}`}
                      type="text"
                      value={layer.text || ""}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      placeholder={`Escribe ${layer.label.toLowerCase()}`}
                    />
                  </div>
                );
              })}
            </div>

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
        </section>
      </div>
    </div>
  );
}
