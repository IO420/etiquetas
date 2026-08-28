"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import styles from "./ModalDownload.module.css";
import ImageCard from "./ImageCard";
import { TemplatePreviewItem, ResolvedTemplate } from "@/app/(front)/page";

interface ModalDownloadProps {
  item: TemplatePreviewItem;
  onClick: () => void;
  onDeleteSuccess?: () => void;
}

type PageSizeType = "LETTER" | "LEGAL" | "A4" | "TABLOID";

export default function ModalDownload({
  item,
  onClick,
  onDeleteSuccess,
}: ModalDownloadProps) {
  const [downloading, setDownloading] = useState<
    "png" | "pdf" | "pencils" | null
  >(null);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const [loadingTemplate, setLoadingTemplate] = useState<boolean>(true);
  const [templateData, setTemplateData] = useState<ResolvedTemplate | null>(
    null,
  );

  const [livePreviewUrl, setLivePreviewUrl] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<PageSizeType>("LETTER");
  const isModifiedRef = useRef<boolean>(false);

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

  useEffect(() => {
    if (!templateData || !isModifiedRef.current) return;

    const timer = setTimeout(async () => {
      try {
        const payload = {
          canvasWidth: templateData.canvasWidth,
          canvasHeight: templateData.canvasHeight,
          layers: templateData.layers,
        };

        const response = await axios.post(
          "http://localhost:3001/image/label",
          payload,
          { responseType: "blob" },
        );

        const newBlobUrl = window.URL.createObjectURL(
          new Blob([response.data], { type: "image/png" }),
        );

        setLivePreviewUrl((prevUrl) => {
          if (prevUrl) window.URL.revokeObjectURL(prevUrl);
          return newBlobUrl;
        });
      } catch (error) {
        console.error("Error al generar la vista previa:", error);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [templateData]);

  // Limpieza de memoria al cerrar o desmontar el modal
  useEffect(() => {
    return () => {
      if (livePreviewUrl) {
        window.URL.revokeObjectURL(livePreviewUrl);
      }
    };
  }, [livePreviewUrl]);

  const displayItem = useMemo(() => {
    if (!livePreviewUrl) {
      return item
    }

    return {
      ...item,
      previewUrl: livePreviewUrl,
    };
  }, [item, livePreviewUrl, templateData]);

  const handleLayerChange = (index: number, field: string, value: string) => {
    if (!templateData) return;

    isModifiedRef.current = true;

    setTemplateData((prevData) => {
      if (!prevData) return null;
      const updatedLayers = [...prevData.layers];
      updatedLayers[index] = {
        ...updatedLayers[index],
        [field]: value,
      };
      return {
        ...prevData,
        layers: updatedLayers,
      };
    });
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await axios.delete(`http://localhost:3001/templates/${item.id_template}`);

      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
      onClick();
    } catch (error) {
      console.error("Error al eliminar la plantilla:", error);
      alert("Ocurrió un error al intentar eliminar la plantilla.");
      setDeleting(false);
      setShowConfirmDelete(false);
    }
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
        <button
          className={styles.closeBtn}
          onClick={onClick}
          aria-label="Cerrar"
        >
          ✕
        </button>

        <div className={styles.header}>
          <h2>{item.title}</h2>
          <button
            onClick={() => setShowConfirmDelete(true)}
            className={styles.deleteIconButton}
            title="Eliminar plantilla"
            disabled={downloading !== null || deleting}
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>

        <section className={styles.flexSection}>
          <div className={styles.imageWrapper}>
            <ImageCard item={displayItem} onClick={() => null} />
          </div>

          <div className={styles.containerInputs}>
            {loadingTemplate ? (
              <div className={styles.loaderContainer}>
                <div className={styles.spinner}></div>
                <p>Cargando campos editables...</p>
              </div>
            ) : (
              <>
                <p className={styles.sectionSubtitle}>
                  Personaliza los campos de tu etiqueta:
                </p>

                <div className={styles.inputsForm}>
                  {templateData?.layers.map((layer: any, index: number) => {
                    if (!layer.label) return null;

                    const labelName = layer.label || `Texto ${index + 1}`;

                    return (
                      <div key={index} className={styles.inputPersonalization}>
                        <div className={styles.inputGroup}>
                          <label htmlFor={`field-${index}`}>{labelName}</label>
                          <input
                            id={`field-${index}`}
                            type="text"
                            value={layer.text || ""}
                            onChange={(e) =>
                              handleLayerChange(index, "text", e.target.value)
                            }
                            placeholder={`Ej. ${labelName}`}
                          />
                        </div>

                        <div className={styles.alignGroup}>
                          <label htmlFor={`align-${index}`}>Alineación</label>
                          <select
                            id={`align-${index}`}
                            value={layer.textAlign || "left"}
                            onChange={(e) =>
                              handleLayerChange(
                                index,
                                "textAlign",
                                e.target.value,
                              )
                            }
                            className={styles.selectInput}
                          >
                            <option value="left">Izquierda</option>
                            <option value="center">Centro</option>
                            <option value="right">Derecha</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}

                  <div className={styles.inputGroup}>
                    <label htmlFor="pageSizeSelect">
                      Tamaño de hoja para impresión
                    </label>
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

                <div className={styles.downloadSection}>
                  <p className={styles.downloadLabel}>Formatos de descarga:</p>
                  <div className={styles.buttonGroup}>
                    <button
                      onClick={() => handleDownload("png")}
                      disabled={downloading !== null || deleting}
                      className={styles.pngBtn}
                    >
                      {downloading === "png"
                        ? "Generando PNG..."
                        : "Descargar PNG"}
                    </button>

                    <button
                      onClick={() => handleDownload("pdf")}
                      disabled={downloading !== null || deleting}
                      className={styles.pdfBtn}
                    >
                      {downloading === "pdf"
                        ? "Generando PDF..."
                        : "Descargar PDF"}
                    </button>

                    <button
                      onClick={() => handleDownload("pencils")}
                      disabled={downloading !== null || deleting}
                      className={styles.pencilsBtn}
                    >
                      {downloading === "pencils"
                        ? "Generando Lápices..."
                        : "Hoja de Lápices"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {showConfirmDelete && (
          <div className={styles.confirmOverlay}>
            <div className={styles.confirmBox}>
              <div className={styles.warningIcon}>⚠️</div>
              <h3>¿Eliminar esta plantilla?</h3>
              <p>
                Esta acción eliminará permanentemente la plantilla{" "}
                <strong>&quot;{item.title}&quot;</strong> y sus capas.
              </p>
              <div className={styles.confirmActions}>
                <button
                  className={styles.cancelDeleteBtn}
                  onClick={() => setShowConfirmDelete(false)}
                  disabled={deleting}
                >
                  Cancelar
                </button>
                <button
                  className={styles.confirmDeleteBtn}
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? "Eliminando..." : "Sí, eliminar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
//IO
