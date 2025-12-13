// client/src/components/blog/BlogMediaLibrary.jsx
import { useEffect, useState } from "react";
import { blogMediaService } from "../../services/blogMediaService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function BlogMediaLibrary({ sessionId, postId, onSelect, onClose }) {
  const [tab, setTab] = useState("session");
  const [sessionMedia, setSessionMedia] = useState([]);
  const [userMedia, setUserMedia] = useState([]);
  const [postMedia, setPostMedia] = useState([]);

  useEffect(() => {
    async function load() {
      if (sessionId) {
        const data = await blogMediaService.getSessionMedia(sessionId);
        setSessionMedia(data);
      }
      const um = await blogMediaService.getUserMedia();
      setUserMedia(um);

      if (postId) {
        const pm = await blogMediaService.getPostMedia(postId);
        setPostMedia(pm);
      }
    }
    load();
  }, [sessionId, postId]);

  const list = tab === "session"
    ? sessionMedia
    : tab === "post"
    ? postMedia
    : userMedia;

    return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white w-[700px] min-h-[40vh] max-h-[90vh] rounded-lg shadow-lg overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Media Library</h2>
          <button className="text-gray-500" onClick={onClose}>✕</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {postId && (
            <button className={`flex-1 py-2 ${tab==="post"?"bg-gray-200 ":""}`}
              onClick={() => setTab("post")}>This Post</button>
          )}

          <button className={`flex-1 py-2 ${tab==="session"?"bg-gray-200 ":""}`}
            onClick={() => setTab("session")}>Draft Session</button>

          <button className={`flex-1 py-2 ${tab==="user"?"bg-gray-200 ":""}`}
            onClick={() => setTab("user")}>My Media</button>
        </div>

        {/* Media Grid */}
        {list?.length === 0 ? (
            <p className="text-gray-600 mt-auto mb-auto text-center">Your library is empty.</p>
        ) : (
            <div className="p-4 overflow-y-auto grid grid-cols-3 gap-4">
            {list.map((m) => (
                <div key={m._id} className="relative group cursor-pointer"
                    onClick={() => {
                        if (m.mimetype.startsWith("video/")) {
                          onSelect(`<video src="${API_BASE_URL}${m.url}" controls width="600"></video>`);
                        }
                        onSelect(`${API_BASE_URL}${m.url}`)
                    }}
                >
                <img 
                    src={
                        m.url
                        ? `${API_BASE_URL}${m.url}`
                        : "blog media"
                    }
                    className="w-full h-32 object-cover rounded shadow" 
                />

                <button
                    onClick={(e) => {
                    e.stopPropagation();
                    blogMediaService.deleteMedia(m.filename).then(() => {
                        // reload after delete
                        setSessionMedia(prev => prev.filter(x => x._id !== m._id));
                        setUserMedia(prev => prev.filter(x => x._id !== m._id));
                        setPostMedia(prev => prev.filter(x => x._id !== m._id));
                    });
                    }}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 opacity-0 group-hover:opacity-100"
                >
                    ✕
                </button>
                </div>
            ))}
            </div>
        )}

      </div>
    </div>
  );
}
