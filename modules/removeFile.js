// moudules/removeFile.js: 异步删除文件

const fs = require('fs')
const path = require('path')

function removeFile(fileList, callback) {
  console.log('Remove Files:', fileList)

  if (fileList.length == 0) {
    // 特判列表为空
    callback()
    return
  }

  let uploadsPath = path.join(__dirname, '../uploads')
  let works = fileList.length  // 并发任务数
  for (let i = 0; i < works; i++) {
    fs.unlink(path.join(uploadsPath, fileList[i]), (err) => {
      if (err) {
        callback(err)
        return
      }

      // 完成该文件的删除任务
      works--;
      if (works == 0) {
        // 所有删除任务均完成
        callback()
      }
    })
  }
}

module.exports = removeFile