const fs =require('fs')
const Cache = require('./cache')

const cache=Cache.init()
module.exports=function readFile(fileName,path){
    if(cache.files[fileName]){
        return cache.files[fileName]
    }else{
        const data=fs.readFileSync(path,'utf8')
        cache.files[fileName]=data
        return data
    }
}