"use client";

import { useEffect, useRef } from "react";
import { TextLayer } from "@/types/canvas";

interface CanvasTextProps {
  item: TextLayer;
}

export function CanvasText({ item }: CanvasTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const width = item.width;
    const height = item.height;

    // Resolución real del canvas
    canvas.width = Math.ceil(width);
    canvas.height = Math.ceil(height);

    // Tamaño visual
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    // Igual que el backend
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.translate(centerX, centerY);

    const fontWeight = item.fontWeight ?? "normal";

    ctx.font = `${fontWeight} ${item.fontSize}px "${item.fontFamily}"`;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const strokeWidth = Number(item.strokeWidth || 0);

    if (strokeWidth > 0) {
      ctx.strokeStyle = item.strokeColor || "#FFFFFF";
      ctx.lineWidth = strokeWidth;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      ctx.strokeText(
        item.text,
        0,
        0,
        width > 0 ? width : undefined,
      );
    }

    ctx.fillStyle = item.color || "#000000";

    ctx.fillText(
      item.text,
      0,
      0,
      width > 0 ? width : undefined,
    );

    ctx.restore();
  }, [item]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}