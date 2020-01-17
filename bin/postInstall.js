const { resolve } = require('path')
const fs = require('fs')
const findParentDir = require('find-parent-dir')
const pkgDir = findParentDir.sync(process.cwd(), '.git')

const pkg = require(resolve(pkgDir, 'package.json'))
//package.json git钩子上加入jupter-lint指令
if (pkg.gitHooks && pkg.gitHooks['pre-commit']) {
	if (!/jupiter-lint/.test(pkg.gitHooks['pre-commit']))
		pkg.gitHooks['pre-commit'] =
			'jupiter-lint&&' + pkg.gitHooks['pre-commit']
} else {
	pkg.gitHooks = { 'pre-commit': 'jupiter-lint' }
}

//package.json 加入默认jupiter-lint配置规则
if (!pkg['jupiter-lint']) {
	pkg['jupiter-lint'] = {
		remove: true,
		lintWords: {
			words: ['待修改', '待优化', '待删除', '待注释']
		},
		vm: {
			type: 'error'
		}
	}
}

fs.writeFileSync(resolve(pkgDir, 'package.json'), JSON.stringify(pkg, null, 4))
