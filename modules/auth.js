// moudules/auth.js: JWT 鉴权模块

const fs = require('fs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

let privateKey, cert

try {
  privateKey = fs.readFileSync('private.key') // 读取私钥
  cert = fs.readFileSync('public.pem')        // 读取公钥
} catch {
  // 读取密钥对失败
  console.log('Failed to load key pair!')
  process.exit(1)
}

function sign(username, callback) {
  jwt.sign({ username: username }, privateKey, { algorithm: 'RS256', expiresIn: '30m' }, (err, token) => {
    callback(err, token)
  })
}

function verify(token, callback) {
  jwt.verify(token, cert, (err, decoded) => {
    if (err) {
      callback(err)
    } else {
      callback(err, decoded.username)
    }
  })
}

module.exports = {
  sign,
  verify
}