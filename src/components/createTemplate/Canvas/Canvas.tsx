"use client";

import { RefObject } from "react";
import { CanvasItem, PlacedImage } from "./CanvasItem";

interface CanvasProps {
  canvasRef: RefObject<HTMLDivElement | null>;
  width: number;
  height: number;
  scale: number;
  items: PlacedImage[];
  selectedId: string | null;
  isPickingColor?: boolean;
  onPickColor?: (e: React.MouseEvent, item: PlacedImage) => void;
  onDropItem: (e: React.DragEvent) => void;
  onSelect: (e: React.MouseEvent, id: string | null) => void;
  onStartAction: (
    e: React.MouseEvent,
    id: string,
    actionType: "move" | "resize" | "rotate",
  ) => void;
}

export function Canvas({
  canvasRef,
  width,
  height,
  scale,
  items,
  selectedId,
  isPickingColor,
  onPickColor,
  onDropItem,
  onSelect,
  onStartAction,
}: CanvasProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  return (
    <div
    style={{overflow:"hidden"}}>
      <div
        ref={canvasRef}
        onDragOver={handleDragOver}
        onDrop={onDropItem}
        onClick={() => onSelect(null as any, null)}
        style={{
          width,
          height,
          transform: `scale(${scale})`,
          position: "relative",
          backgroundColor: "#ffffff",
        }}
      >
        {items.map((img) => (
          <CanvasItem
            key={img.id}
            item={img}
            isSelected={img.id === selectedId}
            isPickingColor={isPickingColor}
            onPickColor={onPickColor}
            onSelect={(e, id) => onSelect(e, id)}
            onStartAction={onStartAction}
          />
        ))}
      </div>
    </div>
  );
}
