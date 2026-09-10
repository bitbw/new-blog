---
title: "next-serverless"
date: 2026-06-10T09:00:00.000Z
authors:
  - bowen
tags:
  - 个人项目
  - 全栈开发
categories: 项目实践
---
# next-serverless

基于 Next.js 15 + TypeScript 构建的 Serverless API 服务，集成 NeonDB（PostgreSQL）、Pusher 实时推送、Vercel Blob 文件存储和飞书通知。

## 快速开始

```bash
npm run dev
# or
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看首页。

## 环境变量

```env
DATABASE_URL=                   # NeonDB PostgreSQL 连接字符串（pooled，推荐用于大多数场景）
DATABASE_URL_UNPOOLED=          # NeonDB PostgreSQL 连接字符串（不经 pgbouncer，用于需要直连的场景）
BLOB_READ_WRITE_TOKEN=          # Vercel Blob 读写 Token

# Pusher（服务端触发事件；前端只需 key + cluster，见下文「前端接入 Pusher」）
PUSHER_APP_ID=                  # Pusher App ID
PUSHER_KEY=                     # 前端订阅用公钥（可暴露到浏览器）
PUSHER_SECRET=                  # 仅服务端，切勿写入前端
PUSHER_CLUSTER=                 # 例如 ap3
```

---

## 前端接入 Pusher（与本项目配合）

本仓库在 **`PUT /api/generic/update`** 更新成功且表名在服务端白名单内时，会调用 `pusher.trigger` 推送事件。前端使用与后端**同一 Pusher 应用**的 **`key` + `cluster`** 即可订阅（**不要**把 `PUSHER_SECRET` 放到前端）。

### 约定（与 `lib/pusher.ts` 一致）

| 项目 | 说明 |
|------|------|
| **Channel 名** | 与数据库**表名**相同（例如 `FuxiKuangBiao`） |
| **事件名** | 当前为 **`updated`**（仅 update 接口会触发） |
| **白名单** | 仅 `ENABLED_TABLES` 中的表会推送；默认包含 `FuxiKuangBiao`。其它表不会收到事件 |
| **Payload** | `{ id, tableName, ...本次 PUT 请求体里除 id/tableName 外的更新字段 }` |

`POST /api/generic/create`、`DELETE /api/generic/delete` 内 Pusher 调用当前为注释状态，**创建/删除不会推送**。

### 安装依赖（前端项目）

```bash
npm install pusher-js
# 或 pnpm / yarn 等价安装
```

### 最小示例（浏览器 / Vue / React 均可）

将 `YOUR_PUSHER_KEY`、`YOUR_CLUSTER` 换成与本服务环境变量 `PUSHER_KEY`、`PUSHER_CLUSTER` 相同的值（与 `lib/pusher.ts` 中配置一致）。

```typescript
import Pusher from 'pusher-js';

const pusher = new Pusher('YOUR_PUSHER_KEY', {
  cluster: 'YOUR_CLUSTER',
  forceTLS: true,
});

// 与操作的表名一致；仅白名单表在更新时会有事件
const channel = pusher.subscribe('FuxiKuangBiao');

channel.bind('updated', (data: Record<string, unknown>) => {
  // data 含 id、tableName 及更新的字段，可据此刷新列表或合并状态
  console.log('row updated', data);
});

// 组件卸载时取消订阅，避免泄漏
// channel.unbind_all();
// pusher.unsubscribe('FuxiKuangBiao');
```

### 联调注意

1. **同一应用**：前端 `key`/`cluster` 必须与部署本 API 时使用的 Pusher 应用一致。  
2. **公开 Channel**：当前为**公共 channel**（表名字符串）。若改为 `private-` / `presence-` 前缀，需在服务端配置 [Channel authorization](https://pusher.com/docs/channels/server_api/authorizing-users/)，本仓库未内置该接口。  
3. **扩展更多表**：在 `lib/pusher.ts` 的 `ENABLED_TABLES` 中加入表名并重新部署后，对该表执行 `PUT /api/generic/update` 才会向同名 channel 发 `updated`。

---

## API 接口文档

### 通用 CRUD 接口 (`/api/generic`)

这组接口支持对任意数据库表进行增删改查，通过 `tableName` 参数指定操作的表（默认为 `FuxiData`）。

---

#### `POST /api/generic/create` — 创建记录

**请求体**

```json
{
  "tableName": "FuxiData",
  "field1": "value1",
  "field2": "value2"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `tableName` | string | 否 | 表名，默认 `FuxiData` |
| 其他字段 | any | 是 | 写入数据库的字段和值 |

**响应**

```json
{
  "success": true,
  "message": "Record created successfully",
  "data": { "id": 1, "field1": "value1", "field2": "value2" }
}
```

**错误码**: `400` 无字段 / `500` 数据库错误

---

#### `DELETE /api/generic/delete` — 删除记录

支持 URL 查询参数或 JSON 请求体两种方式传参。

**URL 参数方式**

```
DELETE /api/generic/delete?id=1&tableName=FuxiData
```

**请求体方式**

```json
{
  "id": 1,
  "tableName": "FuxiData"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string \| number | 是 | 记录 ID |
| `tableName` | string | 否 | 表名，默认 `FuxiData` |

**响应**

```json
{
  "success": true,
  "message": "Record deleted successfully",
  "data": { "id": 1, "field1": "value1" }
}
```

**错误码**: `400` 缺少 id / `404` 记录不存在 / `500` 数据库错误

---

#### `GET /api/generic/query` — 查询记录

支持 GET（URL 参数）和 POST（请求体）两种方式。

**GET 请求**

```
GET /api/generic/query?tableName=FuxiData&orderBy=id&order=DESC&limit=10&offset=0
```

**POST 请求体**

```json
{
  "tableName": "FuxiData",
  "filters": [
    { "field": "type", "operator": "=", "value": "sensor" },
    { "field": "name", "operator": "ILIKE", "value": "%test%" }
  ],
  "logic": "AND",
  "orderBy": "id",
  "order": "DESC",
  "limit": 10,
  "offset": 0
}
```

**参数说明**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `tableName` | string | 否 | 表名，默认 `FuxiData` |
| `filters` | Filter[] | 否 | 过滤条件数组（GET 时传 JSON 字符串） |
| `logic` | `AND` \| `OR` | 否 | 多条件逻辑关系，默认 `AND` |
| `orderBy` | string | 否 | 排序字段 |
| `order` | `ASC` \| `DESC` | 否 | 排序方向，默认 `DESC` |
| `limit` | number | 否 | 每页条数 |
| `offset` | number | 否 | 偏移量 |

**Filter 结构**

```typescript
{
  field: string;
  operator: '=' | '<>' | '>' | '>=' | '<' | '<=' | 'LIKE' | 'ILIKE' | 'NOT LIKE' | 'IN' | 'IS NULL' | 'IS NOT NULL';
  value: any;
}
```

**响应**

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

**错误码**: `400` filters 格式错误 / `500` 数据库错误

---

#### `PUT /api/generic/update` — 更新记录

**请求体**

```json
{
  "id": 1,
  "tableName": "FuxiData",
  "field1": "new_value"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string \| number | 是 | 记录 ID |
| `tableName` | string | 否 | 表名，默认 `FuxiData` |
| 其他字段 | any | 是 | 要更新的字段和新值 |

**响应**

```json
{
  "success": true,
  "message": "Record updated successfully",
  "data": { "id": 1, "field1": "new_value" }
}
```

**错误码**: `400` 缺少 id 或无更新字段 / `404` 记录不存在 / `500` 数据库错误

**Pusher**：对 `lib/pusher.ts` 中 `ENABLED_TABLES` 白名单内的表，更新成功后会向 **channel = 表名** 触发事件 **`updated`**。前端订阅方式见上文「前端接入 Pusher（与本项目配合）」。

---

### FuxiData 专用接口 (`/api/fuxi-data`)

这组接口专门操作 `FuxiData` 表，该表结构为：`id`（自增主键）、`data`（JSON 字段）、`type`（类型标签）、`time`（东八区时间戳）。

---

#### `POST /api/fuxi-data/save-data` — 保存数据

**请求体**

```json
{
  "data": { "key": "value", "nested": { "foo": "bar" } },
  "type": "sensor"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `data` | any | 是 | 要保存的 JSON 数据对象 |
| `type` | string | 否 | 数据类型标签，默认 `default` |

**响应**

```json
{
  "success": true,
  "message": "Data saved successfully",
  "data": {
    "id": 123,
    "data": { "key": "value" },
    "type": "sensor",
    "time": "2024-03-31T08:30:00.000Z"
  }
}
```

**错误码**: `400` 缺少 data / `500` 数据库错误

---

#### `GET /api/fuxi-data/get-data` — 获取数据

三种查询模式，优先级依次为：按 `id` 查单条 > 按 `type` 查列表 > 分页查摘要。

**按 id 查询（返回完整记录）**

```
GET /api/fuxi-data/get-data?id=123
```

**按 type 查询（支持时间范围）**

```
GET /api/fuxi-data/get-data?type=sensor&startTime=2024-01-01&endTime=2024-12-31
```

**分页查摘要（仅返回 id、time、type）**

```
GET /api/fuxi-data/get-data?limit=10&offset=0
```

**参数说明**

| 参数 | 类型 | 说明 |
|------|------|------|
| `id` | string | 记录 ID，提供时直接返回单条 |
| `type` | string | 数据类型，提供时返回该类型所有记录 |
| `startTime` | string | 时间范围开始（与 type 配合使用） |
| `endTime` | string | 时间范围结束（与 type 配合使用） |
| `limit` | string | 分页大小，默认 `10`，最大 `100` |
| `offset` | string | 分页偏移，默认 `0` |

**错误码**: `404` 按 id 查询时记录不存在 / `500` 数据库错误

---

#### `PUT /api/fuxi-data/update-data` — 更新数据

**请求体**

```json
{
  "id": 123,
  "data": { "key": "updated_value" },
  "type": "new_type"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string \| number | 是 | 记录 ID |
| `data` | any | 是 | 新的 JSON 数据 |
| `type` | string | 否 | 更新数据类型，不提供则保留原值 |

`time` 字段自动更新为东八区当前时间。

**响应**

```json
{
  "success": true,
  "message": "Data updated successfully",
  "data": {
    "id": 123,
    "data": { "key": "updated_value" },
    "type": "new_type",
    "time": "2024-03-31T09:00:00.000Z"
  }
}
```

**错误码**: `400` 缺少 id 或 data / `404` 记录不存在 / `500` 数据库错误

---

#### `GET /api/fuxi-data/list-tables` — 列出数据库表

列出数据库 `public` schema 下的所有表及其元信息。

```
GET /api/fuxi-data/list-tables
```

**响应**

```json
{
  "success": true,
  "message": "Tables retrieved successfully",
  "data": {
    "totalTables": 2,
    "tables": [
      {
        "schemaname": "public",
        "tablename": "FuxiData",
        "tableowner": "postgres",
        "hasindexes": true,
        "hasrules": false,
        "hastriggers": false,
        "rowsecurity": false,
        "rowCount": 1000
      }
    ]
  }
}
```

---

### 文件上传接口 (`/api/blob`)

---

#### `POST /api/blob/client-upload` — 客户端文件上传

基于 Vercel Blob 的客户端直传接口。

**请求体**: `HandleUploadBody`（由 `@vercel/blob/client` 客户端 SDK 自动处理）

**限制**

| 项目 | 限制 |
|------|------|
| 支持格式 | PNG、JPEG、WebP |
| 最大文件大小 | 15 MB |

**响应**

```json
{
  "type": "success",
  "blob": {
    "pathname": "/my-file-abc123.png",
    "contentType": "image/png",
    "url": "https://...",
    "downloadUrl": "https://..."
  }
}
```

**客户端用法（示例）**

```typescript
import { upload } from '@vercel/blob/client';

const blob = await upload('my-file.png', file, {
  access: 'public',
  handleUploadUrl: '/api/blob/client-upload',
});
```

**错误码**: `400` 上传失败

---

### Webhook 接口 (`/api/webhooks`)

---

#### `POST /api/webhooks/sentry-feishu` — Sentry 错误转飞书通知

接收 Sentry Webhook 事件，格式化后自动发送飞书富文本卡片消息。

**Sentry 配置**: 在 Sentry 项目设置中将 Webhook URL 设置为该接口地址。

**请求体**（由 Sentry 自动发送）

```json
{
  "data": {
    "event": {
      "title": "TypeError: Cannot read property 'foo' of undefined",
      "datetime": "2024-03-31T08:00:00Z",
      "tags": [["device", "desktop"], ["os", "Windows 10"], ["browser", "Chrome 122"]],
      "url": "https://your-app.com/page",
      "web_url": "https://sentry.io/organizations/xxx/issues/yyy/"
    }
  }
}
```

**飞书卡片内容**

- 错误发生时间
- 环境标签（device / os / browser）
- 错误页面 URL
- 错误标题
- 跳转到 Sentry 详情的按钮

**响应**

```json
{
  "message": "ok",
  "data": { "code": 0, "msg": "ok" },
  "status": 200,
  "ok": true
}
```

**错误码**: `500` Webhook 处理失败

---

### 测试接口

---

#### `GET /api/hello` — Hello 测试

```
GET /api/hello?name=World
```

**响应**

```json
{ "message": "Hello World!" }
```

---

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 15 | 框架 |
| TypeScript | 5 | 类型检查 |
| NeonDB | 1.0.1 | PostgreSQL 无服务器数据库 |
| Pusher | 5.2.0 | 实时事件推送 |
| Vercel Blob | 2.3.2 | 文件存储 |
| TailwindCSS | 4 | 样式 |
