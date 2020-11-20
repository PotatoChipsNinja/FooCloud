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
npm run start
```

## API 文档
### 鉴权机制
- 服务端使用 JSON Web Token (JWT) 标准和 RSA with SHA-256 非对称加密算法对接收的 API 请求进行鉴权
- 用户向服务端发送除 **登录** 和 **注册** 以外的 API 请求时，均需在请求头的 `Authorization` 属性中加入登录时由服务端颁发的 `token`，携带格式为 `Authorization: Bearer <token>`
- 登录时颁发的 `token` 的过期时间为 **30 分钟**，用户每次调用 API 后会重置过期时间
- 当收到过期的或伪造的 `token` 时，服务端将返回鉴权失败的错误信息，用户需重新登录

### 错误情况返回
当 API 请求错误或失败时，服务端将以 JSON 格式返回错误信息，包含参数如下：
| 参数名称 | 类型 | 说明 |
| :--: | :--: | :--: |
| error | String | 错误信息 |
| code | Integer | 错误码 |

其中，错误信息和错误码如下表：
| 错误码 | 错误信息 | 适用范围 | 说明 |
| :--: | :--: | :--: | :--: |
| 101 | Authentication Failure | 除 `/login` 和 `/register` 外所有 | 鉴权失败，携带错误 token 或 token 过期 |
| 102 | Wrong API URL | 全局 | 没有找到该 API |
| 103 | Parameter Error | 全局 | 缺少必要参数 |
| 104 | Internal Error | 全局 | 内部错误 |
| 201 | Username Not Exist | `/login` | 不存在该用户 |
| 202 | Wrong Password | `/login` | 密码错误 |
| 301 | Illegal Username | `/register` | 非法用户名，用户名须在 5-20 个字符之间 |
| 302 | Illegal Password | `/register` | 非法密码，密码须在 8-32 个字符之间 |
| 303 | Occupied Username | `/register` | 用户名已被占用 |

### 注册
#### 接口描述
接口 URL: `/api/register`
请求方法： `POST`
编码方式： `application/x-www-form-urlencoded`
返回格式： `application/json`

#### 请求参数
| 参数名称 | 必选 | 类型 | 说明 |
| :--: | :--: | :--: | :--: |
| username | 是 | String | 用户名，5-20 个字符之间 |
| password | 是 | String | 密码，8-32 个字符之间 |

#### 正确情况返回
| 参数名称 | 类型 | 说明 |
| :--: | :--: | :--: |
| success | Boolean | 值恒为 `true` |

### 登录
#### 接口描述
接口 URL: `/api/login`
请求方法： `POST`
编码方式： `application/x-www-form-urlencoded`
返回格式： `application/json`

#### 请求参数
| 参数名称 | 必选 | 类型 | 说明 |
| :--: | :--: | :--: | :--: |
| username | 是 | String | 用户名 |
| password | 是 | String | 密码 |

#### 正确情况返回
| 参数名称 | 类型 | 说明 |
| :--: | :--: | :--: |
| token | String | 用户 token，后续请求 API 时携带 |

