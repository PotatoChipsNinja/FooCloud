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

## API 文档
### 鉴权机制
- 服务端使用 JSON Web Token (JWT) 标准和 RSA with SHA-256 非对称加密算法对接收的 API 请求进行鉴权
- 用户向服务端发送除 **登录** 和 **注册** 以外的 API 请求时，均需在请求头的 `Authorization` 属性中加入登录时由服务端颁发的 `token`，携带格式为 `Authorization: Bearer <token>`
- `token` 的过期时间为 **30 分钟**
- 当收到过期的或伪造的 `token` 时，服务端将返回鉴权失败的错误信息，用户需重新登录

### 响应格式
对于所有的请求，响应格式都是一个 JSON 对象

一个请求是否成功是由 HTTP 状态码标明的。一个 `200` 的状态码表示成功，而 `4XX` 或 `500` 表示请求失败。当一个请求失败时响应的主体仍然是一个 JSON 对象，包含 `code`（错误码） 和 `error`（错误信息） 这两个字段。例如，若尝试登录一个不存在的账号将会得到一个 `403` 响应，内容如下：
``` json
{
  "error": "Username Not Exist",
  "code": 201
}
```

错误代码请见 [错误代码详解](#错误代码详解)

### 错误代码详解
错误信息、错误码以及响应的 HTTP 状态码如下表：
| 错误码 | 错误信息 | 适用范围 | 说明 | HTTP 状态码 |
| :--: | :--: | :--: | :--: | :--: |
| 101 | Authentication Failure | 除 `/login` 和 `/register` 外所有 | 鉴权失败，携带错误 token 或 token 过期 | `401 Unauthorized` |
| 102 | Wrong API URL | 全局 | 没有找到该 API | `404 Not Found` |
| 103 | Parameter Error | 全局 | 缺少必要参数 | `400 Bad Request` |
| 104 | Internal Error | 全局 | 内部错误 | `500 Internal Server Error` |
| 201 | Username Not Exist | `/login` | 不存在该用户 | `403 Forbidden` |
| 202 | Wrong Password | `/login` | 密码错误 | `403 Forbidden` |
| 301 | Illegal Username | `/register` | 非法用户名，用户名须在 5-20 个字符之间 | `403 Forbidden` |
| 302 | Illegal Password | `/register` | 非法密码，密码须在 8-32 个字符之间 | `403 Forbidden` |
| 303 | Occupied Username | `/register` | 用户名已被占用 | `403 Forbidden` |

### 注册
#### 接口描述
接口 URL: `/api/user/register`

请求方法： `POST`

编码方式： `application/x-www-form-urlencoded`

#### 请求参数
| 参数名称 | 必选 | 类型 | 说明 |
| :--: | :--: | :--: | :--: |
| username | 是 | String | 用户名，5-20 个字符之间 |
| password | 是 | String | 密码，8-32 个字符之间 |

#### 正确情况返回
| 属性 | 类型 | 说明 |
| :--: | :--: | :--: |
| success | Boolean | 值恒为 `true` |

### 登录
#### 接口描述
接口 URL: `/api/user/login`

请求方法： `POST`

编码方式： `application/x-www-form-urlencoded`

#### 请求参数
| 参数名称 | 必选 | 类型 | 说明 |
| :--: | :--: | :--: | :--: |
| username | 是 | String | 用户名 |
| password | 是 | String | 密码 |

#### 正确情况返回
| 属性 | 类型 | 说明 |
| :--: | :--: | :--: |
| token | String | 用户 token，后续请求 API 时携带 |

### 获取文件列表
#### 接口描述
接口 URL: `/api/disk/getList`

请求方法： `GET`

#### 请求参数
| 参数名称 | 必选 | 类型 | 说明 |
| :--: | :--: | :--: | :--: |
| path | 是 | String | 请求目录路径，根目录为 `/` |
| sort | 否 | Integer | 排序方式，`0` 为按名称升序，`1` 为按名称降序，`2` 为按时间升序，`3` 为按时间降序，默认值为 `0` |

#### 正确情况返回
| 属性 | 类型 | 说明 |
| :--: | :--: | :--: |
| directory | [[DirInfo](#DirInfo)] | 目录列表 |
| file | [[FileInfo](#FileInfo)] | 文件列表 |

##### DirInfo
| 属性 | 类型 | 说明 |
| :--: | :--: | :--: |
| name | String | 目录名 |
| time | Integer | 修改时间，为 Unix 时间戳（自 1970 年 1 月 1 日以来的毫秒数） |

##### FileInfo
| 属性 | 类型 | 说明 |
| :--: | :--: | :--: |
| name | String | 文件名 |
| size | Integer | 文件大小，单位为字节 |
| time | Integer | 修改时间，为 Unix 时间戳（自 1970 年 1 月 1 日以来的毫秒数） |

