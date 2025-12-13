// client/src/pages/SinglePost.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import postService from "../services/postService";
import useAuth from "../hooks/useAuth";
import MarkdownRenderer from "../components/MarkdownRenderer";

function SinglePost() {
  const { user } = useAuth();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [loadingComment, setLoadingComment] = useState(false);

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!user) {
        return alert("You must be logged in to comment.");
    }

    try {
        setLoadingComment(true);
        const updatedPost = await postService.addComment(id, comment);
        // console.log("UPDATED POST: ", updatedPost)
        setPost(updatedPost.post);
        setComment(""); // clear input
    } catch (err) {
        console.error(err);
        alert("Failed to add comment.");
    } finally {
        setLoadingComment(false);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await postService.getPost(id);
        setPost(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPost();
  }, [id]);

  if (!post) return <p className="min-h-[68.8vh]">Loading...</p>;

  return (
    <div className="container">
      <h1 className="text-2xl font-semibold mb-4">{post.title}</h1>
      
      <div className="prose prose-styled max-w-none">
        <MarkdownRenderer content={post.content} />
      </div>

      <hr className="my-6" />

      <h3 className="text-xl font-semibold mb-4">Comments</h3>

      <div className="space-y-4 mb-6">
        {post.comments.length === 0 && (
            <p className="text-gray-500">No comments yet.</p>
        )}

        {post.comments.map((c) => (
            <div key={c?._id || 1} className="bg-gray-100 rounded p-3">
            <p className="text-gray-700">{c.content}</p>
            <span className="text-xs text-gray-500">
                {new Date(c.createdAt).toLocaleString()}
            </span>
            </div>
        ))}
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleAddComment} className="space-y-3">
        <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full border border-gray-300 px-3 py-2 rounded h-24 focus:ring focus:ring-blue-300"
            required
        />

        <button
            type="submit"
            disabled={loadingComment}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
            {loadingComment ? "Posting..." : "Post Comment"}
        </button>
      </form>
    </div>
  );
}

export default SinglePost;
