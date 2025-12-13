// src/pages/help/ReportIssue.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import helpService from "../../services/helpService";
import ScreenshotUploader from "../../components/help/ScreenshotUploader";
import HelpPartSelector from "../../components/help/HelpPartSelector";
import useHelp from "../../hooks/useHelp";

export default function ReportIssue() {
  const navigate = useNavigate();
  const loc = useLocation();
  const { returnInfo, clearReturnPoint } = useHelp();

  const [part, setPart] = useState(loc.state?.partId || "");
  const [customDescription, setCustomDescription] = useState("");
  const [message, setMessage] = useState("");
  const [screenshots, setScreenshots] = useState([]);

  // NEW: Apply pre-filled part from known issue
  useEffect(() => {
    if (returnInfo?.data?.message) setMessage(returnInfo.data.message);
    if (returnInfo?.data?.partSlug) {
      helpService.getPartBySlug(returnInfo.data.partSlug)
        .then(part => setPart(part._id))
        .catch(() => {}); // silently ignore if slug no longer exists
    }
  }, [returnInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("part", part !== "other" ? part : "");
    fd.append("customDescription", part === "other" ? customDescription : "");
    fd.append("message", message);

    const contextPath = returnInfo?.path || loc.pathname;
    const contextData = returnInfo?.data || {};

    fd.append("contextPath", contextPath);
    fd.append("contextData", JSON.stringify(contextData));

    screenshots.forEach((file) => fd.append("screenshots", file));

    await helpService.createIssue(fd);

    // clear for future issues
    clearReturnPoint();

    // navigate back OR home
    navigate(returnInfo?.path || "/");
  };

  return (
    <div className="min-h-[68.8vh]">
      <h1 className="text-2xl font-bold mb-4">Report an Issue</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <HelpPartSelector value={part} onChange={setPart} />

        {part === "other" && (
          <input
            type="text"
            placeholder="Describe the issue category"
            value={customDescription}
            onChange={(e) => setCustomDescription(e.target.value)}
            className="border p-2 w-full rounded"
          />
        )}

        <textarea
          placeholder="Describe your issue in detail"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 rounded w-full h-32"
        />

        <ScreenshotUploader onChange={setScreenshots} />

        <button className="bg-green-600 text-white px-4 py-2 rounded mt-4">
          Submit Issue
        </button>
      </form>
    </div>
  );
}
