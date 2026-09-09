---
title: "批量推送应用到车辆（AMP）"
date: 2026-08-15T09:00:00.000Z
authors:
  - bowen
tags:
  - 自动化
  - 工具开发
  - AI
categories: 自动化工具
---
# 批量推送应用到车辆（AMP）

> 把 VIN 车辆批量添加到 OTA 应用市场运营平台（AMP）的**应用测试分组**。
> 纯 Python 实现，不依赖浏览器；接口 + Cookie 鉴权。
> **车辆应用配置（huapp-config）已拆分为独立 skill「cheyun-amp-huapp-config」**：需要配置首页路由/截图悬浮按钮等应用内部设置时用那个 skill，本 skill 只做批量加 VIN。

## 环境信息

| 环境 | 接口域名 | 登录页 | 状态 |
|------|---------|--------|------|
| **testtwo（开发测试）** | `https://ota-app-market-web.testtwo.k8s.chehejia.com` | `https://amp.testtwo.chehejia.com` | ✅ 已接入 |
| prod（生产） | `https://ota-app-market-web.prod.k8s.chehejia.com` | `https://amp.chehejia.com` | ⏳ 接口地址待确认，暂未接入 |

> 域名可通过环境变量覆盖：
> - `AMP_PUSH_TESTTWO_URL`：testtwo 接口域名

## 鉴权：登录 Cookie

testtwo 环境需要登录态。`code=240420` 表示登录失效。**获取 Cookie 方式：**

1. 浏览器登录 https://amp.testtwo.chehejia.com
2. F12 → Network → 勾选 **Fetch/XHR**，再按接口域名过滤：`ota-app-market-web.testtwo.k8s.chehejia.com`；刷新页面或操作一下页面（如触发一次查询）
3. 复制该请求 **Request Headers** 里的 `Cookie` 整串（形如 `k1=v1; k2=v2`）
4. 通过 `--cookie` 传入；脚本会保存到 `settings.json`，下次可省略

> Cookie 会过期，报 `240420` 时重新复制一份即可；可用 `--clear-cookie` 清除已保存的 cookie。

> 📖 获取 Cookie 的详细图文步骤见飞书文档：[获取AMP登录Cookie操作指南](https://li.feishu.cn/docx/NyhpdAD9uohnfAxKFzecj8IpnKb)

## 测试分组解析规则（重要）

`--group` 参数支持两种写法，脚本自动处理：

| 用户输入 | 处理方式 |
|---------|---------|
| 数字 id，如 `3000742` | 直接作为分组 id 使用 |
| 名称/关键字，如 `L6试驾` | 调用分页查询接口（`/ota/v1/app/market/web/app/test/group/page`）按名称**模糊匹配** |
| 匹配到 **1 个** | 自动取该分组 |
| 匹配到 **多个** | 打印候选列表，提示用户用 `--group <数字id>` 重新指定（退出码 2） |
| 匹配不到 | 报错，提示先运行 `groups --name <关键字>` 查看可用分组 id |

> 名称模糊匹配和平台查询的结果一致；拿不准时先运行 `groups` 子命令确认 id。

## 快速开始

```bash
# 安装依赖
pip install -r requirements.txt

# 按名称查测试分组（返回 id）
python scripts/push.py groups --name L6 --cookie "k1=v1; k2=v2"

# 批量添加 VIN 到测试分组
python scripts/push.py add HLX32B141T1026801 HLX34B160T1303448 --group L6试驾_HU_SS3_台架 --cookie "k1=v1; k2=v2"

# 需要配置车辆应用配置（huapp-config）时，用独立 skill「cheyun-amp-huapp-config」
```

## 命令说明

### `groups`：查询测试分组

```bash
python scripts/push.py groups [--name <关键字>]
```

- 不传 `--name` 列前 50 条全部分组；传了就按名称模糊匹配
- 输出包含：id、名称、类型、状态、已关联 VIN 数、说明

### `add`：批量添加 VIN 到测试分组

```bash
python scripts/push.py add <VIN> [<VIN> ...] --group <名称或id>
```

流程：解析分组 → **batchAdd**（一次性把多个 VIN 加入测试分组）。

> 需要配置 huapp-config（车辆应用配置，如首页路由、截图悬浮按钮）时，改走独立 skill **`cheyun-amp-huapp-config`**，两者分开执行，按需选择。

## 执行步骤（供 Claude 使用）

1. **确认参数**：拼 VIN（17 位，多台用逗号/空格分隔）、分组（名称或 id）、Cookie（优先已保存的；无则按上文引导获取）
2. **环境**：当前仅 testtwo；如用户明确需要 prod，说明接口地址待确认，暂不可用
3. **运行**：可先 `push.py groups --name <关键字>` 确认分组 id，再 `push.py add ...`
4. **报告**：batchAdd 返回 code；多分组歧义时把候选列表展示给用户让其选 id
5. **按需配置**：如果用户还需要配置应用内部设置（首页路由/截图悬浮按钮），再引导用 `cheyun-amp-huapp-config` skill

## 参数说明

| 参数 | 必填 | 说明 |
|------|------|------|
| `vins` | 是 | 一个或多个 VIN（`add` 子命令） |
| `--group` | 是 | 测试分组名称或数字 id（`add` 子命令） |
| `--name` | 否 | 分组名称关键字（`groups` 子命令） |
| `--cookie` | 否 | 登录 Cookie，不传则读已保存的 |
| `--clear-cookie` | 否 | 清除已保存的 cookie 后退出 |

## 故障排查

| 问题 | 原因 | 解决 |
|------|------|------|
| `code 240420` | Cookie 过期 / 未登录 | 重新登录 https://amp.testtwo.chehejia.com 并复制最新 Cookie |
| 匹配到多个测试分组 | `--group` 名称过于模糊 | 按提示用 `--group <数字id>` 重新指定 |
| 未匹配到分组 | 名称不对 / 分组被删 | 先运行 `groups --name <关键字>` 确认 id |
| batchAdd 返回业务异常 | VIN 无效 / 分组状态异常 | 查看返回 msg；确认 VIN 为 17 位、分组已启用 |
| 需要配置应用内部设置 | 应是 huapp-config 场景 | 改用独立 skill `cheyun-amp-huapp-config` |