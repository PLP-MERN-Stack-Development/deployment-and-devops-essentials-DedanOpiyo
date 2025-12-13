// src/components/help/ScreenshotUploader.jsx
import { useEffect, useRef, useState } from "react";
import Sortable from "sortablejs";

export default function ScreenshotUploader({ onChange }) {
  const [files, setFiles] = useState([]);
  const [inputKey, setInputKey] = useState(Date.now()); // forces real reset of <input>
  // const dragIndex = useRef(null);
  const listRef = useRef(null);
  const sortableRef = useRef(null);

  const addFiles = (incoming) => {
    const incomingArr = Array.from(incoming);

    // Append but enforce max 3
    const combined = [...files, ...incomingArr].slice(0, 3);

    setFiles(combined);
    onChange(combined);

    // Reset input so selecting the same file again works
    setInputKey(Date.now());
  };

  const onFileInput = (e) => addFiles(e.target.files);

  const onDrop = (e) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onChange(updated);

    // If we removed ALL images → reset the file input (browser clears name)
    if (updated.length === 0) {
      setInputKey(Date.now());
    }
  };

  // // drag start
  // const handleDragStart = (idx) => {
  //   dragIndex.current = idx;
  // };

  // // drag over thumbnails
  // const handleDragEnter = (idx) => {
  //   const from = dragIndex.current;
  //   if (from === idx) return;

  //   const reordered = [...files];
  //   const moved = reordered.splice(from, 1)[0];
  //   reordered.splice(idx, 0, moved);

  //   dragIndex.current = idx;
  //   setFiles(reordered);
  //   onChange(reordered);
  // };

  // Initialize SortableJS
  useEffect(() => {
    if (!listRef.current) return;

    if (sortableRef.current) {
      sortableRef.current.destroy();
    }

    sortableRef.current = Sortable.create(listRef.current, {
      animation: 180,
      ghostClass: "sortable-ghost",
      chosenClass: "sortable-chosen",
      onEnd: (evt) => {
        const updated = [...files];
        const [moved] = updated.splice(evt.oldIndex, 1);
        updated.splice(evt.newIndex, 0, moved);
        setFiles(updated);
        onChange(updated);
      },
    });
  }, [files]);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between mb-1">
        <label className="font-medium">Screenshots (max 3)</label>
        <span className="text-sm text-gray-500">
          {files.length} / 3 uploaded
        </span>
      </div>
      
      {/* Drag & Drop zone */}
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed rounded p-5 text-center cursor-pointer transition hover:bg-gray-50"
        onClick={() => document.getElementById("fileInput").click()}
      >
        <p className="text-gray-600">Drag & drop images here</p>
        <p className="text-gray-500 text-sm">or click to select</p>

        <input
          id="fileInput"
          key={inputKey}                   // forces input to fully reset
          type="file"
          multiple
          accept="image/*"
          onChange={onFileInput}
          className="hidden"
        />
      </div>

      {/* Thumbnails preview */}
      {files.length > 0 && (
        // <div className="mt-4 flex gap-4 flex-wrap">
        // {/* Thumbnails container — SortableJS binds to this */}
        <div
          ref={listRef}
          className="mt-4 flex gap-4 flex-wrap select-none"
        >
          {files.map((file, i) => (
            <div 
              key={i} 
              // className="relative w-24 h-24"
              className="relative w-24 h-24 group cursor-grab active:cursor-grabbing"
              // draggable
              // onDragStart={() => handleDragStart(i)}
              // onDragEnter={() => handleDragEnter(i)}
              data-id={i}
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`upload-${i}`}
                // className="w-24 h-24 object-cover rounded border shadow-sm cursor-move"
                className="w-24 h-24 object-cover rounded border shadow transition-all group-hover:shadow-lg"
              />

              <button
                type="button"
                onClick={() => removeImage(i)}
                // className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center opacity-90 group-hover:opacity-100"
              >
                ✕
              </button>

              <p className="text-xs text-center mt-1 text-gray-600 truncate w-24">
                {file.name}
              </p>
            </div>
          ))}
        </div>
      )}

      <style>
        {`
          .sortable-ghost {
            opacity: 0.4;
            transform: scale(0.95);
          }

          .sortable-chosen {
            @apply ring-2 ring-blue-400;
          }
        `}
      </style>
    </div>
  );
}
