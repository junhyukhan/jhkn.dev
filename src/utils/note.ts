export function getNoteTitle(note: { data: { title?: string }, id: string }): string {
    if (note.data.title) {
        return note.data.title;
    }
    // Fallback to filename from ID
    // ID format: "folder/filename.md" or "filename.md"
    const segments = note.id.split("/");
    const filename = segments[segments.length - 1];
    return filename.replace(/\.(md|mdx)$/, "");
}

/**
 * A plain-text summary of a note body for feeds and meta descriptions: Markdown, wiki links
 * and code removed, cut at a word boundary near `max` characters.
 */
export function getNoteSummary(body: string, max = 200): string {
    const text = body
        .replace(/```[\s\S]*?```/g, " ")          // fenced code
        .replace(/`([^`]*)`/g, "$1")              // inline code
        .replace(/!\[\[[^\]]*\]\]/g, " ")         // embeds
        .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")    // images
        .replace(/\[\[([^\]|]*)\|([^\]]*)\]\]/g, "$2")
        .replace(/\[\[([^\]]*)\]\]/g, "$1")
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")  // Markdown links
        .replace(/<[^>]+>/g, " ")                 // HTML
        .replace(/\[[ xX]\][ \t]+/g, "")         // task checkboxes
        .replace(/^[ \t]{0,3}(?:(?:#{1,6}|>|[-*+]|\d+\.)[ \t]+)+/gm, "") // headings, quotes, list markers
        .replace(/[*_~]{1,3}([^*_~]+)[*_~]{1,3}/g, "$1")   // emphasis
        .replace(/(^|\s)#[\p{L}\p{N}_/-]+/gu, "$1")       // Obsidian inline tags
        .replace(/\s+/g, " ")
        .trim();
    if (text.length <= max) return text;
    const cut = text.slice(0, max);
    return cut.slice(0, cut.lastIndexOf(" ") > 0 ? cut.lastIndexOf(" ") : max).replace(/[,.;:\s]+$/, "") + "…";
}
