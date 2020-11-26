// routes/statics.js: 静态资源路由

const express = require('express')
const path = require('path')

const router = express.Router()

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/disk.html'))
})
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'))
})
router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/register.html'))
})
router.get('/share', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/share.html'))
})
router.get('/s/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/disk.html'))
})
router.use('/', express.static('public'))

module.exports = router