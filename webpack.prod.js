const CopyPlugin = require("copy-webpack-plugin");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const path = require("path");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: './public/packages', to: 'packages' },
        { from: './public/fonts', to: 'fonts' },
        { from: './public/index.html' },
      ]
    })
  ]
});
