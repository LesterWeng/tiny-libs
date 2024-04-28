import * as webpack from 'webpack';
export default class testPlugin {
  // 在插件函数的 prototype 上定义一个 `apply` 方法，以 compiler 为参数。
  apply(compiler) {
    // 指定一个挂载到 webpack 自身的事件钩子。
    compiler.hooks.emit.tapAsync(
      'MyExampleWebpackPlugin',
      (compilation, callback) => {
        // 用 webpack 提供的插件 API 处理构建过程
        compilation.emitAsset(
          'extraFile.json',
          new webpack.sources.RawSource(
            JSON.stringify({
              x: 1,
              y: 2,
            }),
          ),
        )

        callback()
      },
    )
  }
}
