const path = require("path");
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    styles: {
      import: "./public/scss/app.scss",
      library: {
        type: "window",
      },
    },
    engine: {
      import: "./src/index.ts",
      library: {
        type: "window",
      },
    },
  },
  output: {
    path: path.resolve(__dirname, `dist`),
    filename: '[name].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
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
       {
        test: /\.scss$/,
        use: [
          // Extract and save the final CSS.
          MiniCssExtractPlugin.loader,
          // Load the CSS, set url = false to prevent following urls to fonts and images.
          { loader: "css-loader", options: { url: false, importLoaders: 1 } },
          // Add browser prefixes and minify CSS.
          { loader: 'postcss-loader', options: { postcssOptions: {plugins: [autoprefixer(), cssnano()]} }},
          // Load the SCSS/SASS
          { loader: 'sass-loader' },
        ],
      },
    ],
  },
  plugins: [
    // Define the filename pattern for CSS.
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    })
  ],
  resolve: {
    extensions: [".ts", "...", '.css', '.scss'],
    alias: {
      // Provides ability to include node_modules with ~
      '~': path.resolve(process.cwd(), 'src'),
    },
  },
};
