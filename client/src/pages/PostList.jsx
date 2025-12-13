// client/src/pages/PostList.jsx
import { useEffect, useState } from "react";
import postService from "../services/postService";
import { Link } from "react-router-dom";
import PostItem from "../components/PostItem";
import SearchBar from "../components/SearchBar";
import CategorySidebar from "../components/CategorySidebar";
import useAuth from "../hooks/useAuth";

function PostList() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = async (pageNum = page, category = selectedCategory, query = searchQuery) => {
    setLoading(true);
    
    try {
      // Case 1: If there is a search query → call search API
      if (query && query.trim().length > 0) {
        const results = await postService.searchPosts(query, category);
        
        setPosts(results.posts || results); 
        setTotalPages(1);
        setTotalPosts(results.total || results.length);
      
      // Case 2: Normal post fetch (with optional category)
      } else {
        const data = await postService.getAllPosts(pageNum, 5, category);
        
        setPosts(data.posts);
        setTotalPosts(data.totalPosts);
        setTotalPages(data.totalPages);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    fetchPosts(page, selectedCategory, searchQuery);
  }, [page, selectedCategory, searchQuery]);

  if (loading) return <p className="text-center min-h-[68.8vh] mt-10">Loading posts...</p>;

  return (
    <div className="container mx-auto px-4 mt-10 grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[68.8vh]">

      {/* Sidebar */}
      <div>
        <CategorySidebar
            selectedCategory={selectedCategory}
            onCategorySelect={(categoryId) => {
              setSelectedCategory(categoryId);
              setPage(1); // reset pagination
            }}
        />
      </div>

      {/* Content */}
      <div className="md:col-span-3">
        <SearchBar 
          onSearch={(query) => {
            setSearchQuery(query);
            setPage(1);
          }}
        />

        {totalPosts === 0 ? 
          <div className="min-h-[52.8vh] p-5 bg-gray-50">
            <p className="text-gray-500 mb-5">No Blogs added yet.</p>
            {user?.role !== "patient" && 
              <Link to="/posts/create" className="btn btn-primary mb-5 text-white bg-blue-500 p-2 rounded">
                Create New Blog
              </Link>
            }
          </div>
          : 
          posts.map((post) => (
            <PostItem key={post._id} post={post} />
          ))
        }

        <div className="flex justify-center items-center space-x-4 mt-6">
            <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className={`px-4 py-2 rounded ${
                page === 1 ? "bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
                Previous
            </button>

            <span className="font-medium">
                Page {page} of {totalPages}
            </span>

            <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className={`px-4 py-2 rounded ${
                page === totalPages
                    ? "bg-gray-300"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
                Next
            </button>
        </div>
      </div>
    </div>
  );
}

export default PostList;
