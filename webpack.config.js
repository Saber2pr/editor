const HtmlWebpackPlugin = require("html-webpack-plugin")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const path = require("path")
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin")

const extract = new ExtractTextPlugin("style.min.css")

const { WebpackConfig, templateContent } = require("@saber2pr/webpack-configer")

module.exports = WebpackConfig({
  entry: "./src/app.tsx",
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  },
  output: {
    filename: "editor.min.js",
    path: path.join(__dirname, "build")
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
        injectHead:
          '<script src="https://saber2pr.top/loading/index.min.js"></script>',
        injectBody:
          '<div id="root"></div></div><script>LOADING.init();</script>'
      })
    }),
    extract,
    new MonacoWebpackPlugin()
  ],
  watchOptions: {
    aggregateTimeout: 1000,
    ignored: /node_modules|lib/
  }
})
