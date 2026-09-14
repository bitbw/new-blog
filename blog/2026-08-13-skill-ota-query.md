---
title: "OTA 应用升级数据查询（App Market / AMP）"
date: 2026-08-13T09:00:00.000Z
authors:
  - bowen
tags:
  - 自动化
  - 工具开发
  - AI
categories: 自动化与效率
---
# OTA 应用升级数据查询（App Market / AMP）

> 查询车辆在各应用市场运营平台（AMP）环境下的 **OTA 应用升级记录**（已安装 / 未安装及版本号）。
> 纯 Python 实现，不依赖 Playwright 浏览器，通过接口 + 登录 Cookie 鉴权。
> 应用不写死：**VIN 与应用（appid）均由用户输入**。

## 环境信息

| 环境 | 接口域名 | 登录页 | 编号段示例（com.fuxi.x11mediatest） |
|------|---------|--------|----------------------------------|
| **prod（生产）** | `https://ota-app-market-web.prod.k8s.chehejia.com` | `https://amp.chehejia.com` | `1000181` |
| **testtwo（开发测试）** | `https://ota-app-market-web.testtwo.k8s.chehejia.com` | `https://amp.testtwo.chehejia.com` | `3000170` |

> 域名可通过环境变量覆盖（默认使用上表中的值）：
> - `OTA_QUERY_PROD_URL`：prod 接口域名
> - `OTA_QUERY_TESTTWO_URL`：testtwo 接口域名

## 鉴权：登录 Cookie

两个环境都需要登录态。`code=240420` 表示登录失效。**获取 Cookie 方式：**

1. 浏览器登录对应环境的登录页（prod：`https://amp.chehejia.com`，testtwo：`https://amp.testtwo.chehejia.com`）
2. F12 → Network → 勾选 **Fetch/XHR**，再按接口域名过滤：`ota-app-market-web.prod.k8s.chehejia.com`（prod）/ `ota-app-market-web.testtwo.k8s.chehejia.com`（testtwo）；刷新页面或操作一下页面（如触发一次查询）
3. 复制该请求 **Request Headers** 里的 `Cookie` 值（形如 `k1=v1; k2=v2`）
4. 通过 `--cookie` 传入；脚本会保存到 `settings.json`，下次可省略

> Cookie 会过期，报 `240420` 时重新复制一份即可；可用 `--clear-cookie` 清除已保存的 cookie。

> 📖 获取 Cookie 的详细图文步骤见飞书文档：[获取AMP登录Cookie操作指南](https://li.feishu.cn/docx/NyhpdAD9uohnfAxKFzecj8IpnKb)

## appid 转换规则（重要）

`queryPage` 接口要求平台**数字 appId**（如 prod `1000181` / testtwo `3000170`），**不能直接传包名**。

脚本对用户输入的 `--appid` 自动处理：

| 用户输入 | 处理方式 |
|---------|---------|
| 数字，如 `1000181` / `3000170` | 直接作为平台 appId 传入 |
| 包名，如 `com.fuxi.x11mediatest` | 自动调用**应用列表枚举接口**（`/ota/v1/app/market/web/common/queryAppList`）转为当前环境的数字 appId |
| 中文名子串，如 `智能底盘` | 同上，按应用列表模糊匹配 |
| 不传 | 查询该车辆**全部**应用 |

> 转换走的目标枚举接口与环境一致：选 `--env prod` 用 prod 的 app 列表，选 `--env testtwo` 用 testtwo 的 app 列表。若不匹配会明确报错并提示相近应用。

## 快速开始

```bash
# 安装依赖
pip install -r requirements.txt

# 查询全部应用（prod，需 Cookie）
python scripts/query.py HLX34B160T1303448 --cookie "k1=v1; k2=v2"

# 按包名查某个应用（自动转平台 appId）
python scripts/query.py HLX34B160T1303448 --appid com.fuxi.x11mediatest --cookie "k1=v1; k2=v2"

# 按平台数字 appId 查，并指定 testtwo 环境
python scripts/query.py HLX32B141T1026801 --appid 3000170 --env testtwo --cookie "k1=v1; k2=v2"

# 输出原始 JSON
python scripts/query.py HLX34B160T1303448 --appid com.fuxi.x11mediatest --json
```

## 执行步骤（供 Claude 使用）

### 1. 确认参数

缺什么问什么：

- **VIN**：要查询的车辆 VIN（必填）
- **appid**：应用。可选。用户直接给包名/中文名/数字均可；不给则查询全部
- **环境**：默认 prod；如需 testtwo 让用户明确指定
- **Cookie**：优先用已保存的；失效时引导用户按上文重新复制

### 2. 检查 Python 环境 & 安装依赖

```bash
python --version        # 3.10+
pip install -r requirements.txt
```

### 3. 运行查询脚本

```bash
python scripts/query.py <VIN> [--appid <appid>] [--env <prod|testtwo>] [--cookie "<cookie>"]
```

### 4. 向用户报告结果

- 查到数据：按表展示各行的包名、屏幕、当前/目标版本、升级状态、安装判定、事件时间
- 未查到：说明该 VIN 在所选环境无该应用升级记录（多数属于未推送/未安装）

## 返回字段与安装判定

| 字段 | 说明 |
|------|------|
| `code` | `0` 成功；`240420` 登录失效 |
| `currentInternalVersion` | 当前版本号（数字），`0` 表示未装 |
| `targetInternalVersion` | 目标版本号 |
| `upgradeStatus` | 升级状态码，`50` = 升级成功 |
| `upgradeStatusName` | 状态文字：升级成功、升级中、下载中、等待升级 等 |
| `screenName` | 屏幕位置：中控 / 副驾 / 后排 |
| `appPackageName` | 应用包名 |
| `eventTime` | 事件时间 |

**已安装判定**：`upgradeStatus == 50` 且 `currentInternalVersion > 0` → 已安装；否则未完成。

## 参数说明

| 参数 | 必填 | 说明 |
|------|------|------|
| `VIN` | 是 | 目标车辆 VIN（17 位） |
| `--appid` | 否 | 应用：包名 / 中文名 / 平台数字 appId；包名自动转平台 appId；不传查全部 |
| `--env` | 否 | 环境，`prod`（默认）或 `testtwo` |
| `--cookie` | 否 | 登录 Cookie，不传则读已保存的 |
| `--page-size` | 否 | 每页条数（默认 20） |
| `--json` | 否 | 输出原始 JSON |
| `--clear-cookie` | 否 | 清除已保存的 cookie 后退出 |

## 故障排查

| 问题 | 原因 | 解决 |
|------|------|------|
| `code 240420` | Cookie 过期 / 未登录 | 重新登录对应环境并复制最新 Cookie |
| 未找到应用 `xxx` | 包名/应用名在该环境不存在 | 用应用列表枚举接口确认，或直接用数字 appId |
| `匹配到多个应用` | 输入过于模糊 | 改成完整包名，或直接给平台数字 appId |
| `totalCount: 0` | 该 VIN 无该应用升级记录 | 属于未推送/未安装；可去掉 `--appid` 查全部 |
