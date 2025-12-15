// src/components/resultsCounter.js

export const updateResultsCounter = count => {
  const counter = document.getElementById("counter");
  if (!counter) return;

  counter.textContent =
    count === 0 ? "Aucun résultat" : `${count} ${count === 1 ? "résultat" : "résultats"}`;
};
