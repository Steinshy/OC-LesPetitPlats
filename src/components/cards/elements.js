// src/components/cards/elements.js
export const cardsElements = () => ({
  section: document.getElementById("cards"),
  container: document.getElementById("cards-container"),
});

export const cardElements = id => ({
  card: document.getElementById(`card-${id}`),
  pictures: document.getElementById(`picture-${id}`),
  tagTime: document.getElementById(`tag-time-${id}`),
  timeText: document.getElementById(`time-text-${id}`),
});
