module.exports = function() {
	return {
		name: 'plugin-remove',
		visitor: {
			CallExpression(path) {
				const callee = path.get('callee')

				if (
					(callee.node.type === 'MemberExpression' &&
						callee.node.object.name === 'console') ||
					callee.node.name === 'alert' ||
					(callee.node.type === 'MemberExpression' &&
						callee.node.property.name === 'alert')
				) {
					// const lineNum = path.node.loc.start.line
					// const columnNum = path.node.loc.start.column
					// console.log(`${lineNum}/${columnNum}`)
					return path.remove()
				}
			},
			DebuggerStatement(path) {
				return path.remove()
			}
		}
	}
}
