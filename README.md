# FooCloud：高扩展性的私有云文件系统
> 名称由 Fool Cloud（傻瓜云）简并而来，可译为“浮云”

FooCloud 采用前后端分离的设计模式，服务端采用 Node.js 进行开发，通过提供 REST API 服务与前端进行数据交互。

![FooCloud](https://github.com/PotatoChipsNinja/FooCloud/wiki/assets/index.png)

## 功能
- [用户服务](https://github.com/PotatoChipsNinja/FooCloud/wiki/User-Service)：注册、登录、登出等
- [文件服务](https://github.com/PotatoChipsNinja/FooCloud/wiki/Disk-Service)：文件上传、下载、删除等
- [分享服务](https://github.com/PotatoChipsNinja/FooCloud/wiki/Share-Service)：创建公开分享、私密分享、取消分享等
- 扩展应用：[备忘录](https://github.com/PotatoChipsNinja/FooCloud/wiki/Extend-Memo)、[待办事项](https://github.com/PotatoChipsNinja/FooCloud/wiki/Extend-TODO)等

## 特性
- [并发性](https://github.com/PotatoChipsNinja/FooCloud/wiki/Concurrency)：服务端通过异步回调 (callback) 的事件驱动 I/O 操作、前端异步加载数据 (AJAX)
- [健壮性](https://github.com/PotatoChipsNinja/FooCloud/wiki/Robustness)：多级错误回调，完整的 API 错误机制，包含日志模块
- [扩展性](https://github.com/PotatoChipsNinja/FooCloud/wiki/Scalability)：模块化开发，易新增扩展应用

## 环境与部署
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
openssl rsa -in private.key -pubout -out public.pem

# 启动 MongoDB 服务
mkdir db
mongod --dbpath=./db

# 启动 FooCloud 服务
npm start
```

## 文档
请见 [项目 wiki](https://github.com/PotatoChipsNinja/FooCloud/wiki/Home)。
