const babel = require('@babel/core')

module.exports = function(path) {
	const { ast } = babel.transformFileSync(path, {
		configFile: false,
		ast: true
	})
	return ast.program.body.find(i => i.type === 'ExportDefaultDeclaration')
}
