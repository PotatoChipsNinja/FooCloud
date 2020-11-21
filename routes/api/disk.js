// routes/api/disk.js: 文件系统操作 API 路由

const express = require('express')

const router = express.Router()

router.use((req, res) => {
  res.status(404).send({ error: 'Wrong API URL', code: 102 })
})

module.exports = router