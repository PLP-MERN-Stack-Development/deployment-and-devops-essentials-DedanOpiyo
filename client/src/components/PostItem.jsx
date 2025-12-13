// client/src/components/PostItem.jsx
import { Link } from "react-router-dom";
import postService from "../services/postService";
import MarkdownRenderer from "./MarkdownRenderer";
import { extractExcerpt } from "../utils/excerptMarkdown";

export default function PostItem({ post }) {
  const excerpt = post.excerpt || extractExcerpt(post.content);

  const handleDelete = async (postId) => {
    if (!postId) return;

    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (!confirmed) return; 

    try {
      await postService.deletePost(postId);
      alert("Post deleted successfully");

      // OPTIONAL: Refresh page or remove deleted item from UI
      window.location.reload(); 
    } catch (err) {
      console.error(err);
      alert("Failed to delete post.");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-5 border border-gray-200 hover:shadow-lg transition mb-4 min-h-[52.8vh]">
      <h2 className="text-xl font-semibold mb-2 flex justify-between items-center">
        <Link to={`/posts/${post._id}`} className="hover:underline">
          {post.title}
        </Link>

        <div className="flex gap-2">
          <Link to={`/posts/${post._id}/edit`} className="bg-blue-600 text-white p-1 pl-2 pr-2 hover:underline text-sm border-gray-200 rounded-lg">
            Edit
          </Link>

          <button onClick={() => handleDelete(post._id)} className="bg-red-600 text-white p-1 pl-2 pr-2 hover:underline text-sm w-fit border-gray-200 rounded-lg">
            Delete
          </button>
        </div>
      </h2>

      <div className="prose max-w-none text-gray-700 mb-3">
        <MarkdownRenderer content={excerpt} />
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {post.category?.name || "Uncategorized"}
        </span>

        <Link
          className="text-blue-600 hover:underline text-sm"
          to={`/posts/${post._id}`}
        >
          Read more →
        </Link>
      </div>
    </div>
  );
}
