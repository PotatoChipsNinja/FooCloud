// routes/statics.js: 静态资源路由

const express = require('express')
const path = require('path')

const router = express.Router()

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/disk.html'))
})
router.get('/s/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/disk.html'))
})
router.use('/', express.static('public'))

module.exports = router