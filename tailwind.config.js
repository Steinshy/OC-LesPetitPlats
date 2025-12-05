export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}", "./public/**/*.html"],
  safelist: [
    {
      pattern: /^(hidden|block|flex|grid|sr-only)$/,
    },
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
