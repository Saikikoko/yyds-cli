const chalk = require('chalk')
const fs = require('fs-extra')
const ejs = require('ejs')
const symbols = require('log-symbols')
const path = require('path')
const inquirer = require('inquirer')
const { config } = require('./config')
const configPath = path.resolve(__dirname,'../config.json')
const { promisify } = require('util')
const figlet = promisify(require('figlet'))

// 支持的模板信息
const map = {
  table: {
    'vue': {
      temp: 'table.vue.ejs', // 模板
      ext: 'vue', // 后缀
    },
    'js': {
      temp: 'table.service.js.ejs',
      ext: 'service.js',
    }
  },
  report: {
    'vue': {
      temp: 'report.vue.ejs',
      ext: 'vue',
    },
    'js': {
      temp: 'report.model.js.ejs',
      ext: 'model.js',
    }
  }
}
/** 
 * @params {*} path 路径
 * @params {*} options 参数
*/
async function generate(url, options) {
  let template, tempName
  const { temp = 'table' } = options // 获取要生成的模板
  
  if (temp in map) {  // 判断是否有对应模板
    tempName = temp
    template = map[temp]
    let jsonConfig
    await fs.readJson(configPath).then((data) => {
      jsonConfig = data
    }).catch(() => {
      fs.writeJson(configPath, config)
      jsonConfig = config
    })
    try {
      for (const [key, value] of Object.entries(template)) {
        const {temp, ext} = value
        const baseUrl = jsonConfig[`${tempName}${key}`]
        const filepath = `${baseUrl}/${url}`
        const fileName = url.split('/').map(str => str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase()).join('')
        // 编译模板生成文件
        await compile(filepath, temp, {
          name: fileName,
          ext,
          ...options,
        })
      }
      console.log(symbols.success, chalk.cyan('🚀 generate success'))
      const info = await figlet('yyds', {
        font: 'Ghost',
        width: 100,
        whitespaceBreak: true
      })
      console.log(chalk.green(info), '\n')
    } catch (err) {
      console.log(symbols.error, chalk.red(`Generate failed. ${err}`))
    }
  } else { 
    console.log(symbols.error, chalk.red(`Sorry, don't support this template`)) // 没有则进行提示
  }
}

/**
 * 编译模板生成结果
 * @params {*} filepath 生成的文件路径
 * @params {*} templatepath 模板路径
 * @params {*} options 配置
*/
const compile = async (filepath, templatepath, options) => {
  const cwd = process.cwd(); // 当前的工作目录
  const targetDir = path.resolve(cwd,`${filepath}.${options.ext}`); // 生成的文件
  const tempDir = path.resolve(__dirname, `../template/${templatepath}`); // 模板存放路径
  if (fs.existsSync(tempDir)) { // 判断该模板路径是否存在
    if (fs.existsSync(targetDir)) {
      if (!options.force) {
        const { action } = await inquirer.prompt([
          {
            name: 'action',
            type: 'list',
            message: `Target directory ${chalk.cyan(targetDir)} already exists. Pick an action:`,
            choices: [
              { name: 'Overwrite', value: 'overwrite' },
              { name: 'Cancel', value: false }
            ]
          }
        ])
        if (!action) {
          throw Error('Cancel overite')
        } else if (action === 'overwrite') {
          console.log(`👻Removing ${chalk.cyan(targetDir)}`)
          await fs.remove(targetDir)
        }
      }
    }
    const content = fs.readFileSync(tempDir).toString()
    const result = ejs.compile(content)(options)
    await writeFileEnsure(filepath, result, options.ext)
  } else {
    throw Error("Don't find target template in directory")
  }
}

/**
 *
 * @param {*} paths 路径
 * @param {*} data 写入的数据
 * @param {*} ext 文件后缀
 */
 function writeFileEnsure(paths, data, ext) {
  const cwd = process.cwd();
  const pathArr = paths.split('/')
  pathArr.reduce((prev, cur, index) => {
    const baseUrl = path.resolve(cwd, `${prev}/${cur}`)
    if (index === pathArr.length - 1) {
      fs.writeFileSync(path.resolve(cwd, `${baseUrl}.${ext}`), data)
    } else {
      if (!fs.existsSync(baseUrl)) {
        fs.mkdirSync(path.resolve(cwd, baseUrl))
      }
    }
    return prev + '/' + cur
  }, '.')
}

module.exports = generate