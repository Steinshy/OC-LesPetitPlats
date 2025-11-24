const getResultsCounterElements = () => {
  const counter = document.getElementById("results-counter");
  const container = counter?.parentElement;
  return {
    container,
    counter,
  };
};

export const setupResultsCounter = count => {
  const { container, counter } = getResultsCounterElements();
  if (!container || !counter) return null;
  counter.textContent = `${count} ${count === 1 ? "résultat" : "résultats"}`;
  return container;
};
