const path = require("path");

module.exports = {
  entry: {
    engine: {
      import: "./src/index.ts",
      library: {
        type: "window",
      },
    },
  },
  output: {
    path: path.resolve(__dirname, `dist`),
    filename: `app.js`,
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/env",
                {
                  useBuiltIns: "usage",
                  corejs: "3.17",
                },
              ],
              [
                "@babel/typescript",
                {
                  allowDeclareFields: true,
                },
              ],
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", "..."],
  },
};
