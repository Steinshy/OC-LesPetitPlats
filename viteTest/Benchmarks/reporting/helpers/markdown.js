// Markdown rendering utilities for HTML reports
import MarkdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import { bare as markdownItEmoji } from "markdown-it-emoji";
import markdownItFootnote from "markdown-it-footnote";
import markdownItSub from "markdown-it-sub";
import markdownItSup from "markdown-it-sup";
import markdownItToc from "markdown-it-table-of-contents";
import markdownItTaskLists from "markdown-it-task-lists";
import { marked } from "marked";

// Initialize markdown-it instance for additional markdown rendering with plugins
const md = new MarkdownIt({
  html: true, // Enable HTML tags in source
  breaks: false, // Convert '\n' in paragraphs into <br>
  linkify: true, // Autoconvert URL-like text to links
  typographer: true, // Enable some language-neutral replacement + quotes beautification
})
  .use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.headerLink(),
    level: [2, 3, 4],
  })
  .use(markdownItToc, {
    includeLevel: [2, 3, 4],
    containerClass: "table-of-contents",
    containerHeaderHtml: "<h3>Table of Contents</h3>",
  })
  .use(markdownItTaskLists, {
    enabled: true,
    label: true,
    labelAfter: true,
  })
  .use(markdownItEmoji)
  .use(markdownItFootnote)
  .use(markdownItSub)
  .use(markdownItSup);

// Helper function to render markdown using markdown-it
export function renderMarkdown(markdownText) {
  return md.render(markdownText);
}

// Helper function to render markdown using marked (for methodology section)
export function renderMarked(markdownContent) {
  return marked(markdownContent, {
    gfm: true, // GitHub Flavored Markdown
    breaks: false,
    headerIds: true,
    mangle: false,
  });
}

