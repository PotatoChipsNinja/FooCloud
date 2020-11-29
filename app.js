// app.js: 程序入口

const express = require('express')
const router = require('./routes/index')
const db = require('./modules/db/base')
const logger = require('./modules/logger')

const app = express()
const port = 3000

logger('Connecting to database...')
db.connect((err) => {
  if (err) {
    // 数据库连接失败
    logger('Failed to connect to datebase!', true, () => {
      process.exit(1)
    })
  }

  // 主路由
  app.use('/', router)

  // 监听
  app.listen(port, () => {
    logger(`FooCloud listening at http://localhost:${port}`)
  })
})

process.on('SIGINT', () => {
  // 监听到中断信号 (Ctrl-C/Ctrl-D)
  db.close()      // 关闭数据库
  logger('Good bye!', false, () => {
    process.exit(0) // 退出
  })
})