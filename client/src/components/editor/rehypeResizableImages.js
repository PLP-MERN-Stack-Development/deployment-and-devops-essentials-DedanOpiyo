// client/src/editor/rehypeResizableImages.js
import { visit } from "unist-util-visit";

export default function rehypeResizableImages(options = {}) {
  const isReadMode = options.mode === "read"; // respect a mode flag: so it doesn't run both in Editor preview & in Final article view ← should not show resize handles

  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (!parent || node.tagName !== "img") return;

      // strip attributes created by editor resize mode
      if (isReadMode) {
        delete node.properties["data-resizable"];
        delete node.properties["data-width"];
        delete node.properties["data-height"];
        delete node.properties["data-align"];
        return;
      }

      // editor preview mode: add handles
      node.properties["data-resizable"] = "true"

      const img = node;

      const widthAttr = img.properties["data-width"] || 300;
      const align = img.properties["data-align"] || "left";

      const wrapper = {
        type: "element",
        tagName: "div",
        properties: {
          className: ["resizable-wrapper"],
          style: `
            position:relative;
            display:inline-block;
            margin:auto;
            text-align:${align};
          `,
          "data-align": align
        },
        children: [
          {
            ...img,
            properties: {
              ...img.properties,
              style: `width:${widthAttr}px; display:block; margin:${align==="center"?"0 auto":align==="right"?"0 0 0 auto":"0"};`
            }
          },
          ...["nw","ne","sw","se"].map(dir => ({
            type: "element",
            tagName: "span",
            properties: {
              className: ["resize-handle", `handle-${dir}`]
            },
            children: []
          }))
        ]
      };

      parent.children[index] = wrapper;
    });
  };
}

// // helper (has already been defined!)
// function visit(tree, type, callback) {
//   if (!tree || !tree.children) return;
//   for (const child of tree.children) {
//     if (child.type === type) callback(child);
//     visit(child, type, callback);
//   }
// }
