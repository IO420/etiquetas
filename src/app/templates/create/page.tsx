"use client";

import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import styles from "./create.module.css";
import ResourcesPanel from "@/components/createTemplate/ResourcesPanel/ResourcesPanel";

const MAX_VISIBLE_SIZE = 700;

interface PlacedImage {
  id: string;
  url: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function CreateTemplatePage() {
  const searchParams = useSearchParams();

  const width = Number(searchParams.get("width")) || 600;
  const height = Number(searchParams.get("height")) || 900;

  const [droppedImages, setDroppedImages] = useState<PlacedImage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [interaction, setInteraction] = useState<{
    type: "move" | "resize" | null;
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    initialW: number;
    initialH: number;
  }>({
    type: null,
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
    initialW: 0,
    initialH: 0,
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  const scale = useMemo(() => {
    return Math.min(MAX_VISIBLE_SIZE / width, MAX_VISIBLE_SIZE / height, 1);
  }, [width, height]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

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
    };

    setDroppedImages((prev) => [...prev, newImage]);
    setSelectedId(newImage.id);
  };

  const startAction = (
    e: React.MouseEvent,
    id: string,
    actionType: "move" | "resize",
  ) => {
    e.stopPropagation();
    setSelectedId(id);

    const img = droppedImages.find((i) => i.id === id);
    if (!img) return;

    setInteraction({
      type: actionType,
      startX: e.clientX,
      startY: e.clientY,
      initialX: img.x,
      initialY: img.y,
      initialW: img.width,
      initialH: img.height,
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

  return (
    <section className={styles.container}>
      <aside className={styles.sidebar}>
        <ResourcesPanel />
      </aside>

      <section className={styles.workspace}>
        <div className={styles.background}>
          <div
            ref={canvasRef}
            className={styles.canvas}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => setSelectedId(null)}
            style={{
              width,
              height,
              transform: `scale(${scale})`,
              position: "relative",
            }}
          >
            {droppedImages.map((img) => {
              const isSelected = img.id === selectedId;

              return (
                <div
                  key={img.id}
                  onMouseDown={(e) => startAction(e, img.id, "move")}
                  style={{
                    position: "absolute",
                    left: `${img.x}px`,
                    top: `${img.y}px`,
                    width: `${img.width}px`,
                    height: `${img.height}px`,
                    cursor: "move",
                    outline: isSelected ? "2px solid #2563eb" : "none",
                    userSelect: "none",
                  }}
                >
                  <Image
                    src={img.url}
                    alt={img.name}
                    fill
                    unoptimized
                    draggable={false}
                    style={{ objectFit: "contain", pointerEvents: "none" }}
                  />

                  {isSelected && (
                    <div
                      onMouseDown={(e) => startAction(e, img.id, "resize")}
                      className={styles.selected}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <aside className={styles.properties}>
        <h2>Propiedades</h2>
        <div className={styles.propertyArea}>
          {selectedId ? (
            <p>Imagen seleccionada (ID: {selectedId})</p>
          ) : (
            <p>Selecciona un elemento para editarlo.</p>
          )}
        </div>
      </aside>
    </section>
  );
}
//IO