"use client";

export default function FiguresTab() {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        type: "rectangle",
        width: 150,
        height: 100,
        fillColor: "#3b82f6",
        strokeColor: "black",
        strokeWidth: "2",
        borderRadius: 30,
        dashPattern: "none",
      })
    );

    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div>
      <div
        draggable
        onDragStart={handleDragStart}
        style={{
          width: "100px",
          padding: "12px",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          cursor: "grab",
          backgroundColor: "#fff",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "70px",
            height: "45px",
            backgroundColor: "#3b82f6",
            margin: "0 auto 8px",
            borderRadius: "2px",
          }}
        />

        <span style={{ fontSize: "13px" }}>
          Rectángulo
        </span>
      </div>
    </div>
  );
}
//IO