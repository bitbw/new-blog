---
title: "AOSP APK 签名"
date: 2026-08-26T09:00:00.000Z
authors:
  - bowen
tags:
  - 自动化
  - 工具开发
  - AI
categories: 自动化工具
---
# AOSP APK 签名

使用 `scripts/sign.py` 调用签名平台接口完成一次完整签名流程：上传 APK、创建后台任务、轮询任务状态，成功后返回签名文件地址。

使用 `scripts/download.py` 携带 Artifactory Basic Auth 下载 `signed_url` 返回的签名 APK。

## 快速开始

```bash
python scripts/sign.py path/to/app.apk \
  --platform SS4 \
  --signature-type platform \
  --key-source releasekey \
  --user-name fengyubiao
```

脚本成功时输出 JSON，重点字段为：

```json
{
  "status": "completed",
  "task_id": "...",
  "signed_url": "https://...apk.signed"
}
```

## 必填参数与环境变量

脚本读取以下环境变量：`AOSP_SIGNATURE_BASE_URL`、`AOSP_SIGNATURE_USER_NAME`、`ARTIFACTORY_USERNAME`、`ARTIFACTORY_PASSWORD`。

| 参数 | 默认值 | 说明 |
|---|---|---|
| `apk` | 无 | 待签名 APK 本地路径 |
| `--user-name` | `AOSP_SIGNATURE_USER_NAME` | 签名平台用户 LDAP 名称 |
| `--platform` | `SS4` | `SS3` 或 `SS4` |
| `--signature-type` | `platform` | 签名类型，默认平台签名 |
| `--key-source` | `releasekey` | 密钥来源 |
| `--base-url` | `AOSP_SIGNATURE_BASE_URL` 或平台正式域名 | 签名平台地址 |
| `--interval` | `5` | 轮询间隔，单位秒 |
| `--timeout` | `1800` | 最大等待时间，单位秒 |
| `--request-timeout` | `300` | 单次 HTTP 请求超时时间，单位秒 |

当前 Skill 不要求 Cookie，也不会主动发送 Cookie。签名平台需要在当前内网环境可直接访问。

```powershell
$env:AOSP_SIGNATURE_USER_NAME = "fengyubiao"
python scripts/sign.py .\app-release.apk --platform SS4
```

下载签名 APK：

```powershell
$env:ARTIFACTORY_USERNAME = "你的 Artifactory 用户名"
$env:ARTIFACTORY_PASSWORD = "你的密码或 Token"
python scripts/download.py `
  "https://artifactory.example/artifactory/path/app.apk.signed" `
  --output .\app-release.apk.signed
```

脚本使用流式写入，先保存为 `.part` 临时文件，下载完成后再替换目标文件；认证失败、网络失败或中断时会清理临时文件。

下载参数：

| 参数 | 默认值 | 说明 |
|---|---|---|
| `--username` | `ARTIFACTORY_USERNAME` | Artifactory 用户名 |
| `--password` | `ARTIFACTORY_PASSWORD` | Artifactory 密码或 Token |
| `--timeout` | `600` | 下载请求超时时间，单位秒 |
| `--chunk-size` | `1048576` | 流式下载块大小，单位字节 |

## 工作流

1. 检查 APK 文件存在且扩展名为 `.apk`。
2. 向 `/api/apk/sign` 发送 multipart form-data 请求，字段为 `file`、`platform`、`signature_type`、`key_source`、`user_name`。
3. 从响应中读取 `task_id`；`status=accepted` 表示任务已进入后台队列，不代表签名完成。
4. 轮询 `/api/tasks/stats/summary?user_name=...` 获取总体 signing、completed、failed 状态，用于进度日志。
5. 轮询 `/api/tasks/list?user_name=...`，按返回的 `task_id` 精确匹配当前任务。
6. `status=completed` 且 `signed_url` 非空时立即返回 `signed_url`。
7. `status=failed` 或达到超时时抛出明确错误，并保留 `task_id` 方便人工排查。

不要按文件名或列表第一条任务匹配；同名 APK 可能存在多个历史任务，必须使用创建接口返回的 `task_id`。

## 鉴权说明

HAR 只用于确认接口字段和响应结构，不要复制其中的 OAuth code、access token、refresh token 或 Cookie。当前实现不处理 Cookie；若接口返回 401/403，应确认服务端是否已开放内网匿名访问。

## 相关接口

详细请求/响应字段见 `[`references/api.md`](#)`。脚本仅使用 Python 标准库，无需安装第三方依赖；依赖说明见 `[`requirements.txt`](#)`。

## 常见问题

- `accepted`：任务已创建，继续轮询，不要立即当作成功。
- `signing`：签名处理中，继续等待。
- `completed` 但 `signed_url` 为空：视为异常，返回错误并提示检查平台任务详情。
- `failed`：输出 `error_message`，不要重复自动提交同一个 APK，除非用户明确要求重试。
- 列表接口没有当前 `task_id`：可能是任务尚未入库，等待后重试；超过超时后失败。


