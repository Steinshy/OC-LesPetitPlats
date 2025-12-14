// src/components/resultsCounter.js

export const resultsCounter = {
  container: document.getElementById("counter-wrapper"),
  counter: document.getElementById("counter"),

  update(count) {
    if (!this.container || !this.counter) return;

    this.counter.textContent =
      count === 0 ? "Aucun résultat" : `${count} ${count === 1 ? "résultat" : "résultats"}`;
  },
};
