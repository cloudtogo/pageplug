module.exports = {
  plugins: [
    'tailwindcss',
    'autoprefixer',
    ['postcss-pageplug-pxtorem', {
      h5Width: 450,
    }],
  ]
};
