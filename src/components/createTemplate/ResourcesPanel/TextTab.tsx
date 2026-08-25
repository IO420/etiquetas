"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./resourcesPanel.module.css";
import { loadCustomFont } from "@/utils/loadFont";

export interface FontItem {
  id_font: number;
  name: string;
  fontFamily: string;
  url: string;
}

export default function TextTab() {
  const [fonts, setFonts] = useState<FontItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFonts = async () => {
      try {
        const { data } = await axios.get<FontItem[]>(
          "http://localhost:3001/fonts",
        );
        setFonts(data);

        data.forEach((font) => {
          console.log(font);
          loadCustomFont(font.fontFamily, font.url);
        });
      } catch (error) {
        console.error("Error al cargar fuentes de la API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFonts();
  }, []);

  const handleDragStart = (e: React.DragEvent, font: FontItem) => {
    const payload = {
      type: "text",
      text: "Texto editable",
      label: "Campo de Texto",
      fontFamily: font.fontFamily,
      fontUrl: font.url,
      fontSize: 32,
      color: "#000000",
      width: 250,
      height: 50,
    };
    e.dataTransfer.setData("application/json", JSON.stringify(payload));
    e.dataTransfer.effectAllowed = "copy";
  };

  if (loading) return <p>Cargando fuentes...</p>;

  return (
    <div className={styles.textTabContainer}>
      <p style={{ marginBottom: "12px", fontSize: "14px" }}>
        Arrastra o selecciona un estilo de texto al canvas:
      </p>

      <div className={styles.grid}>
        {fonts.map((font) => (
          <div
            key={font.id_font}
            className={styles.fontCard}
            draggable
            onDragStart={(e) => handleDragStart(e, font)}
            style={{
              fontFamily: font.fontFamily,
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              cursor: "grab",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontSize: "18px" }}>{font.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
//IO