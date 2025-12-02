# How to Create Benchmarks on jsben.ch

🇫🇷 [Français](README-Jsben.md)

This guide explains how to benchmark your `production.js` vs `forEach.js` implementations on [jsben.ch](https://jsben.ch/).

## Quick Start

1. **Run the generator script**:

   ```bash
   npm run jsben
   ```

   This generates benchmark files in `benchmark-results/Jsben/` with 4 benchmark types:
   - `search/` - Search term filtering
   - `ingredients/` - Ingredient-based filtering
   - `appliances/` - Appliance-based filtering
   - `utensils/` - Utensil-based filtering

2. **Open jsben.ch**: Go to <https://jsben.ch/> and click "Create New Test"

3. **Copy and paste** from your chosen benchmark folder:

   - `setup.js` → Paste into "Setup" box
   - `test-production.js` → Paste into first test box
   - `test-forEach.js` → Paste into second test box

4. **Run the test** and share the URL

## Generated Files

Each benchmark folder contains:

- `setup.js` - Setup code for jsben.ch
- `test-production.js` - Production implementation (.map()/.filter())
- `test-forEach.js` - forEach implementation
- `README.md` - Specific instructions

## Understanding Results

- **Higher score = Faster**: The implementation with the higher score is faster
- **Percentage difference**: Shows performance difference between implementations
- **Consistency**: Multiple runs help ensure consistent results

## Tips

- **Realistic data**: Generator uses 50 recipes from your actual data
- **Run multiple times**: jsben.ch automatically runs multiple iterations
- **Save URLs**: Bookmark benchmark URLs for future reference
- **Larger datasets**: For manual benchmarks, use 50-100+ recipes for accuracy

## 📁 Structure

```text
Jsben/
├── setup.js            # Main entry point - generates benchmark files
└── benchmarks/         # Code generators for each benchmark type
    ├── search.js       # Generator for search tests
    ├── ingredients.js  # Generator for ingredient filtering tests
    ├── appliances.js   # Generator for appliance filtering tests
    └── utensils.js     # Generator for utensil filtering tests
```

**Generated files** (in `benchmark-results/Jsben/`) :

```text
benchmark-results/Jsben/
├── search/             # Search benchmark
│   ├── setup.js
│   ├── test-production.js
│   ├── test-forEach.js
│   └── README.md
├── ingredients/        # Ingredient filtering benchmark
│   ├── setup.js
│   ├── test-production.js
│   ├── test-forEach.js
│   └── README.md
├── appliances/         # Appliance filtering benchmark
│   ├── setup.js
│   ├── test-production.js
│   ├── test-forEach.js
│   └── README.md
└── utensils/           # Utensil filtering benchmark
    ├── setup.js
    ├── test-production.js
    ├── test-forEach.js
    └── README.md
```

## 🔗 Path Aliases

The following path aliases are available to simplify imports:

```javascript
@jsben/*                → viteTest/Jsben/*
@viteTest-helper/*      → viteTest/helper/* (message, console, fileSystem, jsben, cleanup, paths)
```
