"use client";

import {
  ImageLayer,
  PlacedLayer,
  RectangleLayer,
  TextLayer,
} from "@/types/canvas";

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

  onUpdateRectangle?: (id: string, updates: Partial<RectangleLayer>) => void;
  onUpdateTextProps?: (id: string, updates: Partial<TextLayer>) => void;
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

  onUpdateRectangle,
  onUpdateTextProps,
}: PropertiesPanelProps) {
  const isImage = selectedItem?.type === "image";
  const isRectangle = selectedItem?.type === "rectangle";
  const isText = selectedItem?.type === "text";

  return (
    <aside
      style={{
        width: "250px",
        padding: "1rem",
        borderLeft: "1px solid #e5e7eb",
        background: "white",
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
        Guardar Plantilla
      </button>

      {selectedItem && isImage && (
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
      )}

      {selectedItem &&
        isRectangle &&
        onUpdateRectangle &&
        (() => {
          const rect = selectedItem as RectangleLayer;
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                marginBottom: "1rem",
              }}
            >
              <h2>Estilos de Rectángulo</h2>

              <div>
                <label
                  style={{
                    fontSize: "12px",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Color de Relleno:
                </label>
                <input
                  type="color"
                  value={rect.fillColor || "#3b82f6"}
                  onChange={(e) =>
                    onUpdateRectangle(rect.id, { fillColor: e.target.value })
                  }
                  style={{
                    width: "100%",
                    height: "36px",
                    cursor: "pointer",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: "12px",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Color de Borde:
                </label>
                <input
                  type="color"
                  value={
                    !rect.strokeColor || rect.strokeColor === "transparent"
                      ? "#000000"
                      : rect.strokeColor
                  }
                  onChange={(e) =>
                    onUpdateRectangle(rect.id, { strokeColor: e.target.value })
                  }
                  style={{
                    width: "100%",
                    height: "36px",
                    cursor: "pointer",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", display: "block" }}>
                  Grosor de Borde: {Number(rect.strokeWidth) || 0}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={Number(rect.strokeWidth) || 0}
                  onChange={(e) =>
                    onUpdateRectangle(rect.id, {
                      strokeWidth: Number(e.target.value),
                    })
                  }
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", display: "block" }}>
                  Radio de Borde: {Number(rect.borderRadius) || 0}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={Number(rect.borderRadius) || 0}
                  onChange={(e) =>
                    onUpdateRectangle(rect.id, {
                      borderRadius: Number(e.target.value),
                    })
                  }
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: "12px",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Patrón de Guiones (Dash Pattern):
                </label>
                <select
                  value={rect.dashPattern || ""}
                  onChange={(e) =>
                    onUpdateRectangle(rect.id, {
                      dashPattern: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    height: "36px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    padding: "0 8px",
                    backgroundColor: "#fff",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Línea Continua (Sólida)</option>
                  <option value="5,5">Guiones Estándar (5, 5)</option>
                  <option value="10,5">Guiones Largos (10, 5)</option>
                  <option value="2,2">Punteado Fino (2, 2)</option>
                  <option value="10,5,2,5">Guión y Punto (10, 5, 2, 5)</option>
                </select>
              </div>
            </div>
          );
        })()}

      {selectedItem &&
        isText &&
        onUpdateTextProps &&
        (() => {
          const textLayer = selectedItem as TextLayer;
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                marginBottom: "1rem",
              }}
            >
              <h2>Estilos de Texto</h2>

              {/* CAMPO AÑADIDO: Permite la edición en tiempo real del texto */}
              <div>
                <label
                  style={{
                    fontSize: "12px",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Contenido del Texto:
                </label>
                <input
                  type="text"
                  value={textLayer.text || ""}
                  onChange={(e) =>
                    onUpdateTextProps(textLayer.id, {
                      text: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    height: "36px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    padding: "0 8px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: "12px",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Tamaño de Fuente (px):
                </label>
                <input
                  type="number"
                  min="8"
                  max="200"
                  value={textLayer.fontSize || 32}
                  onChange={(e) =>
                    onUpdateTextProps(textLayer.id, {
                      fontSize: Number(e.target.value),
                    })
                  }
                  style={{
                    width: "100%",
                    height: "36px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    padding: "0 8px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: "12px",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Color de Texto:
                </label>
                <input
                  type="color"
                  value={textLayer.color || "#000000"}
                  onChange={(e) =>
                    onUpdateTextProps(textLayer.id, { color: e.target.value })
                  }
                  style={{
                    width: "100%",
                    height: "36px",
                    cursor: "pointer",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: "12px",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Color del Borde de Texto (Stroke):
                </label>
                <input
                  type="color"
                  value={
                    !textLayer.strokeColor ||
                    textLayer.strokeColor === "transparent"
                      ? "#ffffff"
                      : textLayer.strokeColor
                  }
                  onChange={(e) =>
                    onUpdateTextProps(textLayer.id, {
                      strokeColor: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    height: "36px",
                    cursor: "pointer",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", display: "block" }}>
                  Grosor de Borde (Stroke Width):{" "}
                  {Number(textLayer.strokeWidth) || 0}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={Number(textLayer.strokeWidth) || 0}
                  onChange={(e) =>
                    onUpdateTextProps(textLayer.id, {
                      strokeWidth: Number(e.target.value),
                    })
                  }
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          );
        })()}

      {!selectedItem && (
        <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "1rem" }}>
          Selecciona un elemento para editar sus propiedades.
        </p>
      )}

      <h2>Propiedades</h2>
      <div>
        {selectedItem ? (
          <div>
            <p style={{ margin: "4px 0" }}>
              <strong>Tipo:</strong>{" "}
              {selectedItem.type === "image"
                ? "Imagen"
                : selectedItem.type === "rectangle"
                  ? "Rectángulo"
                  : "Texto"}
            </p>

            {selectedItem.type === "image" && (
              <p style={{ margin: "4px 0" }}>
                <strong>Nombre:</strong> {selectedItem.name}
              </p>
            )}

            {selectedItem.type === "text" && (
              <>
                <p style={{ margin: "4px 0" }}>
                  <strong>Fuente:</strong> {selectedItem.fontFamily}
                </p>
                <p style={{ margin: "4px 0" }}>
                  <strong>Texto:</strong> {selectedItem.text}
                </p>
              </>
            )}

            <p style={{ margin: "4px 0" }}>
              <strong>Ancho:</strong> {Math.round(selectedItem.width)}px
            </p>
            <p style={{ margin: "4px 0" }}>
              <strong>Alto:</strong> {Math.round(selectedItem.height)}px
            </p>
            <p style={{ margin: "4px 0" }}>
              <strong>Rotación:</strong> {selectedItem.rotation || 0}°
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
                Eliminar{" "}
                {selectedItem.type === "image"
                  ? "Imagen"
                  : selectedItem.type === "rectangle"
                    ? "Rectángulo"
                    : "Texto"}
              </button>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: "13px", color: "#6b7280" }}>
            Selecciona un elemento para ver sus opciones.
          </p>
        )}
      </div>
    </aside>
  );
}
