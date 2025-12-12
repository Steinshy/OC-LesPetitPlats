// src/components/resultsCounter.js

const resultsCounterElement = () => ({
  counter: document.getElementById("results-counter"),
  container: document.querySelector(".results-counter-container"),
});

export const updateResultsCounter = count => {
  const { counter } = resultsCounterElement();
  if (!counter) return;

  counter.textContent =
    count === 0 ? "Aucun résultat" : `${count} ${count === 1 ? "résultat" : "résultats"}`;
};
