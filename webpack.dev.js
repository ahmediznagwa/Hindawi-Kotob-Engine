const { merge } = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
  entry: {
      engine: {
        import: "./src/index.ts",
        library: {
          type: "window",
        },
      },
    },
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
      static: {
          directory: "public",
      },
      open: [`index.html`],
      port: 'auto',
  },
})