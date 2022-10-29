const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const GasPlugin = require("./plugins/gasplugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlInlineScriptPlugin = require("html-inline-script-webpack-plugin");

const getSrcPath = (filePath) => {
  const src = path.resolve(__dirname, "src");
  return path.posix.join(src.replace(/\\/g, "/"), filePath);
};

module.exports = (config) => {
  const env = Object.entries(config).find(
    ([key, value]) => !key.startsWith("WEBPACK") && value === true
  )[0];
  if (!["development", "production", "local"].includes(env))
    throw new Error(
      `Enviornment mode "${env}" not supported. Supported values: development, production, local`
    );
  return {
    mode: env === "local" ? "development" : env,
    context: __dirname,
    devServer: {
      static: {
        directory: path.join(__dirname, "public"),
      },
      compress: true,
      port: 9001,
    },
    entry: {
      server: getSrcPath("/server/server.ts"),
      client: getSrcPath("/client/client.tsx"),
    },
    output: {
      filename: `[name].js`,
      path: path.resolve(__dirname, "dist"),
      clean: true,
    },
    resolve: {
      extensions: [".js", ".ts", ".tsx", ".jsx"],
    },
    optimization:
      env === "local"
        ? {}
        : {
            minimize: true,
            minimizer: [
              new TerserPlugin({
                test: /\.js$/i,
                extractComments: false,
                terserOptions: {
                  ecma: 2020,
                  compress: true,
                  mangle: {
                    reserved: ["globals"],
                    keep_fnames: true, // Easier debugging in the browser
                  },
                  format: {
                    comments: /@customfunction/i,
                  },
                },
              }),
            ],
          },
    performance: {
      hints: false,
    },
    watchOptions: {
      ignored: ["**/dist", "**/node_modules"],
    },
    module: {
      rules: [
        {
          test: /\.(j|t)sx?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              presets: [
                [
                  "@babel/preset-env",
                  {
                    targets: {
                      node: 16,
                    },
                  },
                ],
                "@babel/preset-typescript",
                [
                  "@babel/preset-react",
                  {
                    runtime: "automatic",
                  },
                ],
              ],
            },
          },
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    plugins: [
      new ESLintPlugin(),
      new webpack.ProgressPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: getSrcPath("**/*.html"),
            to: "[name][ext]",
            noErrorOnMissing: true,
          },
          {
            from: getSrcPath("../appsscript.json"),
            to: "[name][ext]",
          },
        ],
      }),
      new HtmlWebpackPlugin({
        meta: {
          viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
        },
        title: "",
        chunks: ["client"],
        filename: "client.html",
      }),
    ].concat(
      env === "local"
        ? []
        : [
            new HtmlInlineScriptPlugin(),
            new GasPlugin({
              comments: false,
              includePatterns: "**/server.ts",
            }),
          ]
    ),
    devtool: "source-map",
  };
};
