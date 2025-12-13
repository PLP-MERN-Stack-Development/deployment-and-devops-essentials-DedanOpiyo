// src/pages/admin/AdminHelpIssues.jsx
import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import helpService from "../../services/helpService";
import { KNOWN_ISSUE_CODES } from "../../constants/knownIssues";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminHelpIssues() {
  const [issues, setIssues] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPart, setFilterPart] = useState("all");
  const [filterCode, setFilterCode] = useState("all");
  const [search, setSearch] = useState("");   // NEW

  const load = async () => {
    const data = await helpService.getIssues();
    setIssues(data);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    await helpService.updateStatus(id, status);
    load();
  };

  // Build unique parts list
  const parts = [...new Set(issues.map(i => i.part?.name).filter(Boolean))];

  // NEW — universal search helper
  const matchesSearch = (issue) => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();

    return (
      issue.message?.toLowerCase().includes(s) ||
      issue.customDescription?.toLowerCase().includes(s) ||
      issue.contextPath?.toLowerCase().includes(s) ||
      issue.part?.name?.toLowerCase().includes(s) ||
      issue.contextData?.code?.toLowerCase().includes(s) ||
      issue.user?.username?.toLowerCase().includes(s) ||
      issue.user?.email?.toLowerCase().includes(s) ||
      JSON.stringify(issue.contextData)
        .toLowerCase()
        .includes(s)
    );
  };

  // Filter logic
  const filtered = issues.filter(i => {
    return (
      (filterStatus === "all" || i.status === filterStatus) &&
      (filterPart === "all" || i.part?.name === filterPart) &&
      (filterCode === "all" || i.contextData?.code === filterCode) &&
      matchesSearch(i) // apply search filtering
    );
  });

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">User Help Issues</h1>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        
        {/* SEARCH BAR */}
        <input
          type="text"
          placeholder="Search issues (user, message, code, part...)"
          className="border p-2 rounded w-72"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>

        <select
          className="border p-2 rounded"
          value={filterPart}
          onChange={(e) => setFilterPart(e.target.value)}
        >
          <option value="all">All Parts</option>
          {parts.map((p) => <option key={p}>{p}</option>)}
        </select>

        <select
          className="border p-2 rounded"
          value={filterCode}
          onChange={(e) => setFilterCode(e.target.value)}
        >
          <option value="all">All Known Codes</option>
          {Object.keys(KNOWN_ISSUE_CODES).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* ISSUE LIST */}
      {issues?.length === 0 ? (
        <p className="text-gray-500">No Issues yet.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map(issue => (
            <div key={issue._id} 
              className="bg-white p-4 shadow border rounded space-y-2"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold text-lg">Issue #{issue._id.slice(-6)}</h3>
                  <p className="text-sm text-gray-500">
                    {issue.user ? `${issue.user.username} (${issue.user.email})` : "Anonymous User"}
                  </p>
                </div>

                {/* STATUS BUTTONS */}
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(issue._id, "open")}
                    className={`px-3 py-1 rounded ${issue.status === "open" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                  >
                    Open
                  </button>
                  <button
                    onClick={() => updateStatus(issue._id, "in_progress")}
                    className={`px-3 py-1 rounded ${issue.status === "in_progress" ? "bg-yellow-500 text-white" : "bg-gray-200"}`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => updateStatus(issue._id, "resolved")}
                    className={`px-3 py-1 rounded ${issue.status === "resolved" ? "bg-green-600 text-white" : "bg-gray-200"}`}
                  >
                    Resolved
                  </button>
                </div>
              </div>

              {/* HELP PART */}
              <p className="mt-2 text-sm">
                <strong>Help Part:</strong>{" "}
                {issue.part ? issue.part.name : "Other / User Provided"}
              </p>

              {/* MAIN MESSAGE */}
              <p className="mt-3 border-l-4 border-blue-600 pl-3 text-gray-700">
                {issue.message}
              </p>

              {/* CUSTOM DESCRIPTION */}
              {issue.customDescription && (
                <p className="mt-2 text-sm text-gray-600">
                  <strong>User Category:</strong> {issue.customDescription}
                </p>
              )}

              {/* KNOWN ISSUE BADGE */}
              {issue.contextData?.code && (
                <div className="mt-3 inline-block bg-purple-600 text-white px-3 py-1 rounded text-xs">
                  Known Issue: {issue.contextData.code}
                </div>
              )}

              {/* CONTEXT PATH */}
              {issue.contextPath && (
                <p className="mt-2 text-xs text-gray-500">
                  <strong>Context Path:</strong> {issue.contextPath}
                </p>
              )}

              {/* CONTEXT DATA PRETTY JSON */}
              {issue.contextData && Object.keys(issue.contextData).length > 0 && (
                <details className="mt-3 bg-gray-50 p-3 rounded border">
                  <summary className="cursor-pointer font-semibold">Context Data</summary>
                  <pre className="text-xs mt-2 whitespace-pre-wrap">
                    {JSON.stringify(issue.contextData, null, 2)}
                  </pre>
                </details>
              )}

              {/* SCREENSHOTS */}
              {issue.screenshots?.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold mb-2">Screenshots</p>
                  <div className="flex gap-3">
                    {issue.screenshots.map((img, idx) => (
                      <img
                        key={idx}
                        src={`${API_BASE_URL}/uploads/help/${img}`}
                        alt="screenshot"
                        className="w-32 h-32 object-cover border rounded shadow"
                      />
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-600">Path: {issue.contextPath}</p>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

// Search Behaviour

// The search bar matches anything, anywhere:...

// Example searches:

// "hospital" → matches hospital errors & messages

// "john" → user email or username

// "ADMIN_ONLY" → known issue code

// "map" → contextData fields
