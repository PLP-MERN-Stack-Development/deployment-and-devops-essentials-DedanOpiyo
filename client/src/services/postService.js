// src/services/postService.js
import api from "./apiClient";

export default {
  getAllPosts: async (page = 1, limit = 10, category = null) => {
    let url = `/posts?page=${page}&limit=${limit}`;
    if (category) {
      url += `&category=${category}`;
    }
    const response = await api.get(url);
    return response.data;
  },

  getPost: async (idOrSlug) => {
    const res = await api.get(`/posts/${idOrSlug}`); 
    return res.data;
  },

  createPost: async (data) => {
    const res = await api.post("/posts", data); 
    return res.data;
  },

  updatePost: async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  addComment: async (id, content) => {
    const res = await api.post(`/posts/${id}/comment`, { content }); // blogCommentService.js
    return res.data;
  },

  searchPosts: async (query, category = null) => {
    let url = `/posts/search?q=${query}`;
    if (category) url += `&category=${category}`;
    
    const response = await api.get(url);
    return response.data;
  },
};

// (blog) - blogService.js