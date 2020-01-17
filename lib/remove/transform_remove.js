const babel = require('@babel/core')

module.exports = function(code) {
	return babel.transformSync(code, {
		configFile: false,
		plugins: ['./removeConsole/plugin_remove.js']
	})
}
