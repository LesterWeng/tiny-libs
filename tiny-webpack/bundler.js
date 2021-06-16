import fs from 'fs'
import path from 'path'
import parser from '@babel/parser'
import traverse from '@babel/traverse'
import babel from '@babel/core'

let uuid = 0
const createAsset = (filename) => {
  const file = fs.readFileSync(filename, 'utf-8')
  const ast = parser.parse(file, {
    sourceType: 'module',
  })

  // deps
  const deps = []
  traverse.default(ast, {
    ImportDeclaration({ node }) {
      deps.push(node.source.value)
    },
  })

  //  code
  const { code } = babel.transformFromAst(
    ast,
    null,
    {
      presets: ['@babel/preset-env'],
    },
  )

  return {
    id: uuid++,
    filename,
    deps,
    code,
  }
}

const createGraph = (entry) => {
  const queue = [createAsset(entry)]

  for (let asset of queue) {
    const dirname = path.dirname(asset.filename)

    asset.mapping = {}

    asset.deps.forEach((relativePath) => {
      const completePath = path.join(
        dirname,
        relativePath,
      )
      const child = createAsset(completePath)
      asset.mapping[relativePath] = child.id

      queue.push(child)
    })
  }

  return queue
}

const bundle = ({ entry, output }) => {
  const graph = createGraph(entry)

  // 保存id:[fn, mapping]映射
  let modules = ''
  graph.forEach((asset) => {
    modules += `${asset.id}:[
      function (require, module, exports){
        ${asset.code}
      },
      ${JSON.stringify(asset.mapping)}
    ],`
  })

  // 模拟commonjs
  const result = `
  (function(modules){
    function require(id){
      const [fn, mapping] = modules[id];
      function localRequire(relativePath){
        return require(mapping[relativePath]);
      }
      const module = {exports:{}};
      fn(localRequire,module,module.exports);
      return module.exports;
    }
    require(0);
  })({${modules}})
  `

  fs.writeFileSync(output, result, {
    recursive: true,
  })
}

bundle({
  entry: './src/index.js',
  output: './dist/index.js',
})
