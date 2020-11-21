# FooCloud：高扩展性的私有云文件系统
> 名称由 Fool Cloud（傻瓜云）简并而来，可译为“浮云”

## 功能与特性
- 用户管理：注册、登录、登出等
- 文件服务：文件上传、下载、分享等
- 并发性能：后端数据库异步操作 (callback)、前端数据异步加载 (AJAX)
- 扩展应用：备忘录、课程表、待办事项等

## 环境与部署
> TODO: 通过 Docker 镜像进行容器化部署

部署 FooCloud 需要以下环境：
- Node.js 14.15.1
- MongoDB 4.4.2

按以下步骤部署 FooCloud 服务端：
``` shell
# 克隆项目
git clone https://github.com/PotatoChipsNinja/FooCloud.git
cd FooCloud

# 安装所需模块
npm install

# 创建密钥对（用于 JWT 鉴权）
openssl genrsa -out private.key 1024
openssl rsa -in private.key -out public.pem

# 启动 MongoDB 服务
mkdir db
mongod --dbpath=./db

# 启动 FooCloud 服务
npm start
```

## REST API
请见 [wiki - API 文档](https://github.com/PotatoChipsNinja/FooCloud/wiki/API-%E6%96%87%E6%A1%A3)
