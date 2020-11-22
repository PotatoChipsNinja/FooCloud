// routes/api/disk.js: 文件系统操作 API 路由

const express = require('express')
const db = require('../../modules/db/disk')

const router = express.Router()

// 获取目录信息
router.get('/directory', (req, res) => {
  let path = req.query.path
  let sort = req.query.sort

  if (!path) {
    // 缺少必要参数
    res.status(400).send({ error: 'Parameter Error', code: 103 })
    return
  }

  // 排序方式，默认值为 0
  sort = sort ? parseInt(sort) : 0
  let sortFunc  // 排序函数

  switch (sort) {
    case 0:
      // 按名称升序
      sortFunc = (a, b) => {
        if (a.type == b.type) {
          return a.name > b.name ? 1 : -1
        } else {
          return a.type == 'file' ? 1 : -1  // 文件排在目录后
        }
      }
      break
    case 1:
      // 按名称降序
      sortFunc = (a, b) => {
        if (a.type == b.type) {
          return a.name < b.name ? 1 : -1
        } else {
          return a.type == 'file' ? 1 : -1  // 文件排在目录后
        }
      }
      break
    case 2:
      // 按时间升序
      sortFunc = (a, b) => {
        if (a.type == b.type) {
          return a.time > b.time ? 1 : -1
        } else {
          return a.type == 'file' ? 1 : -1  // 文件排在目录后
        }
      }
      break
    case 3:
      // 按时间降序
      sortFunc = (a, b) => {
        if (a.type == b.type) {
          return a.time < b.time ? 1 : -1
        } else {
          return a.type == 'file' ? 1 : -1  // 文件排在目录后
        }
      }
      break
    default:
      // sort 参数错误
      res.status(400).send({ error: 'Parameter Error', code: 103 })
      return
  }

  db.directory(req.username, path, (err, items) => {
    if (err) {
      res.status(err.code == 104 ? 500 : 403).send(err)
    } else {
      items.sort(sortFunc)  // 按用户指定排序方式排序
      let fileNum = items.filter(obj => obj.type == 'file').length
      let dirNum = items.filter(obj => obj.type == 'dir').length
      res.send({ fileNum: fileNum, dirNum: dirNum, items: items })
    }
  })
})

// 创建目录
router.post('/createDir', express.urlencoded({ extended: false }), (req, res) => {
  let name = req.body.name
  let path = req.body.path

  if (!name || !path) {
    // 缺少必要参数
    res.status(400).send({ error: 'Parameter Error', code: 103 })
    return
  }

  db.createDir(req.username, name, path, (err) => {
    if (err) {
      res.status(err.code == 104 ? 500 : 403).send(err)
    } else {
      res.send({ success: true })
    }
  })
})

router.use((req, res) => {
  res.status(404).send({ error: 'Wrong API URL', code: 102 })
})

module.exports = router