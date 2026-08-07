"use client";

import { PlacedImage } from "../Canvas/CanvasItem";

interface PropertiesPanelProps {
  selectedItem: PlacedImage | undefined;
  onSave: () => void;
  onDelete: (id: string) => void;
  onBringToFront: (id: string) => void;
  onSendToBack: (id: string) => void;
  onStepForward: (id: string) => void;
  onStepBackward: (id: string) => void;
}

export function PropertiesPanel({
  selectedItem,
  onSave,
  onDelete,
  onBringToFront,
  onSendToBack,
  onStepForward,
  onStepBackward,
}: PropertiesPanelProps) {
  return (
    <aside
      style={{
        width: "250px",
        padding: "1rem",
        borderLeft: "1px solid #e5e7eb",
      }}
    >
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
        Guardar Plantilla (JSON)
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
              <strong>Imagen:</strong> {selectedItem.name}
            </p>
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
                Eliminar Imagen
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
