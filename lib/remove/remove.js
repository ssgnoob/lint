const fs = require('fs')
const { resolve } = require('path')
const readFile = require('../common/readFile')
const transform = require('./transform_remove')
const gitAdd = require('../git/gitAdd')

module.exports = function(files, gitDir) {
	let changedFile = []
	for (let file of files) {
		if (/\.js$/.test(file.filename)) {
			const path = resolve(gitDir, file.filename)
			let data = readFile(file.filename, path)
			const { code } = transform(data)
			fs.writeFileSync(path, code, 'utf8')
			changedFile.push(file.filename)
		} else if (/\.vue$/.test(file.filename)) {
			//只清js和vue文件
			const path = resolve(gitDir, file.filename)
			let data = readFile(file.filename, path)
			//使用正则匹配(0.8ms)，测试2000行.vue文件比vue-template-compiler(60+ms)快,vue-template-compiler也是用正则实现的
			const scriptReg = /<script([\s\S]*?)>([\s\S]*)<\/script>/
			const match = data.match(scriptReg)
			if (!match) return
			const scriptHeader = match[1]
			const scriptContent = match[2]
			const { code } = transform(scriptContent)
			fs.writeFileSync(
				path,
				data.replace(
					/<script[\s\S]*?>([\s\S]*)<\/script>/,
					`<script${scriptHeader}>
${code}
</script>`
				),
				'utf8'
			)
			changedFile.push(file.filename)
		}
	}
	gitAdd(changedFile)
}
