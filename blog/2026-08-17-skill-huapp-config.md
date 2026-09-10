---
title: "车辆应用配置（huapp-config）"
date: 2026-08-17T09:00:00.000Z
authors:
  - bowen
tags:
  - 自动化
  - 工具开发
  - AI
categories: 自动化工具
---
# 车辆应用配置（huapp-config）

> 为指定 VIN 车辆**逐条写入应用内部配置**（huapp-config）：设置应用打开时的**首页路由**（`homeRouteName`）和**截图悬浮按钮**（`showScreenshotFab`）开关。
> 内网接口，**无需鉴权**，不需要登录 Cookie，可单台或批量调用。

> 应用不一定都要配 huapp-config —— 只有需要在应用内部做额外设置（首页路由、截图悬浮按钮）的 app 才需要。**纯批量加 VIN 到测试分组请用「批量推送」skill。**

## 环境信息

| 项 | 值 |
|----|-----|
| 接口 | `https://fuxi-ai-webapp-conversation-01.inner.chj.cloud/api/huapp-config` |
| 鉴权 | 无（内网接口） |

> 接口地址可通过环境变量 `AMP_HUAPP_CONFIG_URL` 覆盖。

## 默认参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `--app-code` | `com.fuxi.x11mediatest` | 目标应用包名 |
| `--home-route` | `X04cMediaTestDrive_AccelDecelPitch` | 应用打开时的首页路由 |
| 截图悬浮按钮 | `showScreenshotFab = true` | 默认开启，`--no-fab` 关闭 |

## 快速开始

```bash
# 安装依赖
pip install -r requirements.txt

# 为单台车配置（默认参数）
python scripts/configure.py HLX32B141T1026801

# 指定 app_code、首页路由，并关闭截图悬浮按钮
python scripts/configure.py HLX32B141T1026801 --app-code com.fuxi.x11mediatest --home-route X04cMediaTestDrive_AccelDecelPitch --no-fab

# 批量配置多台
python scripts/configure.py HLX32B141T1026801 HLX34B160T1303448
```

## 执行步骤（供 Claude 使用）

1. **确认参数**：VIN（17 位，多台用逗号/空格分隔）、`--app-code`（默认 `com.fuxi.x11mediatest`）、`--home-route`（默认同前）、截图悬浮按钮开关（默认开）
2. **确认必要性**：只有该 app 需要在应用内部做设置时才配置；不了解可询问用户
3. **运行** `python scripts/configure.py <VIN...> [...]`
4. **报告**：每台输出 `[成功]`/`[失败]` 与汇总「成功 N/总数」；失败项可单独重跑

## 参数说明

| 参数 | 必填 | 说明 |
|------|------|------|
| `vins` | 是 | 一个或多个 VIN |
| `--app-code` | 否 | 应用包名（默认 `com.fuxi.x11mediatest`） |
| `--home-route` | 否 | 首页路由名（默认 `X04cMediaTestDrive_AccelDecelPitch`） |
| `--no-fab` | 否 | 关闭截图悬浮按钮（默认开启） |

## 故障排查

| 问题 | 原因 | 解决 |
|------|------|------|
| 单台 `[失败]` | 内网接口不可达 / VIN 无效 | 确认在内网环境运行、VIN 为 17 位；可单独重跑该 VIN |
| 返回非 0 code | 业务异常（参数/app_code 不对） | 查看失败信息里的 msg，核对包名与参数 |