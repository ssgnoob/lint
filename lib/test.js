const { parse } = require('@vue/component-compiler-utils')
const fs = require('fs')
const source = fs.readFileSync(
	'/Users/shisengang/Desktop/repo/jupiter-versionControl/src/views/car/list.vue',
	'utf8'
)
console.time('reg')
const scriptReg = /<script([\s\S]*?)>([\s\S]*)<\/script>/
const match = source.match(scriptReg)

console.timeEnd('reg')
console.time('complier')
const descriptor = parse({
	source,
	compiler: require('vue-template-compiler'),
	filename: 'list.vue',
	sourceRoot: 'src/views/car',
	needMap: false
})
console.timeEnd('complier')
// fs.writeFileSync(
// 	'/Users/shisengang/Desktop/repo/jupiter-versionControl/src/views/test/index.js',
// 	JSON.stringify(descriptor.script.content, null, 4),
// 	'utf8'
// )
