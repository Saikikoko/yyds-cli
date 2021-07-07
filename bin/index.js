#! /usr/bin/env node
const program = require('commander')
const minimist = require('minimist')
const chalk = require('chalk')

program
  .version(require('../package.json').version, '-v, --version') // 读取package.json里面的version
  .usage('<command> [options]')

program
  .command('upgrade')
  .description('Check the yyds-cli version')
  .action(() => {
    require(`../lib/update`)()
})

program
	.command('m <template> <url>')
	.description("Set the template url.")
	.action((template, url) => {
		require('../lib/config').setUrl(template, url)
	})

program
	.command('config')
	.description("see the current config.")
	.action((template, mirror) => {
		require('../lib/config').getJson(template, mirror)
	})

// generate page
// generate page
program
  .command('g <name>')
  .description('Generate template')
  .option('-t, --temp <name>', 'Auto generate <name> page. Currently support template [table, report]', 'table') // 最后的table 代表如果没有传 -t 参数，则使用默认模板 table
  .option('-f --force', 'Overwrite target directory if it exists')
  .action((name, options) => {
    if (minimist(process.argv.slice(3))._.length > 1) {
      console.log(chalk.yellow('\n Info: You provided more than one argument. The first one will be used as the app\'s name, the rest are ignored.'))
    }
    require('../lib/generate')(name, options)
  })

program.on('--help', () => {
  console.log()
  console.log(`  Run ${chalk.cyan(`yyds <command> --help`)} for detailed usage of given command.`)
  console.log()
})

program.commands.forEach(c => c.on('--help', () => console.log()))

program.parse(process.argv)  // 解析控制台敲入的命令