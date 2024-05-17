/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require("webpack-merge");

const common = require("./craco.common.config.js");

module.exports = merge(common, {
  devServer: {
    client: {
      overlay: {
        warnings: false,
        errors: false,
      },
    },
    hot: true,
    proxy: {
      "/api": "http://localhost:8080"
    }
  },
  optimization: {
    minimize: false,
  },
  cache: {
    type: "filesystem",
    memoryCacheUnaffected: true,
  },
  experiments: {
    cacheUnaffected: true,
  },
});
