"use client";

import Image from "next/image";

export interface PlacedImage {
  id: string;
  url: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface CanvasItemProps {
  item: PlacedImage;
  isSelected: boolean;
  isPickingColor?: boolean;
  onStartAction: (
    e: React.MouseEvent,
    id: string,
    actionType: "move" | "resize" | "rotate",
  ) => void;
  onSelect: (e: React.MouseEvent, id: string) => void;
  onPickColor?: (e: React.MouseEvent, item: PlacedImage) => void;
}

export function CanvasItem({
  item,
  isSelected,
  isPickingColor,
  onStartAction,
  onSelect,
  onPickColor,
}: CanvasItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPickingColor && onPickColor) {
      onPickColor(e, item);
    } else {
      onSelect(e, item.id);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPickingColor) {
      onStartAction(e, item.id, "move");
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        left: `${item.x}px`,
        top: `${item.y}px`,
        width: `${item.width}px`,
        height: `${item.height}px`,
        transform: `rotate(${item.rotation || 0}deg)`,
        transformOrigin: "center center",
        cursor: "move",
        outline: isSelected ? "2px solid #2563eb" : "none",
        userSelect: "none",
      }}
    >
      <Image
        src={item.url}
        alt={item.name}
        fill
        unoptimized
        draggable={false}
        style={{ objectFit: "contain", pointerEvents: "none" }}
      />

      {isSelected && !isPickingColor && (
        <>
          <div
            onMouseDown={(e) => {
              e.stopPropagation();
              onStartAction(e, item.id, "resize");
            }}
            style={{
              position: "absolute",
              bottom: "-6px",
              right: "-6px",
              width: "12px",
              height: "12px",
              backgroundColor: "#2563eb",
              border: "2px solid #ffffff",
              borderRadius: "50%",
              cursor: "nwse-resize",
              zIndex: 10,
            }}
          />

          <div
            onMouseDown={(e) => {
              e.stopPropagation();
              onStartAction(e, item.id, "rotate");
            }}
            style={{
              position: "absolute",
              top: "-25px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "14px",
              height: "14px",
              backgroundColor: "#10b981",
              border: "2px solid #ffffff",
              borderRadius: "50%",
              cursor: "grab",
              zIndex: 10,
            }}
          />
        </>
      )}
    </div>
  );
}
