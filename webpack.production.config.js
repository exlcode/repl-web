const {
  resolve
} = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
require("dotenv").config();

const config = {
  entry: ["./main.tsx"],

  context: resolve(__dirname, "app"),

  output: {
    filename: "[name].[chunkhash].js",
    path: resolve(__dirname, "dist"),
    publicPath: "/repl/"
  },

  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new HtmlWebpackPlugin({
      template: `${__dirname}/app/index.html`,
      filename: "index.html",
      inject: "body"
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   beautify: false
    // }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
        API_URL: JSON.stringify(process.env.API_URL),
        SHAREDB_URL: JSON.stringify(process.env.SHAREDB_URL),
        WS_URL: JSON.stringify(process.env.WS_URL),
        SIGNAL_API_URL: JSON.stringify(process.env.SIGNAL_API_URL)
      }
    })
  ],

  module: {
    loaders: [{
        test: /\.tsx?$/,
        loaders: ["awesome-typescript-loader"]
      },
      {
        test: /\.jsx?$/, // Transform all .js files required somewhere with Babel
        loader: "babel-loader"
      },
      {
        // Do not transform vendor's CSS with CSS-modules
        // The point is that they remain in global scope.
        // Since we require these CSS files in our JS or CSS files,
        // they will be a part of our compilation either way.
        // So, no need for ExtractTextPlugin here.
        test: /\.css$/,
        include: /node_modules/,
        loaders: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|jpg)$/,
        use: "url-loader?limit=15000"
      },
      {
        test: /\.eot(\?v=\d+.\d+.\d+)?$/,
        use: "file-loader"
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/,
        use: "url-loader?limit=10000&mimetype=application/octet-stream"
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: "url-loader?limit=10000&mimetype=image/svg+xml"
      }
    ]
  },
  resolve: {
    modules: [
      resolve(__dirname, "./app"),
      resolve(__dirname, "./node_modules")
    ],
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    mainFields: ["browser", "jsnext:main", "main"]
  }
};

module.exports = config;