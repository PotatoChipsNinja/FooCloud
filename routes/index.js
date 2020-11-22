// routes/index.js: 主路由

const express = require('express')
const APIRouter = require('./api/index')
const DownloadRouter = require('./dl')

const router = express.Router()

// 允许跨域访问
router.use('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})

// 处理 API 请求
router.use('/api', APIRouter)

// 处理下载请求
router.use('/dl', DownloadRouter)

// 处理静态资源请求
router.use(express.static('public'))

// 处理未找到 Handler 的请求
router.use((req, res) => {
  res.status(404).send('404 Not Found')
})

module.exports = router