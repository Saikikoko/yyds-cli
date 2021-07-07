const updateNotifier = require('update-notifier');
const chalk = require('chalk')
const pkg = require('../package.json');

const notifier = updateNotifier({
    pkg,
    updateCheckInterval: 1000 // 检查更新的频率，官方默认是一天，这里设置成一秒
});
async function update() {
  if (notifier.update) {
    console.log(`Update available: ${chalk.cyan(notifier.update.latest)}`);
    notifier.notify()
  } else {
    console.log('No new version available')
  }
}


module.exports = update