// const { urlToRequest } = require('loader-utils')
import {urlToRequest} from 'loader-utils'

// module.exports = function (source) {
//   const options = this.getOptions()

//   console.log(options)

//   console.log(
//     'The request path',
//     urlToRequest(this.resourcePath),
//   )

//   // 对资源应用一些转换……

//   return `
//   console.log('--------------------123--------------------')
//   ${source}
//   `
// }

export default function (source) {
  const options = this.getOptions()

  console.log(options)

  console.log(
    'The request path',
    urlToRequest(this.resourcePath),
  )

  // 对资源应用一些转换……

  return `
  console.log('--------------------123--------------------')
  ${source}
  `
}
