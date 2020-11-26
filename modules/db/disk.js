// modules/db/disk.js: 数据库文件操作

const db = require('./base')

// 获取目录信息
function directory(username, path, callback) {
  let directory = db.gDb.collection('directory')
  directory.find({ username: username, directory: path }).toArray((err, result) => {
    if (err) {
      callback({ error: 'Internal Error', code: 104 })
      return
    }

    if (result.length == 0) {
      // 不存在该目录
      callback({ error: 'Directory Not Exist', code: 301 })
    } else {
      callback(err, result[0].items)
    }
  })
}

// 创建目录
function createDir(username, name, path, callback) {
  let directory = db.gDb.collection('directory')
  directory.find({ username: username, directory: path }).toArray((err, result) => {
    if (err) {
      callback({ error: 'Internal Error', code: 104 })
      return
    }

    if (result.length == 0) {
      // 不存在父目录
      callback({ error: 'Directory Not Exist', code: 301 })
      return
    }

    if (result[0].items.find(obj => (obj.name == name && obj.type == 'dir'))) {
      // 已经存在该目录
      callback({ error: 'Directory Already Exist', code: 302 })
      return
    }

    let newDirPath = path == '/' ? `/${name}` : `${path}/${name}`
    let newItem = { name: name, type: 'dir', path: path, realName: '', size: 0, time: new Date().getTime() }
    directory.updateOne({ username: username, directory: path }, { $push: { items: newItem } }, (err, result) => {
      if (err) {
        callback({ error: 'Internal Error', code: 104 })
        return
      }

      directory.insertOne({ username: username, directory: newDirPath, items: [] }, (err, result) => {
        if (err) {
          callback({ error: 'Internal Error', code: 104 })
        } else {
          callback()
        }
      })
    })
  })
}

// 上传文件
function upload(username, name, path, realName, size, callback) {
  let directory = db.gDb.collection('directory')
  directory.find({ username: username, directory: path }).toArray((err, result) => {
    if (err) {
      callback({ error: 'Internal Error', code: 104 })
      return
    }

    if (result.length == 0) {
      // 不存在该目录
      callback({ error: 'Directory Not Exist', code: 301 })
      return
    }

    if (result[0].items.find(obj => (obj.name == name && obj.type == 'file'))) {
      // 已经存在该文件
      callback({ error: 'File Already Exist', code: 303 })
      return
    }

    let newItem = { name: name, type: 'file', path: path, realName: realName, size: size, time: new Date().getTime() }
    directory.updateOne({ username: username, directory: path }, { $push: { items: newItem } }, (err, result) => {
      if (err) {
        callback({ error: 'Internal Error', code: 104 })
      } else {
        callback()
      }
    })
  })
}

// 下载文件（返回 realName）
function download(username, name, path, callback) {
  let directory = db.gDb.collection('directory')
  directory.find({ username: username, directory: path }).toArray((err, result) => {
    if (err) {
      callback({ error: 'Internal Error', code: 104 })
      return
    }

    if (result.length == 0) {
      // 不存在该目录
      callback({ error: 'Directory Not Exist', code: 301 })
      return
    }

    let fileObj = result[0].items.find(obj => (obj.name == name && obj.type == 'file'))

    if (!fileObj) {
      // 不存在该文件
      callback({ error: 'File Not Exist', code: 304 })
    } else {
      callback(err, fileObj.realName)
    }
  })
}

// 删除文件，返回需要删除的真实文件列表
function removeFile(username, name, path, callback) {
  let directory = db.gDb.collection('directory')
  directory.find({ username: username, directory: path }).toArray((err, result) => {
    if (err) {
      callback({ error: 'Internal Error', code: 104 })
      return
    }

    if (result.length == 0) {
      // 不存在该目录
      callback({ error: 'Directory Not Exist', code: 301 })
      return
    }

    let fileObj = result[0].items.find(obj => (obj.name == name && obj.type == 'file'))

    if (!fileObj) {
      // 不存在该文件
      callback({ error: 'File Not Exist', code: 304 })
      return
    }

    directory.updateOne({ username: username, directory: path }, { $pull: { items: fileObj } }, (err, result) => {
      if (err) {
        callback({ error: 'Internal Error', code: 104 })
      } else {
        callback(err, [fileObj.realName])
      }
    })
  })
}

// 递归删除目录，返回需要删除的真实文件列表
function removeDir(username, name, path, callback) {
  let directory = db.gDb.collection('directory')
  directory.find({ username: username, directory: path }).toArray((err, result) => {
    if (err) {
      callback({ error: 'Internal Error', code: 104 })
      return
    }

    if (result.length == 0) {
      // 不存在该目录
      callback({ error: 'Directory Not Exist', code: 301 })
      return
    }

    let dirObj = result[0].items.find(obj => (obj.name == name && obj.type == 'dir'))
    let dirPath = path + (path == '/' ? '' : '/') + name
    let fileList = []

    // 判断是否为空目录
    directory.find({ username: username, directory: dirPath }).toArray((err, result) => {
      if (err || result.length == 0) {
        callback({ error: 'Internal Error', code: 104 })
        return
      }

      if (result[0].items.length > 0) {
        // 不为空目录
        let works = result[0].items.length
        for (let i = 0; i < works; i++) {
          removeFunc = result[0].items[i].type == 'dir' ? removeDir : removeFile
          removeFunc(username, result[0].items[i].name, dirPath, (err, realName) => {
            if (err) {
              callback(err)
              return
            }

            fileList = fileList.concat(realName)
            works--;
            if (works == 0) {
              // 删除父级目录
              cleanDir(username, result[0], dirObj, (err) => {
                if (err) {
                  callback({ error: 'Internal Error', code: 104 })
                } else {
                  callback(err, fileList)
                }
              })
            }
          })
        }
      } else {
        // 为空目录，直接删除该目录
        cleanDir(username, result[0], dirObj, (err) => {
          if (err) {
            callback({ error: 'Internal Error', code: 104 })
          } else {
            callback(err, fileList)
          }
        })
      }
    })
  })
}

// 删除目录表项
function cleanDir(username, obj, itemEle, callback) {
  let directory = db.gDb.collection('directory')
  delete obj.items
  directory.deleteOne(obj, (err, result) => {
    if (err) {
      callback(err)
      return
    }

    // 从父级目录的 items 中删除
    directory.updateOne({ username: username, directory: itemEle.path }, { $pull: { items: itemEle } }, (err, result) => {
      if (err) {
        callback(err)
      } else {
        callback()
      }
    })
  })
}

// 对外部暴露模块
module.exports = {
  directory,
  createDir,
  upload,
  download,
  removeDir,
  removeFile
}