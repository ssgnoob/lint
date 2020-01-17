#!/usr/bin/env node
'use strict'

const findParentDir = require('find-parent-dir')
const pify = require('pify')
const sgf = require('staged-git-files')
const chalk = require('chalk')
const cosmiconfig = require('cosmiconfig')
const { resolve } = require('path')

const remove = require('./remove/remove')

const lint = require('./lintWords/lint')

const vm = require('./vm/vm')

const configPath = resolve(process.cwd(), 'package.json')
const gitDir = findParentDir.sync(process.cwd(), '.git')
sgf.cwd = gitDir
const ignoreFile = ['package.json', 'package-lock.json', 'yarn.lock'] //ACM: git状态 对应add,copy,modified  按理版本控制还应关注deleted状态 但文件删除后就没办法拿到内容了

/**
 *
 * 按照甲鱼的臀部，搞点别人看不懂的无用操作，可以显得这个库更高大上
 * @class ModuleClass
 */
class ModuleClass {
	constructor(moduleFunc) {
		this.moduleFunc = moduleFunc
		this.result = null
	}
	execute() {
		this.result = this.moduleFunc.apply(this, arguments)
		return this
	}
	then(cb) {
		cb(this.result)
	}
}

function resolveConfig(configPath) {
	try {
		return require.resolve(configPath)
	} catch (ignore) {
		return configPath
	}
}

function loadConfig(configPath) {
	const explorer = cosmiconfig('jupiter-lint', {
		searchPlaces: ['package.json']
	})

	return configPath
		? explorer.load(resolveConfig(configPath))
		: explorer.search()
}

function handelModules(config, key, moduleFunc, needCollect) {
	return config[key]
		? new ModuleClass(moduleFunc)
		: new ModuleClass(() => null)
}

pify(sgf)('ACM').then(files => {
	let errors = []
	let warns = []

	files = files.filter(i => !ignoreFile.includes(i.filename))

	loadConfig(configPath).then(result => {
		if (result === null)
			throw new Error('未发现jupter-lint相关配置,请在package.json中补充')
		const config = result.config

		//清除提交文件中的console.log alert window.alert debugger
		handelModules(config, 'remove', remove).execute(files, gitDir)
		// config.remove && remove(files, gitDir)

		//控制台打印文件中存在待修改等字符的代码行号
		handelModules(config, 'lintWords', lint)
			.execute(files, gitDir, config.lintWords.words)
			.then(res => {
				if (res) {
					config.lintWords.type === 'error'
						? errors.push(...res)
						: warns.push(...res)
				}
			})
		// config.lintWords && config.lintWords.type === 'error'
		// 	? errors.push(
		// 			...lint(
		// 				files,
		// 				gitDir,
		// 				config.lintWords.words
		// 			)
		// 	  )
		// 	: warns.push(
		// 			...lint(
		// 				files,
		// 				gitDir,
		// 				config.lintWords.words
		// 			)
		// 	  )

		//检查提交的路由文件中的版本控制是否存在映射的版本页面文件
		handelModules(config, 'vm', vm)
			.execute(files, gitDir)
			.then(res => {
				if (res) {
					config.vm.type === 'error'
						? errors.push(...res)
						: warns.push(...res)
				}
			})
		// config.vm && config.vm.type === 'error'
		// 	? errors.push(...vm(files, gitDir))
		// 	: warns.push(...vm(files, gitDir))

		warns.length > 0 && handleWarns(warns)
		errors.length > 0 && handelErrors(errors)
	})
})

function handleWarns(warns) {
	console.log(chalk.yellow(warns.join('\n')))
}

function handelErrors(errors) {
	process.exitCode = 1
	console.log(chalk.red(errors.join('\n')))
}
