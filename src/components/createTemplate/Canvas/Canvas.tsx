"use client";

import { RefObject } from "react";
import { CanvasItem } from "./CanvasItem";
import { PlacedLayer, ImageLayer } from "@/types/canvas";

interface CanvasProps {
  canvasRef: RefObject<HTMLDivElement | null>;
  width: number;
  height: number;
  scale: number;
  items: PlacedLayer[];
  selectedId: string | null;
  isPickingColor?: boolean;
  onPickColor?: (e: React.MouseEvent, item: ImageLayer) => void;
  onDropItem: (e: React.DragEvent) => void;
  onSelect: (e: React.MouseEvent, id: string | null) => void;
  onStartAction: (
    e: React.MouseEvent,
    id: string,
    actionType:
      | "move"
      | "resize"
      | "rotate"
      | "resizeL"
      | "resizeT"
      | "resizeLT",
  ) => void;
  onUpdateText?: (id: string, newText: string) => void; 
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
  onUpdateText,
}: CanvasProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  return (
    <div style={{ overflow: "hidden" }}>
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
        {items.map((item) => (
          <CanvasItem
            key={item.id}
            item={item}
            isSelected={item.id === selectedId}
            isPickingColor={isPickingColor}
            onPickColor={onPickColor}
            onSelect={(e, id) => onSelect(e, id)}
            onStartAction={onStartAction}
            onUpdateText={onUpdateText}
          />
        ))}
      </div>
    </div>
  );
}
//IO