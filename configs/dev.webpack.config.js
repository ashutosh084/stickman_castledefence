const baseConfig = require("./base.webpack.config.js");
const { merge } = require("webpack-merge");
const path = require("path");

module.exports = merge(baseConfig, {
  devServer: {
    host: "localhost",
    port: 8080,
    hot: true,
    open: true,
    static: {
      directory: path.join(__dirname, "../dist"),
    },
    client: {
      overlay: true,
    },
  },
});
