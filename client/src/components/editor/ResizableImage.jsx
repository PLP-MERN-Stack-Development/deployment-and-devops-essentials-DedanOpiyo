// client/src/components/editor/ResizableImage.jsx
import { useState } from "react";

export default function ResizableImage({ src, alt, width, updateMarkdown }) {
  const [w, setW] = useState(parseInt(width) || 300);
  const minWidth = 80;

  const handleDrag = (e) => {
    const newWidth = Math.max(minWidth, e.clientX - e.target.getBoundingClientRect().left);
    setW(newWidth);

    updateMarkdown(newWidth);
  };

  return (
    <span style={{ display: "inline-block", position: "relative" }}>
      <img src={src} alt={alt} style={{ width: w }} />

      {/* Resize handle */}
      <div
        onMouseDown={(e) => {
          e.preventDefault();
          const onMove = (moveEvent) => handleDrag(moveEvent);
          const onUp = () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
          };
          window.addEventListener("mousemove", onMove);
          window.addEventListener("mouseup", onUp);
        }}
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: "#3498db",
          position: "absolute",
          right: -6,
          bottom: -6,
          cursor: "nwse-resize"
        }}
      ></div>
    </span>
  );
}
