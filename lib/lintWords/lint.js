const { resolve } = require('path')
const readFile = require('../common/readFile')
require('core-js/fn/string/match-all.js')

// const test = ['待修改', '待优化', '待删除', '待注释']

module.exports = function(
	files,
	gitDir,
	testWords = ['待修改', '待优化', '待删除', '待注释']
) {
	let errors = []
	for (let file of files) {
		const path = resolve(gitDir, file.filename)
		const data = readFile(file.filename, path, 'utf8')
		const reg = new RegExp(testWords.join('|'), 'g')

		const finds = [...data.matchAll(reg)]
		const allRows = data.split('\n')
		for (let find of finds) {
			const row = data.slice(0, find.index).match(/\n/g).length

			errors.push(generateErr(file.filename, find[0], row, allRows))
		}
	}
	return errors
}

function generateErr(filename, type, rowNum, allRows) {
	return `
${rowNum - 2}|${allRows[rowNum - 2]}    
${rowNum - 1}|${allRows[rowNum - 1]}    
${rowNum}|${allRows[rowNum]}    
${rowNum + 1}|${allRows[rowNum + 1]}    
${rowNum + 2}|${allRows[rowNum + 2]}

${filename}中包含${type}内容,行号:${rowNum}    

    `
}
