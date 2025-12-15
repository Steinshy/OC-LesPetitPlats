import MarkdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import { bare as markdownItEmoji } from "markdown-it-emoji";
import markdownItFootnote from "markdown-it-footnote";
import markdownItSub from "markdown-it-sub";
import markdownItSup from "markdown-it-sup";
import markdownItToc from "markdown-it-table-of-contents";
import markdownItTaskLists from "markdown-it-task-lists";
import { marked } from "marked";

const md = new MarkdownIt({
  html: true,
  breaks: false,
  linkify: true,
  typographer: true,
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
  .use(markdownItTaskLists, { enabled: true, label: true, labelAfter: true })
  .use(markdownItEmoji)
  .use(markdownItFootnote)
  .use(markdownItSub)
  .use(markdownItSup);

export function renderMarkdown(markdownText) {
  return md.render(markdownText);
}

export function renderMarked(markdownContent) {
  return marked(markdownContent, {
    gfm: true,
    breaks: false,
    headerIds: true,
    mangle: false,
  });
}

