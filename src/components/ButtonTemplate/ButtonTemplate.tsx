"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ButtonTemplate.module.css";

const TEMPLATE_SIZES = [
  {
    id: "small",
    name: "Etiqueta pequeña",
    width: 400,
    height: 200,
  },
  {
    id: "medium",
    name: "Etiqueta mediana",
    width: 600,
    height: 400,
  },
  {
    id: "professional",
    name: "Portada profesional",
    width: 600,
    height: 850,
  },
  {
    id: "square",
    name: "Cuadrada",
    width: 600,
    height: 600,
  },
];

export default function ButtonTemplate() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(TEMPLATE_SIZES[0]);

  const handleCreate = () => {
    router.push(
      `/templates/create?width=${selected.width}&height=${selected.height}`
    );
  };

  return (
    <>
      <button
        className={styles.button}
        onClick={() => setOpen(true)}
      >
        + Nueva plantilla
      </button>

      {open && (
        <div
          className={styles.overlay}
          onClick={() => setOpen(false)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Crear plantilla</h2>

            <p className={styles.subtitle}>
              Selecciona el tamaño de la etiqueta.
            </p>

            <div className={styles.options}>
              {TEMPLATE_SIZES.map((item) => (
                <button
                  key={item.id}
                  className={`${styles.option} ${
                    selected.id === item.id ? styles.selected : ""
                  }`}
                  onClick={() => setSelected(item)}
                >
                  <strong>{item.name}</strong>

                  <span>
                    {item.width} × {item.height}px
                  </span>
                </button>
              ))}
            </div>

            <div className={styles.footer}>
              <button
                className={styles.cancel}
                onClick={() => setOpen(false)}
              >
                Cancelar
              </button>

              <button
                className={styles.create}
                onClick={handleCreate}
              >
                Crear plantilla
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
