const baseConfig = require("./base.webpack.config.js");
const { merge } = require("webpack-merge");

module.exports = merge(baseConfig, {
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: "all",
    },
  },
});
