// src/components/filters/elements.js

export const filtersElements = () => ({
  section: document.getElementById("filters"),
  container: document.getElementById("tags-container"),
  count: document.getElementById("tags-count-text"),
  clearBtn: document.getElementById("clear-tags-button"),
  tagsList: document.getElementById("tags-list"),
  allTags: document.getElementById("tags-list")?.querySelectorAll("li"),
});
