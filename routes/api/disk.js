// routes/api/disk.js: 文件系统操作 API 路由

const express = require('express')
const multer = require('multer')
const db = require('../../modules/db/disk')
const auth = require('../../modules/auth')
const removeFile = require('../../modules/removeFile')

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

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
      items.forEach(obj => delete(obj.realName))  // 删除 realName 属性
      items.sort(sortFunc)                        // 按用户指定排序方式排序
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

// 上传文件
router.post('/upload', upload.single('file'), (req, res) => {
  let name = req.body.name
  let path = req.body.path
  let file = req.file

  if (!name || !path || !file) {
    // 缺少必要参数
    res.status(400).send({ error: 'Parameter Error', code: 103 })
    return
  }

  db.upload(req.username, name, path, file.filename, file.size, (err) => {
    if (err) {
      res.status(err.code == 104 ? 500 : 403).send(err)
    } else {
      res.send({ success: true })
    }
  })
})

// 下载文件
router.get('/download', (req, res) => {
  let name = req.query.name
  let path = req.query.path

  if (!name || !path) {
    // 缺少必要参数
    res.status(400).send({ error: 'Parameter Error', code: 103 })
    return
  }

  db.download(req.username, name, path, (err, realName) => {
    if (err) {
      res.status(err.code == 104 ? 500 : 403).send(err)
      return
    }

    // 签发下载 token
    auth.signDL(name, realName, (err, token) => {
      if (err) {
        res.status(500).send({ error: 'Internal Error', code: 104 })
      } else {
        res.send({ url: `/dl/${token}` })
      }
    })
  })
})

// 删除项目
router.post('/remove', express.urlencoded({ extended: false }), (req, res) => {
  let name = req.body.name
  let type = req.body.type
  let path = req.body.path

  if (!name || !type || !path || (type != 'dir' && type != 'file')) {
    // 缺少必要参数
    res.status(400).send({ error: 'Parameter Error', code: 103 })
    return
  }

  let dbFunc = type == 'dir' ? db.removeDir : db.removeFile
  dbFunc(req.username, name, path, (err, realNameList) => {
    if (err) {
      res.status(err.code == 104 ? 500 : 403).send(err)
      return
    }

    // 异步删除服务端文件
    removeFile(realNameList, (err) => {
      if (err) {
        res.status(500).send({ error: 'Internal Error', code: 104 })
      } else {
        res.send({ success: true })
      }
    })
  })
})

router.use((req, res) => {
  res.status(404).send({ error: 'Wrong API URL', code: 102 })
})

module.exports = router