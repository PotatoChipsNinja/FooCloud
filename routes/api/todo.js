// routes/api/todo.js: 待办事项 API 路由

const express = require('express')
const db = require('../../modules/db/todo')

const router = express.Router()

router.use((req, res) => {
  res.status(404).send({ error: 'Wrong API URL', code: 102 })
})

module.exports = router