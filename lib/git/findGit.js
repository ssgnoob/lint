const npmWhich = require('npm-which')(process.cwd())

const cache = new Map()
const binName='git'

module.exports = function findGit() {
    if (cache.has(binName)) {
        return { bin: cache.get(binName) }
      }
    
      try {
        /* npm-which tries to resolve the bin in local node_modules/.bin */
        /* and if this fails it look in $PATH */
        const bin = npmWhich.sync(binName)
        cache.set(binName, bin)
        return { bin}
      } catch (err) {
        // throw helpful error if matching script is present in package.json
       
        throw new Error(`${binName} could not be found. Try \`npm install ${binName}\`.`)
      }
}