"use client";

import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import styles from "./create.module.css";
import ResourcesPanel from "@/components/createTemplate/ResourcesPanel/ResourcesPanel";
import { Canvas } from "@/components/createTemplate/Canvas/Canvas";
import { PropertiesPanel } from "@/components/createTemplate/PropertiesPanel/PropertiesPanel";
import {
  PlacedLayer,
  TextLayer,
  ImageLayer,
  RectangleLayer,
} from "@/types/canvas";
import {
  getPixelColorAt,
  makeColorTransparent,
} from "@/components/createTemplate/PropertiesPanel/colorStraction";

const MAX_VISIBLE_SIZE = 700;

export default function CreateTemplatePage() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId");

  const [title, setTitle] = useState("Portada Personalizada");
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: Number(searchParams.get("width")) || 600,
    height: Number(searchParams.get("height")) || 850,
  });

  const width = canvasDimensions.width;
  const height = canvasDimensions.height;

  const [layers, setLayers] = useState<PlacedLayer[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!templateId) return;

    const loadTemplateData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/templates/${templateId}/resolved`,
        );
        const data = response.data;

        if (data.title) setTitle(data.title);

        const currentWidth = data.canvasWidth || width;
        const currentHeight = data.canvasHeight || height;

        if (data.canvasWidth && data.canvasHeight) {
          setCanvasDimensions({
            width: data.canvasWidth,
            height: data.canvasHeight,
          });
        }

        if (data.layers && Array.isArray(data.layers)) {
          const validLayers = data.layers.filter(
            (layer: any) => layer !== null && layer !== undefined,
          );

          validLayers.sort(
            (a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0),
          );

          const mappedLayers: PlacedLayer[] = validLayers
            .map((layer: any, index: number) => {
              const layerId = layer.id_layer
                ? `layer-${layer.id_layer}`
                : `layer-${Date.now()}-${index}`;

              if (layer.type === "text") {
                const textWidth = layer.width ?? 250;
                const textHeight = layer.height ?? 60;

                const rawFont = layer.textFont || "Arial";
                const fontName = rawFont.replace(/\.[^/.]+$/, "");

                if (
                  rawFont !== "Arial" &&
                  !document.getElementById(`font-${fontName}`)
                ) {
                  const fontUrl = `http://localhost:3001/uploads/fonts/${rawFont}`;

                  const newStyle = document.createElement("style");
                  newStyle.id = `font-${fontName}`;
                  newStyle.appendChild(
                    document.createTextNode(`
        @font-face {
          font-family: "${fontName}";
          src: url("${fontUrl}") format("truetype");
        }
      `),
                  );
                  document.head.appendChild(newStyle);
                }

                return {
                  id: layerId,
                  type: "text",
                  text: layer.text ?? "",
                  label: layer.label ?? "",
                  fileName: rawFont,
                  fontFamily: fontName,
                  fontSize: layer.fontSize || 35,
                  color: layer.color || "#000000",
                  x: layer.positionX ?? 0,
                  y: layer.positionY ?? 0,
                  width: textWidth,
                  height: textHeight,
                  rotation: layer.rotation || 0,
                } as TextLayer;
              }

              if (layer.type === "image") {
                let imageUrl = layer.imageUrl || layer.url || "";
                if (imageUrl && !imageUrl.startsWith("http")) {
                  imageUrl = `http://localhost:3001/uploads/original/${imageUrl}`;
                }

                const imgWidth = layer.width ?? currentWidth;
                const imgHeight = layer.height ?? currentHeight;

                return {
                  id: layerId,
                  type: "image",
                  url: imageUrl,
                  name: layer.imageUrl || `Imagen ${index + 1}`,
                  x: layer.positionX ?? 0,
                  y: layer.positionY ?? 0,
                  width: imgWidth,
                  height: imgHeight,
                  rotation: layer.rotation || 0,
                  aspectRatio: imgWidth / (imgHeight || 1),
                } as ImageLayer;
              }

              if (layer.type === "rectangle") {
                return {
                  id: layerId,
                  type: "rectangle",
                  x: layer.positionX ?? 0,
                  y: layer.positionY ?? 0,
                  width: layer.width ?? 150,
                  height: layer.height ?? 100,
                  fillColor: layer.fillColor || "#3b82f6",
                  strokeColor: layer.strokeColor || "transparent",
                  strokeWidth: layer.strokeWidth || 0,
                  borderRadius: layer.borderRadius || 0,
                  dashPattern: layer.dashPattern || "none",
                  rotation: layer.rotation || 0,
                } as RectangleLayer;
              }

              return null;
            })
            .filter((layer: any): layer is PlacedLayer => layer !== null);

          setLayers(mappedLayers);
        }
      } catch (error) {
        console.error("Error al cargar la plantilla para editar:", error);
        alert("Ocurrió un error al cargar la plantilla.");
      }
    };

    loadTemplateData();
  }, [templateId]);

  const [interaction, setInteraction] = useState<{
    type:
      | "move"
      | "rotate"
      | "resize"
      | "resizeL"
      | "resizeT"
      | "resizeLT"
      | null;
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    initialW: number;
    initialH: number;
    initialRotation: number;
    centerX: number;
    centerY: number;
  }>({
    type: null,
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
    initialW: 0,
    initialH: 0,
    initialRotation: 0,
    centerX: 0,
    centerY: 0,
  });

  const [isPickingColor, setIsPickingColor] = useState(false);
  const [tolerance, setTolerance] = useState(30);

  const canvasRef = useRef<HTMLDivElement>(null);

  const scale = useMemo(() => {
    return Math.min(MAX_VISIBLE_SIZE / width, MAX_VISIBLE_SIZE / height, 1);
  }, [width, height]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;

    const data = e.dataTransfer.getData("application/json");
    if (!data) return;

    const item = JSON.parse(data);
    const rect = canvasRef.current.getBoundingClientRect();

    if (item.type === "text") {
      const x = (e.clientX - rect.left) / scale - item.width / 2;
      const y = (e.clientY - rect.top) / scale - item.height / 2;

      const newTextLayer: TextLayer = {
        id: `text-${Date.now()}`,
        type: "text",
        text: item.text,
        label: item.label,
        fileName: item.fileName,
        fontFamily: item.fontFamily,
        fontUrl: item.fontUrl,
        fontSize: item.fontSize,
        color: item.color,
        x: Math.max(0, Math.min(x, width - item.width)),
        y: Math.max(0, Math.min(y, height - item.height)),
        width: item.width,
        height: item.height,
        rotation: 0,
      };

      setLayers((prev) => [...prev, newTextLayer]);
      setSelectedId(newTextLayer.id);
    } else if (item.type === "rectangle" || item.type === "shape") {
      const rectW = item.width || 150;
      const rectH = item.height || 100;
      const x = (e.clientX - rect.left) / scale - rectW / 2;
      const y = (e.clientY - rect.top) / scale - rectH / 2;

      const newRectangleLayer: RectangleLayer = {
        id: `rect-${Date.now()}`,
        type: "rectangle",
        x: Math.max(0, Math.min(x, width - rectW)),
        y: Math.max(0, Math.min(y, height - rectH)),
        width: rectW,
        height: rectH,
        fillColor: item.fillColor || "#3b82f6",
        strokeColor: item.strokeColor || "transparent",
        strokeWidth: item.strokeWidth || 0,
        borderRadius: item.borderRadius || 0,
        dashPattern: item.dashPattern || "none",
        rotation: 0,
      };

      setLayers((prev) => [...prev, newRectangleLayer]);
      setSelectedId(newRectangleLayer.id);
    } else {
      const scaleFactor = Math.min(width / item.width, height / item.height, 1);

      const imgWidth = item.width * scaleFactor;
      const imgHeight = item.height * scaleFactor;

      const x = (e.clientX - rect.left) / scale - imgWidth / 2;
      const y = (e.clientY - rect.top) / scale - imgHeight / 2;

      const newImageLayer: ImageLayer = {
        id: `${item.id_image || "img"}-${Date.now()}`,
        type: "image",
        url: item.url,
        name: item.name,
        x: Math.max(0, Math.min(x, width - imgWidth)),
        y: Math.max(0, Math.min(y, height - imgHeight)),
        width: imgWidth,
        height: imgHeight,
        rotation: 0,
        aspectRatio: item.width / item.height,
      };

      setLayers((prev) => [...prev, newImageLayer]);
      setSelectedId(newImageLayer.id);
    }
  };

  const handleDeleteLayer = useCallback((idToDelete: string) => {
    setLayers((prev) => prev.filter((item) => item.id !== idToDelete));
    setSelectedId(null);
  }, []);

  const handleSelect = (e: React.MouseEvent, id: string | null) => {
    if (e) e.stopPropagation();
    setSelectedId(id);
  };

  const startAction = (
    e: React.MouseEvent,
    id: string,
    actionType:
      | "move"
      | "rotate"
      | "resize"
      | "resizeL"
      | "resizeT"
      | "resizeLT",
  ) => {
    e.stopPropagation();
    setSelectedId(id);

    const layer = layers.find((i) => i.id === id);
    if (!layer || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const centerX = rect.left + (layer.x + layer.width / 2) * scale;
    const centerY = rect.top + (layer.y + layer.height / 2) * scale;

    setInteraction({
      type: actionType,
      startX: e.clientX,
      startY: e.clientY,
      initialX: layer.x,
      initialY: layer.y,
      initialW: layer.width,
      initialH: layer.height,
      initialRotation: layer.rotation || 0,
      centerX,
      centerY,
    });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!interaction.type || !selectedId) return;

      const deltaX = (e.clientX - interaction.startX) / scale;
      const deltaY = (e.clientY - interaction.startY) / scale;

      setLayers((prev) =>
        prev.map((item) => {
          if (item.id !== selectedId) return item;

          if (interaction.type === "move") {
            return {
              ...item,
              x: interaction.initialX + deltaX,
              y: interaction.initialY + deltaY,
            };
          }

          if (
            interaction.type === "resize" ||
            interaction.type === "resizeL" ||
            interaction.type === "resizeT" ||
            interaction.type === "resizeLT"
          ) {
            const ar =
              (item.type === "image" ? item.aspectRatio : null) ||
              interaction.initialW / interaction.initialH;

            let newW = interaction.initialW;
            let newH = interaction.initialH;

            if (interaction.type === "resize") {
              newW = Math.max(30, interaction.initialW + deltaX);
              newH =
                item.type === "image"
                  ? newW / ar
                  : Math.max(30, interaction.initialH + deltaY);
              return { ...item, width: newW, height: newH };
            }

            if (interaction.type === "resizeL") {
              newW = Math.max(30, interaction.initialW - deltaX);
              newH = item.type === "image" ? newW / ar : item.height;
              const actualDeltaX = interaction.initialW - newW;
              return {
                ...item,
                x: interaction.initialX + actualDeltaX,
                width: newW,
                height: newH,
              };
            }

            if (interaction.type === "resizeT") {
              newH = Math.max(30, interaction.initialH - deltaY);
              newW = item.type === "image" ? newH * ar : item.width;
              const actualDeltaY = interaction.initialH - newH;
              return {
                ...item,
                y: interaction.initialY + actualDeltaY,
                width: newW,
                height: newH,
              };
            }

            if (interaction.type === "resizeLT") {
              newW = Math.max(30, interaction.initialW - deltaX);
              newH =
                item.type === "image"
                  ? newW / ar
                  : Math.max(30, interaction.initialH - deltaY);
              const actualDeltaX = interaction.initialW - newW;
              const actualDeltaY = interaction.initialH - newH;
              return {
                ...item,
                x: interaction.initialX + actualDeltaX,
                y: interaction.initialY + actualDeltaY,
                width: newW,
                height: newH,
              };
            }
          }

          if (interaction.type === "rotate") {
            const radians = Math.atan2(
              e.clientY - interaction.centerY,
              e.clientX - interaction.centerX,
            );

            let degrees = Math.round(radians * (180 / Math.PI)) + 90;
            if (degrees < 0) degrees += 360;

            return { ...item, rotation: degrees };
          }

          return item;
        }),
      );
    },
    [interaction, selectedId, scale],
  );

  const handleMouseUp = useCallback(() => {
    setInteraction((prev) => ({ ...prev, type: null }));
  }, []);

  useEffect(() => {
    if (interaction.type) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [interaction.type, handleMouseMove, handleMouseUp]);

  const handleSaveTemplate = async () => {
    const payload = {
      title,
      is_public: true,
      canvas: {
        width,
        height,
      },
      layers: layers.map((layer, index) => {
        if (layer.type === "text") {
          return {
            type: "text",
            order_index: index,
            text: layer.text,
            label: layer.label,
            textFont: layer.fileName,
            fontSize: layer.fontSize,
            color: layer.color,
            positionX: Math.round(layer.x),
            positionY: Math.round(layer.y),
            width: Math.round(layer.width),
            height: Math.round(layer.height),
            rotation: layer.rotation || 0,
          };
        }

        if (layer.type === "rectangle") {
          return {
            type: "rectangle",
            order_index: index,
            positionX: Math.round(layer.x),
            positionY: Math.round(layer.y),
            width: Math.round(layer.width),
            height: Math.round(layer.height),
            fillColor: layer.fillColor,
            strokeColor: layer.strokeColor,
            strokeWidth: layer.strokeWidth,
            borderRadius: layer.borderRadius,
            dashPattern: layer.dashPattern,
            rotation: layer.rotation || 0,
          };
        }

        return {
          type: "image",
          order_index: index,
          name: layer.name,
          positionX: Math.round(layer.x),
          positionY: Math.round(layer.y),
          width: Math.round(layer.width),
          height: Math.round(layer.height),
          rotation: layer.rotation || 0,
        };
      }),
    };

    try {
      let response;
      if (templateId) {
        response = await axios.put(
          `http://localhost:3001/templates/${templateId}`,
          payload,
        );
      } else {
        response = await axios.post("http://localhost:3001/templates", payload);
      }

      if (response.status === 200 || response.status === 201) {
        alert(
          templateId
            ? "¡Plantilla actualizada correctamente!"
            : "¡Plantilla creada correctamente!",
        );
      }
    } catch (error) {
      console.error("Error al guardar la plantilla:", error);
      alert("Error al guardar la plantilla. Revisa la consola.");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        handleDeleteLayer(selectedId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, handleDeleteLayer]);

  const selectedItem = layers.find((l) => l.id === selectedId);

  const handleBringToFront = useCallback((id: string) => {
    setLayers((prev) => {
      const item = prev.find((l) => l.id === id);
      if (!item) return prev;
      return [...prev.filter((l) => l.id !== id), item];
    });
  }, []);

  const handleSendToBack = useCallback((id: string) => {
    setLayers((prev) => {
      const item = prev.find((l) => l.id === id);
      if (!item) return prev;
      return [item, ...prev.filter((l) => l.id !== id)];
    });
  }, []);

  const handleStepForward = useCallback((id: string) => {
    setLayers((prev) => {
      const idx = prev.findIndex((l) => l.id === id);
      if (idx === -1 || idx === prev.length - 1) return prev;
      const newArr = [...prev];
      const temp = newArr[idx];
      newArr[idx] = newArr[idx + 1];
      newArr[idx + 1] = temp;
      return newArr;
    });
  }, []);

  const handleStepBackward = useCallback((id: string) => {
    setLayers((prev) => {
      const idx = prev.findIndex((l) => l.id === id);
      if (idx <= 0) return prev;
      const newArr = [...prev];
      const temp = newArr[idx];
      newArr[idx] = newArr[idx - 1];
      newArr[idx - 1] = temp;
      return newArr;
    });
  }, []);

  const handlePickColor = async (e: React.MouseEvent, item: ImageLayer) => {
    if (!isPickingColor || item.type !== "image") return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    try {
      const { r, g, b } = await getPixelColorAt(
        item.url,
        clickX,
        clickY,
        item.width,
        item.height,
      );

      const newBase64Image = await makeColorTransparent(
        item.url,
        r,
        g,
        b,
        tolerance,
      );

      setLayers((prev) =>
        prev.map((img) =>
          img.id === item.id
            ? ({ ...img, url: newBase64Image } as ImageLayer)
            : img,
        ),
      );
    } catch (error) {
      console.error("Error al procesar el color transparente:", error);
    } finally {
      setIsPickingColor(false);
    }
  };

  const handleUpdateText = useCallback((id: string, newText: string) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer) =>
        layer.id === id && layer.type === "text"
          ? { ...layer, text: newText }
          : layer,
      ),
    );
  }, []);

  return (
    <section className={styles.container}>
      <aside className={styles.sidebar}>
        <ResourcesPanel />
      </aside>

      <section className={styles.workspace}>
        <Canvas
          canvasRef={canvasRef}
          width={width}
          height={height}
          scale={scale}
          items={layers}
          selectedId={selectedId}
          isPickingColor={isPickingColor}
          onPickColor={handlePickColor}
          onDropItem={handleDrop}
          onSelect={handleSelect}
          onStartAction={startAction}
          onUpdateText={handleUpdateText}
        />
      </section>

      <PropertiesPanel
        selectedItem={selectedItem}
        isPickingColor={isPickingColor}
        onTogglePicker={() => setIsPickingColor((prev) => !prev)}
        onToleranceChange={setTolerance}
        tolerance={tolerance}
        onSave={handleSaveTemplate}
        onDelete={handleDeleteLayer}
        onBringToFront={handleBringToFront}
        onSendToBack={handleSendToBack}
        onStepForward={handleStepForward}
        onStepBackward={handleStepBackward}
      />
    </section>
  );
}
//IO