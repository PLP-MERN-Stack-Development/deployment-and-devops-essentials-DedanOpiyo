// client/src/components/MarkdownRenderer.jsx
import MarkdownPreview from "@uiw/react-markdown-preview";
import rehypeResizableImages from "./editor/rehypeResizableImages"; // your plugin
import remarkStripImageAttrs from "../utils/remarkStripImageAttrs";
import "../styles/proseOverride.css";

export default function MarkdownRenderer({ content }) {
  return (
    <MarkdownPreview
      source={content}
      style={{ background: "transparent" }}
      remarkPlugins={[remarkStripImageAttrs]}
      rehypePlugins={[
        [rehypeResizableImages, { mode: "read" }] // pass mode: "read": to Disable Resize Handles
      ]}
      components={{}}
    />
  );
}

// Shared MarkdownRenderer Component

// Make a dedicated renderer so SinglePost and PostItem can reuse it.

// Reads MDEditor content
