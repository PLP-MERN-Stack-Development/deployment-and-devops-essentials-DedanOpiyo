// utils/excerptMarkdown.js
export function extractExcerpt(markdown, maxChars = 180) {
  const plain = markdown.replace(/!\[.*?\]\(.*?\)/g, "") // remove images
                        .replace(/```[\s\S]*?```/g, "")  // remove code blocks
                        .replace(/#/g, "")               // remove headings
                        .trim();

  return plain.length > maxChars
    ? plain.substring(0, maxChars) + "…"
    : plain;
}

// PostItem uses to 'remove' images so MDEditor's post.content
// is 'read' appropriately