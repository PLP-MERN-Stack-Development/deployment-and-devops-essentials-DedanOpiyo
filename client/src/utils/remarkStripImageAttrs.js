// client/src/utils/remarkStripImageAttrs.js
export default function remarkStripImageAttrs() {
  return (tree) => {
    visit(tree, "image", (node) => {
      if (node.title) node.title = null;

      // Remove {width=XXX align=center}
      if (node.url.includes("{")) {
        node.url = node.url.replace(/\{.*\}/, "").trim();
      }
    });
  };
}

function visit(tree, type, callback) {
  if (!tree || !tree.children) return;
  for (const child of tree.children) {
    if (child.type === type) callback(child);
    visit(child, type, callback);
  }
}

// Removes remove attributes before rendering
// Remark plugin resolves:

// {width=300 align=center} appearing in the final post

// This means your parser is not stripping attribute syntax because only your editor plugin understands it — your viewer does not.

// update MarkdownRenderer.jsx:

// import remarkStripImageAttrs from "../utils/remarkStripImageAttrs";

// export default function MarkdownRenderer({ content }) {
//   return (
//     <MarkdownPreview
//       source={content}
//       style={{ background: "transparent" }}
//       remarkPlugins={[remarkStripImageAttrs]}
//       rehypePlugins={[rehypeResizableImages]}
//     />
//   );
// }