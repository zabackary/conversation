/* eslint-disable no-console */
// @ts-check

import CopyWebpackPlugin from "copy-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlInlineScriptPlugin from "html-inline-script-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import {
  dirname as getDirname,
  join,
  posix,
  resolve as _resolve,
} from "node:path";
import TerserPlugin from "terser-webpack-plugin";
import { fileURLToPath } from "url";
import webpack from "webpack";
import GasPlugin from "./plugins/GasPlugin.js";
import ReactAxePlugin from "./plugins/ReactAxePlugin.js";

const filename = fileURLToPath(import.meta.url);
const dirname = getDirname(filename);

/**
 * Resolves a file path relative to `src` to a full file path.
 *
 * @param {string} filePath The file path to resolve against `src`.
 * @returns The resolved path.
 */
const getSrcPath = (filePath) => {
  const src = _resolve(dirname, "src");
  return posix.join(src.replace(/\\/g, "/"), filePath);
};

/**
 * Build.
 *
 * @param {any} config The config webpack passes
 * @returns {import("webpack").Configuration} The webpack config
 */
const build = (config) => {
  const env =
    Object.entries(config).find(
      ([key, value]) => !key.startsWith("WEBPACK") && value === true
    )?.[0] ||
    (console.warn("Enviornment not specified; defaulting to development"),
    "development");
  if (!["development", "production", "local"].includes(env))
    throw new Error(
      `Enviornment mode "${env}" not supported. Supported values: development, production, local`
    );
  return {
    mode: env === "production" ? "production" : "development",
    context: dirname,
    devServer: {
      static: {
        directory: join(dirname, "public"),
      },
      compress: true,
      port: 9001,
      historyApiFallback: true,
    },
    entry: {
      server: getSrcPath("/server/index.ts"),
      client: getSrcPath("/client/index.tsx"),
    },
    output: {
      filename: `[name].js`,
      path: _resolve(dirname, "dist"),
      clean: true,
      publicPath: "/",
    },
    resolve: {
      extensions: [".js", ".ts", ".tsx", ".jsx"],
    },
    optimization:
      env === "local" || env === "development"
        ? {}
        : {
            minimize: true,
            minimizer: [
              new TerserPlugin({
                test: /\.js$/i,
                extractComments: false,
                terserOptions: {
                  ecma: 2020,
                  compress: {
                    drop_console: false,
                  },
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
          test: /\.m?[jt]sx?$/,
          exclude: /src/,
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.m?[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              plugins: ["@babel/plugin-transform-runtime"],
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
        title: "Conversation",
        chunks: ["client"],
        filename: "index.html",
        inject: "body",
      }),
    ].concat(
      env === "local"
        ? [
            new webpack.NormalModuleReplacementPlugin(
              /network\/default_backend(\.ts)?$/,
              (resource) => {
                // You are literally supposed to reassign the parameter!
                // eslint-disable-next-line no-param-reassign
                resource.request = resource.request.replace(
                  "network/default_backend",
                  "network/mock"
                );
              }
            ),
            new ForkTsCheckerWebpackPlugin(),
            ReactAxePlugin(),
          ]
        : [
            new webpack.NormalModuleReplacementPlugin(
              /network\/default_backend(\.ts)?$/,
              (resource) => {
                // You are literally supposed to reassign the parameter!
                // eslint-disable-next-line no-param-reassign
                resource.request = resource.request.replace(
                  "network/default_backend",
                  "network/gas"
                );
              }
            ),
            new HtmlInlineScriptPlugin(),
            new GasPlugin(),
          ]
    ),
    devtool: env === "production" ? "source-map" : "cheap-module-source-map",
  };
};
export default build;
