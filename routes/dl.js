// routes/dl.js: 下载路由

const express = require('express')
const db = require('../modules/db/disk')
const auth = require('../modules/auth')

const router = express.Router()

router.get('*', (req, res, next) => {
  auth.verifyDL(req.url.substring(1), (err, name, realName) => {
    if (err) {
      next()
    } else {
      res.download(`uploads/${realName}`, name)
    }
  })
})

module.exports = router