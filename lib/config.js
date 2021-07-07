const fse = require('fs-extra');
const path = require('path');
const symbols = require('log-symbols')
const chalk = require('chalk')
const config = {
  'tablevue': 'src/renderer/page/manage/desk',
  'tablejs': 'src/renderer/page/manage/desk',
  'reportvue': 'src/renderer/page/manage/report',
  'reportjs': 'src/renderer/models/report',
}

const configPath = path.resolve(__dirname,'../config.json')

// 输出json文件
async function defConfig() {
  try {
    await fse.outputJson(configPath, config)
  } catch (err) {
    console.error(err)
    process.exit()
  }
}

// 获取配置信息
async function getJson () {
  try {
    const config = await fse.readJson(configPath)
    console.log(chalk.cyan('current config:'), config)
  } catch (err) {
    console.log(chalk.red(err))
  }
}

// 设置json
async function setUrl(name, link) {
  const exists = await fse.pathExists(configPath)
  if (exists){
    mirrorAction(name, link)
  }else{
    await defConfig()
    mirrorAction(name, link)
  }
}

async function mirrorAction(name, link){
  try {
    const config = await fse.readJson(configPath)
    config[name] = link
    await fse.writeJson(configPath, config)
    await getJson()
    console.log(symbols.success, '🚀 Set the mirror successful.')
  } catch (err) {
    console.log(symbols.error, chalk.red(`👻 Set the mirror failed. ${err}`))
    process.exit()
  }
}

module.exports = { setUrl, getJson, config}
