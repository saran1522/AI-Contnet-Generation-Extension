const Dotenv = require("dotenv-webpack");
module.exports = {
  entry: {
    content: "./content.js",
  },
  output: {
    filename: "[name].js",
    path: __dirname + "/dist",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
  plugins: [new Dotenv()],
};
