const HtmlWebpackPlugin = require("html-webpack-plugin")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const path = require("path")
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin")
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin")

const extract = new ExtractTextPlugin("style.min.css")

const { WebpackConfig, templateContent } = require("@saber2pr/webpack-configer")

module.exports = WebpackConfig({
  entry: {
    shouldPC: "./src/external/shouldPC.ts",
    LOADING: "./src/external/loading.ts",
    editor: "./src/app.tsx"
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  },
  output: {
    filename: "[name].min.js",
    path: path.join(__dirname, "build"),
    library: "[name]",
    libraryTarget: "global"
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: ["ts-loader"]
      },
      {
        test: /\.(css|less)$/,
        use: extract.extract({
          use: [
            {
              loader: "css-loader"
            }
          ],
          fallback: "style-loader"
        })
      },
      {
        test: /\.(woff|svg|eot|ttf)$/,
        use: ["url-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateContent: templateContent("Editor", {
        injectHead: `<meta name="viewport" content="maximum-scale=1.0, user-scalable=0">`,
        injectBody: '<div id="root"></div>'
      })
    }),
    new ScriptExtHtmlWebpackPlugin({
      async: ["shouldPC"]
    }),
    extract,
    new MonacoWebpackPlugin()
  ],
  watchOptions: {
    aggregateTimeout: 1000,
    ignored: /node_modules|lib/
  }
})
