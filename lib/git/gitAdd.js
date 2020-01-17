const findGit=require('./findGit')
const execa = require('execa')


module.exports=function gitAdd(files){
    execa(findGit().bin, ['add',...files], {reject:false}).then(result => {
        if (result.failed)
            throw makeErr(linter, result.stdout, result.stderr)
      })
}

function makeErr(linter, errStdout, errStderr) {
    const err = new Error()
    err.privateMsg =`git add found some errors. Please fix them and try committing again.
      ${errStdout}
      ${errStderr}
    `
    return err
 }
