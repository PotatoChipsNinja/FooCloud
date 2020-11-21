// app.js: 程序入口

const express = require('express')
const router = require('./routes/index')
const db = require('./modules/db/base')

const app = express()
const port = 3000

console.log('Connecting to database...')
db.connect((err) => {
  if (err) {
    // 数据库连接失败
    console.log('Failed to connect to datebase!')
    process.exit(1)
  }

  // 数据库连接成功，准备启动 Web 服务
  console.log('Successfully connected to database.')

  // 主路由
  app.use('/', router)

  // 监听
  app.listen(port, () => {
    console.log(`FooCloud listening at http://localhost:${port}`)
  })
})

process.on('SIGINT', () => {
  // 监听到中断信号 (Ctrl-C/Ctrl-D)
  db.close()      // 关闭数据库
  console.log('Good bye!')
  process.exit(0) // 退出
})