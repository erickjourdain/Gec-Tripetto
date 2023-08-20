const path = require("path");
const copy = require("copy-webpack-plugin");
//const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");

// const isDevelopment = process.argv[process.argv.indexOf("--mode") + 1] === "development";
// const dotenvFilename = isDevelopment ? '.env.development' : '.env.production';

module.exports = (env) => {

  const isDevelopment = process.argv[process.argv.indexOf("--mode") + 1] === "development";
  //const isDevelopment = env.NODE_ENV === "development";
  const dotenvFilename = isDevelopment ? '/.env.development' : '/.env.production';

  const dotenv = require("dotenv").config({ path: __dirname + dotenvFilename });
  console.log(dotenv);
  return {
    target: ["web", "es5"],
    entry: "./src/main.tsx",
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
      fallback: {
        path: false,
        crypto: false,
        os: false,
      },
      extensions: [".ts", ".tsx", ".js"],
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env": JSON.stringify(dotenv.parsed),
      }),/*
      new Dotenv({
        path: dotenvFilename,
      }),*/
      new copy({
        patterns: [{ from: "node_modules/@tripetto/builder/fonts/", to: "." }],
      })
    ],
    performance: {
      hints: false,
    },
    devServer: {
      static: path.resolve(__dirname, "public"),
      port: 9000,
      host: "0.0.0.0",
    },
  }
};
