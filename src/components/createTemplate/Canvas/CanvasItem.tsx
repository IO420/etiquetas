"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { PlacedLayer, ImageLayer } from "@/types/canvas";

interface CanvasItemProps {
  item: PlacedLayer;
  isSelected: boolean;
  isPickingColor?: boolean;
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
  onSelect: (e: React.MouseEvent, id: string) => void;
  onPickColor?: (e: React.MouseEvent, item: ImageLayer) => void;
  onUpdateText?: (id: string, newText: string) => void;
}

export function CanvasItem({
  item,
  isSelected,
  isPickingColor,
  onStartAction,
  onSelect,
  onPickColor,
  onUpdateText,
}: CanvasItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [textValue, setTextValue] = useState(
    item.type === "text" ? item.text : "",
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (item.type === "text") {
      setTextValue(item.text);
    }
  }, [item]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPickingColor && onPickColor && item.type === "image") {
      onPickColor(e, item);
    } else {
      onSelect(e, item.id);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return;
    e.stopPropagation();
    if (!isPickingColor) {
      onStartAction(e, item.id, "move");
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.type === "text") {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (onUpdateText && item.type === "text") {
      onUpdateText(item.id, textValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur();
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      style={{
        position: "absolute",
        left: `${item.x}px`,
        top: `${item.y}px`,
        width: `${item.width}px`,
        height: `${item.height}px`,
        transform: `rotate(${item.rotation || 0}deg)`,
        transformOrigin: "center center",
        cursor: isEditing
          ? "text"
          : isPickingColor && item.type === "image"
            ? "crosshair"
            : "move",
        outline: isSelected ? "2px solid #2563eb" : "none",
        userSelect: isEditing ? "text" : "none",
      }}
    >
      {item.type === "image" ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            transform: `scaleX(${item.flipX ? -1 : 1}) scaleY(${item.flipY ? -1 : 1})`,
            transformOrigin: "center center",
            pointerEvents: "none",
          }}
          draggable={false}
        >
          <Image
            src={item.url}
            alt={item.name || "Imagen"}
            fill
            style={{ objectFit: "contain" }}
            unoptimized
            draggable={false}
          />
        </div>
      ) : item.type === "rectangle" ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: item.fillColor || "#3b82f6",
            borderWidth: `${item.strokeWidth || 0}px`,
            borderColor: item.strokeColor || "transparent",
            borderStyle:
              item.dashPattern === "dashed"
                ? "dashed"
                : item.dashPattern === "dotted"
                  ? "dotted"
                  : "solid",
            borderRadius: `${item.borderRadius || 0}px`,
            boxSizing: "border-box",
            pointerEvents: "none",
          }}
        />
      ) : isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            height: "100%",
            fontFamily: item.fontFamily,
            fontSize: `${item.fontSize}px`,
            color: item.color,
            background: "transparent",
            border: "none",
            outline: "none",
            textAlign: "center",
            padding: 0,
            margin: 0,
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            fontFamily: item.fontFamily,
            fontSize: `${item.fontSize}px`,
            color: item.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {item.text}
        </div>
      )}

      {isSelected && !isPickingColor && !isEditing && (
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
              onStartAction(e, item.id, "resizeL");
            }}
            style={{
              position: "absolute",
              bottom: "-6px",
              left: "-6px",
              width: "12px",
              height: "12px",
              backgroundColor: "#2563eb",
              border: "2px solid #ffffff",
              borderRadius: "50%",
              cursor: "nesw-resize",
              zIndex: 10,
            }}
          />

          <div
            onMouseDown={(e) => {
              e.stopPropagation();
              onStartAction(e, item.id, "resizeT");
            }}
            style={{
              position: "absolute",
              top: "-6px",
              right: "-6px",
              width: "12px",
              height: "12px",
              backgroundColor: "#2563eb",
              border: "2px solid #ffffff",
              borderRadius: "50%",
              cursor: "nesw-resize",
              zIndex: 10,
            }}
          />

          <div
            onMouseDown={(e) => {
              e.stopPropagation();
              onStartAction(e, item.id, "resizeLT");
            }}
            style={{
              position: "absolute",
              top: "-6px",
              left: "-6px",
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
//IO
