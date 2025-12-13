// src/services/blogMediaService.js
import api from "./apiClient";

export const blogMediaService = {
  uploadMedia: async (file, sessionId, postId = null) => {
    console.log("Uploading...: ", file, sessionId)
    const fd = new FormData();
    fd.append("file", file);
    fd.append("sessionId", sessionId);
    if (postId) fd.append("postId", postId);

    const res = await api.post("/blog/media/upload", fd, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    return res.data;
  },

  getUserMedia: async () => {
    const res = await api.get("/blog/media/user");
    return res.data;
  },

  getSessionMedia: async (sessionId) => {
    const res = await api.get(`/blog/media/session/${sessionId}`);
    return res.data;
  },

  getPostMedia: async (postId) => {
    const res = await api.get(`/blog/media/post/${postId}`);
    return res.data;
  },

  deleteMedia: async (filename) => {
    const res = await api.delete(`/blog/media/${filename}`);
    return res.data;
  },

  replaceMedia: async (filename, file) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await api.put(`/blog/media/${filename}`, fd);
    return res.data;
  }
};
