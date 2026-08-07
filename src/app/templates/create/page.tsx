"use client";

import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./create.module.css";
import ResourcesPanel from "@/components/createTemplate/ResourcesPanel/ResourcesPanel";
import { Canvas } from "@/components/createTemplate/Canvas/Canvas";
import { PropertiesPanel } from "@/components/createTemplate/PropertiesPanel/PropertiesPanel";
import { PlacedImage } from "@/components/createTemplate/Canvas/CanvasItem";

const MAX_VISIBLE_SIZE = 700;

export default function CreateTemplatePage() {
  const searchParams = useSearchParams();
  const width = Number(searchParams.get("width")) || 600;
  const height = Number(searchParams.get("height")) || 900;

  const [droppedImages, setDroppedImages] = useState<PlacedImage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [interaction, setInteraction] = useState<{
    type: "move" | "resize" | "rotate" | null;
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
    const imgWidth = 150;
    const imgHeight = 150;

    const x = (e.clientX - rect.left) / scale - imgWidth / 2;
    const y = (e.clientY - rect.top) / scale - imgHeight / 2;

    const newImage: PlacedImage = {
      id: `${item.id_image}-${Date.now()}`,
      url: item.url,
      name: item.name,
      x: Math.max(0, Math.min(x, width - imgWidth)),
      y: Math.max(0, Math.min(y, height - imgHeight)),
      width: imgWidth,
      height: imgHeight,
      rotation: 0,
    };

    setDroppedImages((prev) => [...prev, newImage]);
    setSelectedId(newImage.id);
  };

  const handleDeleteImage = useCallback((idToDelete: string) => {
    setDroppedImages((prev) => prev.filter((img) => img.id !== idToDelete));
    setSelectedId(null);
  }, []);

  const handleSelect = (e: React.MouseEvent, id: string | null) => {
    if (e) e.stopPropagation();
    setSelectedId(id);
  };

  const startAction = (
    e: React.MouseEvent,
    id: string,
    actionType: "move" | "resize" | "rotate",
  ) => {
    e.stopPropagation();
    setSelectedId(id);

    const img = droppedImages.find((i) => i.id === id);
    if (!img || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const centerX = rect.left + (img.x + img.width / 2) * scale;
    const centerY = rect.top + (img.y + img.height / 2) * scale;

    setInteraction({
      type: actionType,
      startX: e.clientX,
      startY: e.clientY,
      initialX: img.x,
      initialY: img.y,
      initialW: img.width,
      initialH: img.height,
      initialRotation: img.rotation || 0,
      centerX,
      centerY,
    });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!interaction.type || !selectedId) return;

      const deltaX = (e.clientX - interaction.startX) / scale;
      const deltaY = (e.clientY - interaction.startY) / scale;

      setDroppedImages((prev) =>
        prev.map((img) => {
          if (img.id !== selectedId) return img;

          if (interaction.type === "move") {
            return {
              ...img,
              x: interaction.initialX + deltaX,
              y: interaction.initialY + deltaY,
            };
          }

          if (interaction.type === "resize") {
            return {
              ...img,
              width: Math.max(30, interaction.initialW + deltaX),
              height: Math.max(30, interaction.initialH + deltaY),
            };
          }

          if (interaction.type === "rotate") {
            const radians = Math.atan2(
              e.clientY - interaction.centerY,
              e.clientX - interaction.centerX,
            );

            let degrees = Math.round(radians * (180 / Math.PI)) + 90;
            if (degrees < 0) degrees += 360;

            return {
              ...img,
              rotation: degrees,
            };
          }

          return img;
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
      canvas: {
        width,
        height,
      },
      layers: droppedImages.map((img, index) => ({
        name: img.name,
        position: {
          x: Math.round(img.x),
          y: Math.round(img.y),
        },
        size: {
          width: Math.round(img.width),
          height: Math.round(img.height),
        },
        rotation: img.rotation || 0,
      })),
    };

    console.log("JSON generado:", JSON.stringify(payload, null, 2));

    try {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("¡Plantilla guardada correctamente!");
      }
    } catch (error) {
      console.error("Error al guardar la plantilla:", error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        handleDeleteImage(selectedId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, handleDeleteImage]);

  const selectedItem = droppedImages.find((img) => img.id === selectedId);

  const handleBringToFront = useCallback((id: string) => {
    setDroppedImages((prev) => {
      const item = prev.find((img) => img.id === id);
      if (!item) return prev;

      const filtered = prev.filter((img) => img.id !== id);
      return [...filtered, item];
    });
  }, []);

  const handleSendToBack = useCallback((id: string) => {
    setDroppedImages((prev) => {
      const item = prev.find((img) => img.id === id);
      if (!item) return prev;

      const filtered = prev.filter((img) => img.id !== id);
      return [item, ...filtered];
    });
  }, []);

  const handleStepForward = useCallback((id: string) => {
    setDroppedImages((prev) => {
      const currentIndex = prev.findIndex((img) => img.id === id);

      if (currentIndex === -1 || currentIndex === prev.length - 1) return prev;

      const newArr = [...prev];
      const temp = newArr[currentIndex];
      newArr[currentIndex] = newArr[currentIndex + 1];
      newArr[currentIndex + 1] = temp;

      return newArr;
    });
  }, []);

  const handleStepBackward = useCallback((id: string) => {
    setDroppedImages((prev) => {
      const currentIndex = prev.findIndex((img) => img.id === id);

      if (currentIndex <= 0) return prev;

      const newArr = [...prev];
      const temp = newArr[currentIndex];
      newArr[currentIndex] = newArr[currentIndex - 1];
      newArr[currentIndex - 1] = temp;

      return newArr;
    });
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
          items={droppedImages}
          selectedId={selectedId}
          onDropItem={handleDrop}
          onSelect={handleSelect}
          onStartAction={startAction}
        />
      </section>

      <PropertiesPanel
        selectedItem={selectedItem}
        onSave={handleSaveTemplate}
        onDelete={handleDeleteImage}
        onBringToFront={handleBringToFront}
        onSendToBack={handleSendToBack}
        onStepForward={handleStepForward}
        onStepBackward={handleStepBackward}
      />
    </section>
  );
}
