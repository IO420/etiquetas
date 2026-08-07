"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./create.module.css";
import ResourcesPanel from "@/components/createTemplate/ResourcesPanel/ResourcesPanel";

const MAX_VISIBLE_SIZE = 700;

export default function CreateTemplatePage() {
  const searchParams = useSearchParams();

  const width = Number(searchParams.get("width")) || 600;
  const height = Number(searchParams.get("height")) || 900;

  const scale = useMemo(() => {
    return Math.min(MAX_VISIBLE_SIZE / width, MAX_VISIBLE_SIZE / height, 1);
  }, [width, height]);

  return (
    <section className={styles.container}>
      <aside className={styles.sidebar}>
        <ResourcesPanel />
      </aside>

      <section className={styles.workspace}>
        <div className={styles.background}>
          <div
            className={styles.canvas}
            style={{
              width,
              height,
              transform: `scale(${scale})`,
            }}
          />
        </div>
      </section>

      <aside className={styles.properties}>
        <h2>Propiedades</h2>

        <div className={styles.propertyArea}>
          Selecciona un elemento para editarlo.
        </div>
      </aside>
    </section>
  );
}
//IO
