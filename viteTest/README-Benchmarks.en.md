# Performance Benchmarks

🇫🇷 [Français](README-Benchmarks.md)

Performance benchmarking system to measure and compare the performance of search and filtering algorithms used in the LesPetitPlats application.

## 🎯 About

This system uses **Vitest** and **tinybench** to generate detailed HTML reports with statistics, charts, and recommendations. Benchmarks allow comparing different algorithm implementations to optimize application performance.

## ✨ Features

- ⚡ **Performance measurement**: Comparison of performance between different algorithm implementations
- 📊 **Detailed HTML reports**: Automatic generation of reports with statistics, charts, and visualizations
- 🎯 **Targeted tests**: Ability to run all tests or select specific tests
- 📈 **Advanced metrics**: Average, min, max time, RME (Relative Measurement Error), win rate
- 💡 **Recommendations**: Insights and optimization suggestions based on results
- 🔍 **Performance tests**: Search by term, filtering by ingredients, appliances, and utensils
- 🔄 **Implementation comparison**: Production (.map()/.filter()) vs forEach loops
- 💻 **System information**: Automatic collection and display of system information (CPU, memory, OS) in reports

## 💻 Usage

```bash
# Install dependencies (if needed)
npm install

# Run benchmarks
npm run benchmark
```

**Options:**

- **"yes"** → All tests (full report)
  - Includes "All" tests that benchmark all available values
  - May take 5-10 minutes

- **"no"** → Selected tests (partial report)

**Comparisons:**

- Production (`.map()/.filter()`)
- forEach (forEach loops)

**Reports:**

- Generated in `benchmark-results/Benchmark/` with timestamp and `-full` or `-partial` suffix.
- Contains: Executive summary, Statistics, Charts, Recommendations, Methodology
- Includes detailed system information (OS, CPU, architecture, memory) automatically collected

**Metrics:**

- Average time (ms)
- RME (%) - Relative Measurement Error
- Wins/Win % - number and percentage of wins

## 🛠️ Technologies

- **[Vitest](https://vitest.dev/)** - Test framework
- **[tinybench](https://github.com/tinylibs/tinybench)** - Benchmarking library
- **[chart.js](https://www.chartjs.org/)** + `chartjs-node-canvas` - Chart generation
- **[systeminformation](https://www.npmjs.com/package/systeminformation)** - Detailed system information collection
- **[chalk](https://github.com/chalk/chalk)**, **[ora](https://github.com/sindresorhus/ora)**, **[cli-progress](https://github.com/npkgz/cli-progress)** - Terminal utilities

## 📁 Structure

```text
Benchmarks/
├── config/              # Configuration and helpers
│   ├── constants.js
│   └── testHelpers.js
├── data/                # Data collection and management
│   ├── collector.js
│   ├── data.json
│   ├── loader.js
│   └── results.js
├── implementations/     # Implementations to compare
│   ├── production.js    # .map()/.filter()
│   └── forEach.js       # forEach loops
├── reporting/           # HTML report generation
│   ├── cli/            # CLI interface (prompts.js)
│   ├── core/           # Core logic (charts.js, finalizer.js, orchestrator.js, runner.js)
│   ├── helpers/        # Formatting (formatting.js, loadCss.js, markdown.js)
│   ├── sections/       # Report sections (implementation.js, insights.js, keyFindings.js, methodology.js, stats.js, testResults.js)
│   ├── styles/         # CSS styles (cards.css, layout.css, main.css, markdown.css, responsive.css, tables.css, variables.css)
│   ├── generateHtml.js
│   └── index.js
├── tests/              # Benchmark tests
│   └── utils/filterEngine/  # Performance tests
│       ├── search.test.js
│       ├── ingredients.test.js
│       ├── appliances.test.js
│       └── utensils.test.js
├── utils/              # Utilities (formatting, measurement)
│   ├── formatting.js
│   └── measurement.js
└── setup.js            # Global benchmark configuration
```

## 🔗 Path Aliases

The following path aliases are available to simplify imports:

```javascript
@benchmarks/*              → viteTest/Benchmarks/*
@benchmarks-config/*       → viteTest/Benchmarks/config/*
@benchmarks-data/*         → viteTest/Benchmarks/data/*
@benchmarks-tests/*        → viteTest/Benchmarks/tests/*
@benchmarks-utils/*        → viteTest/Benchmarks/utils/*
@benchmarks-reporting/*    → viteTest/Benchmarks/reporting/*
@viteTest-helper/*         → viteTest/helper/* (message, console, fileSystem, etc.)
```

## 📄 License

This project is part of the LesPetitPlats project and follows the same license as the main project.
