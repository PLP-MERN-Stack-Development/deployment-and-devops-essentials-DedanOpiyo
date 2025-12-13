// src/components/blog/BlogMediaUpload.jsx
import { useState, useRef } from "react";
import { blogMediaService } from "../../services/blogMediaService";

export default function BlogMediaUpload({ onUploaded, sessionId }) {
  const [uploading, setUploading] = useState(false);
  const [inputKey, setInputKey] = useState(Date.now());
  const [previewFile, setPreviewFile] = useState(null);

  const inputRef = useRef(null); 

  const handleFiles = async (files) => {
    const file = files[0];
    if (!file) return;

    setPreviewFile(file);
    setUploading(true);

    try {
      const media = await blogMediaService.uploadMedia(file, sessionId);
      onUploaded(media);   // now sends full media object, not just url to parent (MDEditor)
      alert("Uploaded! URL copied to editor.");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }

    setUploading(false);
    setInputKey(Date.now());
  };

  const onDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-3">
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        // onClick={() => document.getElementById("blogMediaInput").click()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed rounded-lg p-6 text-center
                   cursor-pointer hover:bg-gray-50 transition"
      >
        {uploading ? (
          <p className="text-blue-600 font-medium">Uploading...</p>
        ) : (
          <>
            <p>{`Drag & drop media here (images, videos, PDFs etc.)`}</p>
            <p className="text-gray-500 text-sm">or click to choose file</p>
            {/* A small upload pill button */}
            <button
              type="button"
              onClick={() => inputRef.current.click()}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm shadow"
            >
              Upload Media
            </button>

            <input
              ref={inputRef}              // ← ATTACH REF
              id="blogMediaInput"
              key={inputKey}
              type="file"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </>
        )}
      </div>

      {/* Preview */}
      {previewFile && (
        <div className="mt-3">
          {previewFile.type.startsWith("image/") && (
            <img
              src={URL.createObjectURL(previewFile)}
              className="max-w-xs rounded shadow"
            />
          )}

          {previewFile.type.startsWith("video/") && (
            <video
              src={URL.createObjectURL(previewFile)}
              className="max-w-xs rounded shadow"
              controls
            />
          )}

          {!previewFile.type.startsWith("image/") &&
           !previewFile.type.startsWith("video/") && (
            <p className="font-medium text-gray-700">
              {previewFile.name}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
