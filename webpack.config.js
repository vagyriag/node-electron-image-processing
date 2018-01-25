const path = require('path'),
      webpack = require('webpack'),
      fs = require('fs');

const nodeModules = {};
fs.readdirSync('node_modules')
  .filter(item => ['.bin'].indexOf(item) === -1 )  // exclude the .bin folder
  .forEach((mod) => {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = function (env) {
  const isDev = env === 'dev';
  return {
    entry: './src/index.tsx',
    output: {
      filename: `bundle${isDev ? '' : '.min'}.js`,
      path: path.resolve(__dirname, 'dist'),
      devtoolModuleFilenameTemplate: function(info){
        return "file:///"+info.absoluteResourcePath;
      }
    },

    externals: nodeModules,
  
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json']
    },

    node: {
      fs: 'empty'
    },
  
    devtool: 'source-map',
  
    devServer: {
      historyApiFallback: true,
      publicPath: '/dist',
      contentBase: path.join(__dirname),
      //hot: true,
      compress: true, // test
      // public: 'local.sgaviria.com', // solves invalid host header
      // disableHostCheck: true, // solves invalid host header *insecure
      inline: true,
      noInfo: true,
    },
  
    module: {
      loaders: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'awesome-typescript-loader'
        }, {
          test: /\.node$/,
          use: 'node-loader'
        }
      ]
    },
    
    plugins: isDev ? [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('development')
        }
      })
    ] : [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),
      new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        mangle: {
          screw_ie8: true,
          keep_fnames: true
        },
        compress: {
          screw_ie8: true
        },
        comments: false
      })
    ]
  };
}