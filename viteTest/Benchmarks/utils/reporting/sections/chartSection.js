// Chart section generator
export function generateChartSection(charts, chartKey, chartName, pageBreakBefore = false) {
  if (!charts[chartKey]) {
    return "";
  }

  const pageBreakClass = pageBreakBefore ? " page-break-before" : "";

  return `
    <div class="chart-section${pageBreakClass}">
      <div class="chart">
        <img src="data:image/png;base64,${charts[chartKey].toString("base64")}" alt="${chartName}" />
      </div>
    </div>
  `;
}

