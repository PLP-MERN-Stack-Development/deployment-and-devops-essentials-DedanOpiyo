// client/src/pages/CreatePost.jsx
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import postService from "../services/postService";
import { categoryService } from "../services/categoryService";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import MDEditor from "@uiw/react-md-editor";
import BlogMediaUpload from "../components/blog/BlogMediaUpload";
import BlogMediaLibrary from "../components/blog/BlogMediaLibrary";

function CreatePost() {
  const { user } = useAuth();

  if (!user || (user.role !== "admin" && user.role !== "doctor"))
    return <p className="p-6 rounded shadow text-center min-h-[68.8vh] mt-10">Only admin / doctors can create blog posts.</p>;

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showLibrary, setShowLibrary] = useState(false);
  
  // Store a unique sessionId when creating post
  const [sessionId] = useState(() => {
    return localStorage.getItem("blogSessionId") ||
      (() => {
        const id = crypto.randomUUID();
        localStorage.setItem("blogSessionId", id);
        return id;
      })();
  });
  if (sessionId) console.log("[CREATE POST] sessionId: ", sessionId)

  // 🌗 NEW: local editor theme toggle
  const [editorTheme, setEditorTheme] = useState("light"); // "light" | "dark"

  const toggleEditorTheme = () => {
    setEditorTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Load saved draft
  useEffect(() => {
    const draft = JSON.parse(localStorage.getItem("blogDraft") || "{}");

    if (draft.title) setTitle(draft.title);
    if (draft.content) setContent(draft.content);
    if (draft.category) setCategory(draft.category);
    if (draft.preview) setPreview(draft.preview);
  }, []);

  // Autosave draft
  useEffect(() => {
    localStorage.setItem(
      "blogDraft",
      JSON.stringify({ title, content, category, preview })
    );
  }, [title, content, category, preview]);

  useEffect(() => {
    categoryService.getAllCategories().then(setCategories);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    if (image) formData.append("featuredImage", image);

    try {
      await postService.createPost(formData);
      localStorage.removeItem("blogDraft");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to create post.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Card>
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:-text-gray-100">
          Create New Post
        </h1>

        {/* 🌗 Theme toggle button */}
        <button
          type="button"
          onClick={toggleEditorTheme}
          className="mb-6 px-4 py-2 rounded bg-gray-200 dark-:bg-gray-700 hover:bg-gray-300 dark-:hover:bg-gray-600"
        >
          Switch Editor to {editorTheme === "light" ? "Dark" : "Light"} Mode
        </button>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <div>
            <label className="block font-medium mb-1">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded bg-white"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block font-medium mb-1">
              Content
            </label>
            
            {!showLibrary && (
            <div className="flex items-center gap-3 mb-3">
              <BlogMediaUpload
                sessionId={sessionId}
                onUploaded={(url) => setContent((prev) => prev + `\n![](${url})\n`)} // auto-insert into markdown
              />

              <button
                type="button"
                onClick={() => setShowLibrary(true)}
                className="px-3 py-2 bg-gray-200 rounded"
              >
                Browse Your Library
              </button>
            </div>
            )}
            {showLibrary && (
              <BlogMediaLibrary
                sessionId={sessionId}
                onSelect={(url) => {
                  setContent(prev => prev + `\n![](${url})\n`);
                  setShowLibrary(false);
                }}
                onClose={() => setShowLibrary(false)}
              />
            )}

            <div className={editorTheme === "light" ? "md-editor-light" : "md-editor-dark"}>
              <MDEditor
                value={content}
                onChange={setContent}
                height={400}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block font-medium mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded bg-white"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option value={c._id} key={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Image */}
          <div>
            <label className="block font-medium mb-1">
              Featured Image
            </label>

            {/* Upload Zone */}
            {!preview ? (
              <div
                className="border-2 border-dashed rounded p-6 text-center cursor-pointer hover:bg-gray-50 transition"
                onClick={() => document.getElementById("featuredInput").click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  setImage(file);
                  setPreview(URL.createObjectURL(file));
                }}
              >
                <p className="text-gray-600">Drag & drop featured image</p>
                <p className="text-sm text-gray-500">or click to select</p>

                <input
                  id="featuredInput"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setImage(file);
                    setPreview(file ? URL.createObjectURL(file) : null);
                  }}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative inline-block group">
                <img
                  src={preview}
                  alt="Featured Preview"
                  className="mt-4 w-full max-w-xs rounded shadow-md"
                />

                {/* Replace Button on Hover */}
                <button
                  type="button"
                  className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-sm font-medium rounded"
                  onClick={() => document.getElementById("featuredInputReplace").click()}
                >
                  Replace Image
                </button>

                {/* Hidden replace input */}
                <input
                  id="featuredInputReplace"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setImage(file);
                    setPreview(file ? URL.createObjectURL(file) : null);
                  }}
                  className="hidden"
                />

                {/* Delete button */}
                <button
                  type="button"
                  className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full w-7 h-7 text-sm flex items-center justify-center shadow"
                  onClick={() => {
                    setImage(null);
                    setPreview(null);
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Create Post
          </button>
        </form>
      </Card>
    </div>
  );
}

export default CreatePost;
