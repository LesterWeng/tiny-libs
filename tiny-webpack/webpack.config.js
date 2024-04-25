const path = require('path')
const testPlugin = require('./src/plugins/testPlugin')

module.exports = {
  entry: path.join(__dirname, 'src', 'index'),
  // watch: true,
  output: {
    path: path.join(__dirname, 'dist-webpack'),
    publicPath: '/dist/',
    filename: 'bundle.js',
    chunkFilename: '[name].js',
  },
  externals: {
    'query-string': 'window.queryString',
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: {
          loader: path.resolve(
            process.cwd(),
            'src/loaders/testLoader.js',
          ),
          options: {
            x: 1,
          },
        },
      },
    ],
  },
  plugins: [new testPlugin()],
}
