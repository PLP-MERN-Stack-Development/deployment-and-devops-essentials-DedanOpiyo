// client/src/pages/EditPost.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import postService from "../services/postService";
import { categoryService } from "../services/categoryService";

import Card from "../components/Card";
import MDEditor from "@uiw/react-md-editor";
import BlogMediaUpload from "../components/blog/BlogMediaUpload";
import BlogMediaLibrary from "../components/blog/BlogMediaLibrary";

// Custom image resize in MDEditor
import ResizableImage from "../components/editor/ResizableImage";
import rehypeResizableImages from "../components/editor/rehypeResizableImages";
import rehypeReact from "rehype-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function EditPost() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  if (!user || (user.role !== "admin" && user.role !== "doctor"))
    return <p className="p-6 text-center">Only admin / doctors can edit blog posts.</p>;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [sessionId] = useState(() => {
    return localStorage.getItem("editSessionId") ||
      (() => {
        const id = crypto.randomUUID();
        localStorage.setItem("editSessionId", id);
        return id;
      })();
  });

  const [categories, setCategories] = useState([]);

  // library modal
  const [showLibrary, setShowLibrary] = useState(false);

  const [editorTheme, setEditorTheme] = useState("light");

  const toggleEditorTheme = () => {
    setEditorTheme((p) => (p === "light" ? "dark" : "light"));
  };

  /* -------------------------------------------------------
     Load Post Data
  ------------------------------------------------------- */
  useEffect(() => {
    async function loadPost() {
      const post = await postService.getPost(id);
      // setPost(postData);

      setTitle(post.title);
      setContent(post.content);
      setCategory(post.category._id);

      if (post.featuredImage) {
        setPreview(post.featuredImage);
      }
    }

    loadPost();
  }, [id]);

  /* -------------------------------------------------------
     Load Categories
  ------------------------------------------------------- */
  useEffect(() => {
    categoryService.getAllCategories().then(setCategories);
  }, []);

  /* -------------------------------------------------------
     Submit Update
  ------------------------------------------------------- */
  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);

    if (featuredImage instanceof File) {
      formData.append("featuredImage", featuredImage);
    }

    try {
      await postService.updatePost(id, formData);
      navigate(`/posts/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update post");
    }
  };

  /* -------------------------------------------------------
     Insert media into markdown
  ------------------------------------------------------- */
  const insertMedia = (url) => {
    setContent((prev) => prev + `\n![](${url})\n`);
    setShowLibrary(false);
  };

  // // Custom image resize
  // const customRender = new rehypeReact({
  //   createElement: React.createElement,
  //   components: {
  //     img: (props) => {
  //       const { src, alt } = props;
  //       const widthMatch = props.width || props["data-width"];

  //       return (
  //         <ResizableImage
  //           src={src}
  //           alt={alt}
  //           width={widthMatch}
  //           updateMarkdown={(newWidth) => {
  //             setContent((prev) =>
  //               prev.replace(
  //                 new RegExp(`!\\[]\\(${src}\\)(\\{.*?\\})?`),
  //                 `![](${src}){width=${newWidth}}`
  //               )
  //             );
  //           }}
  //         />
  //       );
  //     }
  //   }
  // }).Compiler;
  //
  useEffect(() => {
    const container = document.querySelector(".wmde-markdown");
    if (!container) return;

    let activeImg = null;
    let activeWrapper = null;
    let aspectRatio = 1;
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;
    let dragStartX = 0;
    let dragStartY = 0;

    const onPointerDown = (e) => {
      const handle = e.target.closest(".resize-handle");
      const wrapper = e.target.closest(".resizable-wrapper");

      if (handle) {
        // RESIZE MODE
        activeWrapper = wrapper;
        activeImg = wrapper.querySelector("img");

        const rect = activeImg.getBoundingClientRect();
        startWidth = rect.width;
        startHeight = rect.height;
        aspectRatio = rect.width / rect.height;

        startX = e.clientX;
        startY = e.clientY;

        e.target.setPointerCapture(e.pointerId);
        return;
      }

      if (wrapper && !handle) {
        // DRAG MODE
        activeWrapper = wrapper;
        activeWrapper.classList.add("dragging");

        const rect = wrapper.getBoundingClientRect();
        dragStartX = e.clientX - rect.left;
        dragStartY = e.clientY - rect.top;

        e.target.setPointerCapture(e.pointerId);
      }
    };

    const onPointerMove = (e) => {
      if (!activeWrapper) return;

      // DRAGGING
      if (!activeImg) {
        const newLeft = e.clientX - dragStartX;
        const newTop = e.clientY - dragStartY;

        activeWrapper.style.position = "relative";
        activeWrapper.style.left = newLeft + "px";
        activeWrapper.style.top = newTop + "px";

        return;
      }

      // RESIZING
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      let newWidth = startWidth + dx;
      let newHeight = newWidth / aspectRatio;

      activeImg.style.width = newWidth + "px";

      // Update markdown
      setContent((prev) =>
        prev.replace(
          new RegExp(`!\\[]\\(${activeImg.src}\\)(\\{.*?\\})?`),
          `![](${activeImg.src}){width=${Math.round(newWidth)}}`
        )
      );
    };

    const onPointerUp = (e) => {
      if (!activeWrapper) return;

      activeWrapper.classList.remove("dragging");

      activeWrapper = null;
      activeImg = null;
    };

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);

    return () => {
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
    };
  }, [content]);

  // Apply align
  const applyAlign = (align) => {
    setContent(prev =>
      prev.replace(/!\[\]\((.*?)\)(\{.*?\})?/g, (match, url, opts) => {
        const width = opts?.match(/width=(\d+)/)?.[1] || 300;
        return `![](${url}){width=${width} align=${align}}`;
      })
    );
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Card>
        <h1 className="text-3xl font-bold mb-6">Edit Post</h1>

        <button
          type="button"
          onClick={toggleEditorTheme}
          className="mb-4 px-4 py-2 bg-gray-200 rounded"
        >
          Switch to {editorTheme === "light" ? "Dark" : "Light"} Mode
        </button>

        <form className="space-y-6" onSubmit={handleUpdate}>

          {/* Title */}
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Content */}
          <div>
            <label className="block font-medium mb-1">Content</label>

            <div className="flex gap-3 mb-2">
              <BlogMediaUpload
                sessionId={sessionId}
                onUploaded={(url) => insertMedia(url)}
                postId={id}
              />
              <div className="flex flex-col justify-center align-middle gap-2">
                <button
                  type="button"
                  onClick={() => setShowLibrary(true)}
                  className="px-3 py-2 bg-gray-100 rounded"
                >
                  Browse Media
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const url = prompt("Enter video URL:");
                    if (!url) return;
                    setContent((prev) => prev + `\n<video src="${url}" controls width="600"></video>\n`);
                  }}
                  className="px-3 py-2 bg-gray-100 rounded"
                >
                  Insert Video
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="px-1 py-1 bg-gray-100 rounded" onClick={() => applyAlign("left")}>Left</button>
              <button className="px-1 py-1 bg-gray-100 rounded" onClick={() => applyAlign("center")}>Center</button>
              <button className="px-1 py-1 bg-gray-100 rounded" onClick={() => applyAlign("right")}>Right</button>
            </div>
              
            <div className={editorTheme === "light" ? "md-editor-light" : "md-editor-dark"}>
              <MDEditor
                value={content}
                onChange={setContent}
                height={450}
                previewOptions={{
                  rehypePlugins: [
                    [rehypeResizableImages, { mode: "edit" }] // Enable Resize
                  ]
                }}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block font-medium mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Image */}
          <div>
            <label className="block font-medium mb-1">Featured Image</label>

            {!preview ? (
              <div
                className="border-2 border-dashed rounded p-6 text-center"
                onClick={() => document.getElementById("featImgEdit").click()}
              >
                Click to upload/replace
                <input
                  type="file"
                  id="featImgEdit"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setFeaturedImage(file);
                    setPreview(URL.createObjectURL(file));
                  }}
                />
              </div>
            ) : (
              <div className="relative inline-block group">
                <img
                  src={`${API_BASE_URL}${preview}`}
                  className="max-w-xs rounded shadow mt-2"
                />

                <button
                  type="button"
                  onClick={() => {
                    setFeaturedImage(null);
                    setPreview(null);
                  }}
                  className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full w-7 h-7"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <button
            className="w-full bg-blue-600 text-white py-2 rounded"
            type="submit"
          >
            Save Changes
          </button>
        </form>

        {/* MEDIA LIBRARY MODAL */}
        {showLibrary && (
          <BlogMediaLibrary
            sessionId={sessionId}
            postId={id}
            onSelect={insertMedia}
            onClose={() => setShowLibrary(false)}
          />
        )}

      </Card>
    </div>
  );
}
