module.exports = {
  plugins: [
    "postcss-nested",
    "tailwindcss",
    "autoprefixer",
    [
      "postcss-pageplug-pxtorem",
      {
        h5Width: 450,
      },
    ],
  ],
};
