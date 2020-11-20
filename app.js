// app.js: 程序入口

const express = require('express')
const APIHandler = require('./api')
const db = require('./db')
const app = express()
const port = 3000

console.log('Connecting to database...')
db.connect((err) => {
  if (err) {
    // 数据库连接失败
    console.log('Failed to connect to datebase!')
    process.exit(1)
  }

  // 数据库连接成功，启动 Web 服务
  console.log('Successfully connected to database.')
  app.use('/api', APIHandler)         // 处理 API 请求
  app.use(express.static('statics'))  // 处理静态资源请求
  app.use((req, res) => {
    res.status(404).send('404 Not Found')
  })
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