"use client";

import { useState } from "react";
import styles from "./resourcesPanel.module.css";
import ImagesTab from "./ImageTab";
import FiguresTab from "./FiguresTab";
import TextTab from "./TextTab";

type Tab = "images" | "figures" | "text";

export default function ResourcesPanel() {
  const [tab, setTab] = useState<Tab>("images");

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          className={tab === "images" ? styles.active : ""}
          onClick={() => setTab("images")}
        >
          Imágenes
        </button>

        <button
          className={tab === "figures" ? styles.active : ""}
          onClick={() => setTab("figures")}
        >
          Figuras
        </button>

        <button
          className={tab === "text" ? styles.active : ""}
          onClick={() => setTab("text")}
        >
          Texto
        </button>
      </div>

      <div className={styles.content}>
        {tab === "images" && <ImagesTab />}
        {tab === "figures" && <FiguresTab />}
        {tab === "text" && <TextTab />}
      </div>
    </div>
  );
}