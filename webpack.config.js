const path = require("path");
const copy = require("copy-webpack-plugin");
const isDevelopment = process.argv[process.argv.indexOf("--mode") + 1] === "development";

module.exports = {
  target: ["web", "es5"],
  entry: "./src/app.tsx",
  output: {
    filename: "[name].bundle.js",
    path: __dirname + "/public/assets/",
    publicPath: isDevelopment ? "/assets/" : undefined,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  plugins: [
    new copy({
      patterns: [{ from: "node_modules/@tripetto/builder/fonts/", to: "." }],
    }),
  ],
  performance: {
    hints: false,
  },
  devServer: {
    static: path.resolve(__dirname, "public"),
    port: 9000,
    host: "0.0.0.0",
  },
};
