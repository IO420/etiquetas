"use client";

import { ImageLayer, PlacedLayer } from "@/types/canvas";

interface PropertiesPanelProps {
  selectedItem: PlacedLayer | undefined;
  isPickingColor: boolean;
  onTogglePicker: () => void;
  onToleranceChange: (tolerance: number) => void;
  tolerance: number;
  onSave: () => void;
  onDelete: (id: string) => void;
  onBringToFront: (id: string) => void;
  onSendToBack: (id: string) => void;
  onStepForward: (id: string) => void;
  onStepBackward: (id: string) => void;
  onToggleFlipX?: (id: string) => void;
  onToggleFlipY?: (id: string) => void;
}

export function PropertiesPanel({
  selectedItem,
  isPickingColor,
  onTogglePicker,
  onToleranceChange,
  tolerance,
  onSave,
  onDelete,
  onBringToFront,
  onSendToBack,
  onStepForward,
  onStepBackward,
  onToggleFlipX,
  onToggleFlipY,
}: PropertiesPanelProps) {
  const isImage = selectedItem?.type === "image";

  return (
    <aside
      style={{
        width: "250px",
        padding: "1rem",
        borderLeft: "1px solid #e5e7eb",
        background: "white",
      }}
    >
      {selectedItem && isImage ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <strong>Modo Espejo:</strong>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.5rem",
              }}
            >
              <button
                onClick={() => onToggleFlipX && onToggleFlipX(selectedItem.id)}
                style={{
                  padding: "0.5rem",
                  backgroundColor: (selectedItem as ImageLayer).flipX
                    ? "#4f46e5"
                    : "#e5e7eb",
                  color: (selectedItem as ImageLayer).flipX
                    ? "#ffffff"
                    : "#000000",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                ↔ Horizontal
              </button>
              <button
                onClick={() => onToggleFlipY && onToggleFlipY(selectedItem.id)}
                style={{
                  padding: "0.5rem",
                  backgroundColor: (selectedItem as ImageLayer).flipY
                    ? "#4f46e5"
                    : "#e5e7eb",
                  color: (selectedItem as ImageLayer).flipY
                    ? "#ffffff"
                    : "#000000",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                ↕ Vertical
              </button>
            </div>
          </div>
          
          <h2>Herramienta Transparencia</h2>

          <button
            onClick={onTogglePicker}
            style={{
              padding: "0.5rem",
              backgroundColor: isPickingColor ? "#10b981" : "#4f46e5",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {isPickingColor
              ? "Haz clic en la imagen..."
              : "Gotero: Eliminar Color"}
          </button>

          <div>
            <label style={{ fontSize: "12px", display: "block" }}>
              Tolerancia de Color: {tolerance}
            </label>
            <input
              type="range"
              min="5"
              max="100"
              value={tolerance}
              onChange={(e) => onToleranceChange(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      ) : (
        <p style={{ fontSize: "13px", color: "#6b7280" }}>
          {selectedItem
            ? "Las herramientas de transparencia solo aplican a imágenes."
            : "Selecciona una imagen para quitarle el fondo."}
        </p>
      )}

      <button
        onClick={onSave}
        style={{
          width: "100%",
          padding: "0.75rem",
          backgroundColor: "#16a34a",
          color: "#fff",
          fontWeight: "bold",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginBottom: "1rem",
        }}
      >
        Guardar Plantilla
      </button>

      {selectedItem && (
        <div>
          <p>
            <strong>Rotación:</strong> {selectedItem.rotation || 0}°
          </p>
        </div>
      )}

      <h2>Propiedades</h2>
      <div>
        {selectedItem ? (
          <div>
            <p>
              <strong>Tipo:</strong>{" "}
              {selectedItem.type === "image" ? "Imagen" : "Texto"}
            </p>
            {selectedItem.type === "image" && (
              <p>
                <strong>Nombre:</strong> {selectedItem.name}
              </p>
            )}
            {selectedItem.type === "text" && (
              <>
                <p>
                  <strong>Fuente:</strong> {selectedItem.fontFamily}
                </p>
                <p>
                  <strong>Texto:</strong> {selectedItem.text}
                </p>
              </>
            )}
            <p>
              <strong>Ancho:</strong> {Math.round(selectedItem.width)}px
            </p>
            <p>
              <strong>Alto:</strong> {Math.round(selectedItem.height)}px
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                marginTop: "1rem",
              }}
            >
              <strong>Orden de capas:</strong>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.5rem",
                }}
              >
                <button
                  onClick={() => onStepForward(selectedItem.id)}
                  style={{
                    padding: "0.5rem",
                    backgroundColor: "#3b82f6",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Subir 1 nivel
                </button>

                <button
                  onClick={() => onStepBackward(selectedItem.id)}
                  style={{
                    padding: "0.5rem",
                    backgroundColor: "#6b7280",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Bajar 1 nivel
                </button>
              </div>

              <button
                onClick={() => onBringToFront(selectedItem.id)}
                style={{
                  padding: "0.5rem",
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Traer al frente
              </button>

              <button
                onClick={() => onSendToBack(selectedItem.id)}
                style={{
                  padding: "0.5rem",
                  backgroundColor: "#374151",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Enviar al fondo
              </button>

              <button
                onClick={() => onDelete(selectedItem.id)}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.5rem",
                  backgroundColor: "#ef4444",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Eliminar {selectedItem.type === "image" ? "Imagen" : "Texto"}
              </button>
            </div>
          </div>
        ) : (
          <p>Selecciona un elemento para editarlo.</p>
        )}
      </div>
    </aside>
  );
}
