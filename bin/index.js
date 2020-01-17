#!/usr/bin/env node
process.title = 'jupiter-lint'

require('commander')
	.version(require('../package').version)
	.usage('<command> [options]')
	.parse(process.argv)

require('../lib/index')
