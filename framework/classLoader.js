const path = require('path')
const readDirFilenames = require('read-dir-filenames')

module.exports = (dirPath) => {
  const dirFiles = readDirFilenames(dirPath, { ignore: 'index.js' })
  return dirFiles.reduce((ret, dirFile) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require, no-param-reassign
    ret[path.basename(dirFile).replace(/\.\w+$/, '')] = require(dirFile).prototype
    return ret
  }, {})
}
