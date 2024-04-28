// const path = require('path')
// const testPlugin = require('./src/plugins/testPlugin')
import * as path from 'path'
import * as webpack from 'webpack'
import testPlugin from './src/plugins/testPlugin'

function testBabelPlugin({ types: t }) {
  return {
    visitor: {
      ImportDeclaration(path, state) {
        // 检查是否符合要替换的 import 形式
        if (
          path.node.specifiers.length === 1 &&
          t.isImportSpecifier(
            path.node.specifiers[0],
          )
        ) {
          // 提取 import 的成员名称
          const importedName =
            path.node.specifiers[0].imported.name
          // 修改 import 路径为 'xx/dist/a'
          path.node.source.value = `${path.node.source.value}/dist/${importedName}`
          // 移除 import 的花括号和成员名称
          path.node.specifiers = []
        }
      },
    },
  }
}

const config: webpack.Configuration = {
  entry: path.join(__dirname, 'src', 'index'),
  // watch: true,
  output: {
    path: path.join(__dirname, 'dist-webpack'),
    publicPath: '/dist/',
    filename: 'bundle.js',
    chunkFilename: '[name].js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  externals: {
    'query-string': 'window.queryString',
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: [
          {
            loader: path.resolve(
              process.cwd(),
              'src/loaders/testLoader.ts',
            ),
            options: {
              x: 1,
            },
          },
          // {
          //   loader: 'babel-loader',
          //   options: {
          //     plugins: [
          //       [
          //         testBabelPlugin,
          //         {
          //           x: 1,
          //         },
          //       ],
          //     ],
          //   },
          // },
        ],
      },
    ],
  },
  plugins: [new testPlugin()],
}

export default config
