"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ModalDownload.module.css";
import ImageCard from "./ImageCard";
import { TemplatePreviewItem, ResolvedTemplate } from "@/app/(front)/page";

interface ModalDownloadProps {
  item: TemplatePreviewItem;
  onClick: () => void;
}

type PageSizeType = "LETTER" | "LEGAL" | "A4" | "TABLOID";

export default function ModalDownload({ item, onClick }: ModalDownloadProps) {
  const [downloading, setDownloading] = useState<
    "png" | "pdf" | "pencils" | null
  >(null);
  const [loadingTemplate, setLoadingTemplate] = useState<boolean>(true);
  const [templateData, setTemplateData] = useState<ResolvedTemplate | null>(
    null,
  );

  const [pageSize, setPageSize] = useState<PageSizeType>("LETTER");

  useEffect(() => {
    const fetchResolvedTemplate = async () => {
      try {
        setLoadingTemplate(true);
        const response = await axios.get<ResolvedTemplate>(
          `http://localhost:3001/templates/${item.id_template}/resolved`,
        );
        setTemplateData(response.data);
      } catch (error) {
        console.error("Error al obtener el detalle de la plantilla:", error);
      } finally {
        setLoadingTemplate(false);
      }
    };

    fetchResolvedTemplate();
  }, [item.id_template]);

  const handleInputChange = (index: number, newValue: string) => {
    if (!templateData) return;

    setTemplateData((prevData) => {
      if (!prevData) return null;
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

  const handleDownload = async (type: "png" | "pdf" | "pencils") => {
    if (!templateData) return;

    setDownloading(type);

    let endpoint = "/image/label";
    let extension = "png";
    let mimeType = "image/png";

    if (type === "pdf") {
      endpoint = "/image/label/pdf";
      extension = "pdf";
      mimeType = "application/pdf";
    } else if (type === "pencils") {
      endpoint = "/image/print-pencil-labels";
      extension = "pdf";
      mimeType = "application/pdf";
    }

    const payload: Record<string, any> = {
      canvasWidth: templateData.canvasWidth,
      canvasHeight: templateData.canvasHeight,
      layers: templateData.layers,
    };

    if (type === "pencils") {
      payload.pageSize = pageSize;
    }

    try {
      const response = await axios.post(
        `http://localhost:3001${endpoint}`,
        payload,
        { responseType: "blob" },
      );

      const blob = new Blob([response.data], { type: mimeType });
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;

      const fileNamePrefix = type === "pencils" ? "hoja_lapices" : "etiqueta";
      link.setAttribute(
        "download",
        `${fileNamePrefix}_${item.id_template}.${extension}`,
      );

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(`Error descargando ${type.toUpperCase()}:`, error);
      alert(`Ocurrió un error al generar el archivo.`);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClick}>
          ✕
        </button>
        <h2>{item.title}</h2>

        <section className={styles.flexSection}>
          <ImageCard item={item} onClick={() => null} />

          <div className={styles.containerInputs}>
            {loadingTemplate ? (
              <p>Cargando campos editables...</p>
            ) : (
              <>
                <p>Personaliza los campos de tu etiqueta:</p>

                <div className={styles.inputsForm}>
                  {templateData?.layers.map((layer: any, index: number) => {
                    if (!layer.label) return null;

                    const labelName = layer.label || `Texto ${index + 1}`;

                    return (
                      <div key={index} className={styles.inputGroup}>
                        <label htmlFor={`field-${index}`}>{labelName}:</label>
                        <input
                          id={`field-${index}`}
                          type="text"
                          value={layer.text || ""}
                          onChange={(e) =>
                            handleInputChange(index, e.target.value)
                          }
                          placeholder={`Escribe ${labelName.toLowerCase()}`}
                        />
                      </div>
                    );
                  })}

                  <div className={styles.inputGroup}>
                    <label htmlFor="pageSizeSelect">Tamaño de hoja:</label>
                    <select
                      id="pageSizeSelect"
                      value={pageSize}
                      onChange={(e) =>
                        setPageSize(e.target.value as PageSizeType)
                      }
                      className={styles.selectInput}
                    >
                      <option value="LETTER">Carta (Letter)</option>
                      <option value="LEGAL">Oficio (Legal)</option>
                      <option value="A4">A4</option>
                      <option value="TABLOID">Doble Carta (Tabloid)</option>
                    </select>
                  </div>
                </div>

                <div className={styles.buttonGroup}>
                  <button
                    onClick={() => handleDownload("png")}
                    disabled={downloading !== null}
                    className={styles.pngBtn}
                  >
                    {downloading === "png" ? " PNG..." : " PNG"}
                  </button>

                  <button
                    onClick={() => handleDownload("pdf")}
                    disabled={downloading !== null}
                    className={styles.pdfBtn}
                  >
                    {downloading === "pdf" ? " PDF..." : " PDF"}
                  </button>

                  <button
                    onClick={() => handleDownload("pencils")}
                    disabled={downloading !== null}
                    className={styles.pencilsBtn}
                  >
                    {downloading === "pencils"
                      ? " Hoja Lápices..."
                      : " Hoja Lápices"}
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
//IO
