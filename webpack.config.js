const {
  resolve
} = require('path');
require('dotenv').config();

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const BundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = {
  devtool: 'cheap-module-eval-source-map',

  entry: ['react-hot-loader/patch', './main.tsx'],

  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'dist'),
    publicPath: '/repl/',
  },

  context: resolve(__dirname, 'app'),

  devServer: {
    hot: true,
    contentBase: resolve(__dirname, 'assets'),
    publicPath: '/repl/',
    proxy: [{
      context: ['/repl'],
      target: 'http://localhost:8081/',
      pathRewrite: {
        '^/repl': ''
      }
    }],
    port: 8081
  },

  module: {
    rules: [{
        // Do not transform vendor's CSS with CSS-modules
        // The point is that they remain in global scope.
        // Since we require these CSS files in our JS or CSS files,
        // they will be a part of our compilation either way.
        // So, no need for ExtractTextPlugin here.
        test: /\.css$/,
        include: /node_modules/,
        loaders: ['style-loader', 'css-loader'],
      },
      {
        test: /\.jsx?$/, // Transform all .js files required somewhere with Babel
        loader: 'babel-loader',
      },
      {
        test: /\.tsx?$/,
        loaders: ['react-hot-loader/webpack', 'awesome-typescript-loader'],
        exclude: /node_modules/,
        include: resolve(__dirname, 'app'),
      },
      {
        test: /\.(png|jpg)$/,
        use: 'url-loader?limit=15000'
      },
      {
        test: /\.eot(\?v=\d+.\d+.\d+)?$/,
        use: 'file-loader'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader?limit=10000&mimetype=application/font-woff',
      },
      {
        test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/,
        use: 'url-loader?limit=10000&mimetype=application/octet-stream',
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: 'url-loader?limit=10000&mimetype=image/svg+xml',
      },
    ],
  },

  resolve: {
    modules: [
      resolve(__dirname, './app'),
      resolve(__dirname, './node_modules'),
    ],
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },

  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        API_URL: JSON.stringify(process.env.API_URL),
        SHAREDB_URL: JSON.stringify(process.env.SHAREDB_URL),
        WS_URL: JSON.stringify(process.env.WS_URL),
        SIGNAL_API_URL: JSON.stringify(process.env.SIGNAL_API_URL)
      },
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
      },
      inject: true,
    }),
    // new BundleAnalyzer()
  ],
};

module.exports = config;