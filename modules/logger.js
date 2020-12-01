// moudules/logger.js: 日志模块

const fs = require('fs')
const path = require('path')

var hasFatal = false

// 输出 Banner
console.log('\033[;32m')
console.log('\
    ______            ________                __\n\
   / ____/___  ____  / ____/ /___  __  ______/ /\n\
  / /_  / __ \\/ __ \\/ /   / / __ \\/ / / / __  /\n\
 / __/ / /_/ / /_/ / /___/ / /_/ / /_/ / /_/ /\n\
/_/    \\____/\\____/\\____/_/\\____/\\__,_/\\__,_/\
')
console.log('\033[0m')

// 创建 logs 目录
fs.mkdir('logs', (err) => {
  if (err && err.code != 'EEXIST') {
    // 创建 logs 目录失败
    console.log(`[${dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss')}] [FATAL] Failed to make logs directory!`)
    process.exit(1)
  }
})

// 格式化日期
function dateFormat(date, fmt) {
  let opt = {
    'y+': date.getFullYear().toString(),
    'M+': (date.getMonth() + 1).toString(),
    'd+': date.getDate().toString(),
    'H+': date.getHours().toString(),
    'm+': date.getMinutes().toString(),
    's+': date.getSeconds().toString()
  }
  let ret

  for (let k in opt) {
    if (ret = new RegExp(`(${k})`).exec(fmt)) {
      fmt = fmt.replace(ret[1], opt[k].padStart(ret[1].length, '0'))
    }
  }
  
  return fmt
}

// 日志产生器
function logger(content, fatal, callback) {
  if (hasFatal) {
    return  // 已经出现致命错误，不再记录日志
  }
  if (fatal) {
    hasFatal = true
  }

  let logFile = path.join(__dirname, '../logs', `${dateFormat(new Date(), 'yyyyMMdd')}.log`)
  let logStr = `[${dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss')}] [${fatal ? 'FATAL' : 'INFO'}] ${content}`
  console.log(logStr)
  fs.writeFile(logFile, logStr + '\n', { flag: 'a' }, (err) => {
    if (err) {
      console.log(`[${dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss')}] [FATAL] Failed to write log file!`)
      process.exit(1)
    }
    if (callback) {
      callback()
    }
  })
}

module.exports = logger