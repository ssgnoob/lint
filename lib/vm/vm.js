const fs = require('fs')
const { resolve } = require('path')
const transfrom = require('./transform_vm')

module.exports = function(files, gitDir) {
	let errors = []
	const needVMCheckFiles = files.filter(
		i =>
			/^src\/views.+@.+\.vue$|^src\/router\/modules.+\.js$/.test(
				i.filename
			)
		//只检查git提交时router/mudolues下的js和views下的带版本号的.vue文件
	)
	for (let file of needVMCheckFiles) {
		if (/\.js$/.test(file.filename)) {
			//route文件
			// if (file.status === 'Deleted')
			// 	errors.push(...handleRouteFile_Deleted(file, gitDir))
			// else
			errors.push(...handleRouteFile(file, gitDir))
		}
		// else if(/\.vue$/.test(file.filename)){
		//     //.vue文件
		//     //暂时没有想到方法从.vue文件逆推映射路由文件
		// }
	}
	return errors
}

function handleRouteFile(file, gitDir) {
	const path = resolve(gitDir, file.filename)
	let node = transfrom(path)
	return traverse(node)
}

// function handleRouteFile_Deleted() {
// 	return [] //似乎无法建立删除文件与.vue文件的映射关系
// }

/**
 *
 *
 * @param {*} root route文件的export default的ast节点
 * @returns {string[]} errors 缺少的页面文件
 */
function traverse(root) {
	let errors = []
	const { properties } = root.declaration
	const nodeHasVM = properties.filter(a =>
		(a.value.properties || []).some(i => i.key.name === 'versionControl')
	) //存在versionControl属性值的路由元
	for (let node of nodeHasVM) {
		errors.push(...checkRule(node))
	}
	return errors
}

/**
 *
 *检查有版本映射关系的路由元是否存在对应的页面文件
 * @param {*} node 拥有versionControl属性值的route元ast节点
 * @returns {string[]} errors 缺少的页面文件
 */
function checkRule(node) {
	let errors = []
	const vm = node.value.properties.filter(
		i => i.key.name === 'versionControl'
	)[0]
	const rule = vm.value.properties.filter(i => i.key.name === 'rule')[0]

	let versionMap = []
	for (let property of rule.value.properties) {
		versionMap.push({ key: property.key.value, val: property.value.value })
	}
	if (versionMap.length === 0) return []
	const path = node.value.properties.filter(i => i.key.name === 'path')[0]
		.value.value
	for (let { val } of versionMap) {
		if (val !== '*') {
			const pageFilePath = resolve(
				process.cwd(),
				'src',
				`${path}@${val}.vue`
			)
			if (!fs.existsSync(pageFilePath)) {
				errors.push(`不存在对应版本页面文件${path}@${val}.vue`)
			}
		}
	}
	return errors
}
