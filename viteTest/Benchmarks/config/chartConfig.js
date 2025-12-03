export const chartCanvasConfig = {
  width: 1200,
  height: 400,
};

export const chartOptions = {
  suppressMtimeWarnings: true,

  width: process.env.CHART_WIDTH ? parseInt(process.env.CHART_WIDTH, 10) : chartCanvasConfig.width,
  height: process.env.CHART_HEIGHT
    ? parseInt(process.env.CHART_HEIGHT, 10)
    : chartCanvasConfig.height,
};

export function getChartCanvasConfig() {
  return {
    width: chartOptions.width,
    height: chartOptions.height,
  };
}
