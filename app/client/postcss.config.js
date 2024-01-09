/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    require("postcss-import"),
    require("tailwindcss/nesting"),
    require("tailwindcss"),
    require("autoprefixer"),
    require("postcss-pageplug-pxtorem")({
      h5Width: 450,
    }),
  ],
};

module.exports = config;
