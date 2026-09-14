---
title: "车云车辆云端环境·在线状态查询"
date: 2026-08-08T09:00:00.000Z
authors:
  - bowen
tags:
  - 自动化
  - 工具开发
  - AI
categories: 自动化与效率
---
> 📖 **不知道怎么获取 x-chj-gwtoken？看这里！** 👉 [飞书文档 - 获取 x-chj-gwtoken 操作指南（含截图步骤）](https://li.feishu.cn/docx/XjYQdXqzioap7JxRBpJco3b0nvg)

# 车云车辆云端环境·在线状态查询

> 查询车辆在云端（testtwo / prod）各域控模块的**在线状态**。
> **策略：先查 testtwo（无需鉴权），若无数据再兜底查 prod（需 `x-chj-gwtoken`）。**

## 环境信息

| 环境 | 域名 | 鉴权 |
|------|------|------|
| **testtwo（开发测试）** | `https://ssp-licar-platform-service.testtwo.k8s.chehejia.com` | 无需鉴权 |
| **prod（生产）** | `https://ssp-licar-platform-service.prod.k8s.chehejia.com` | 需要 `x-chj-gwtoken` |

> 域名可通过环境变量覆盖（默认使用上表中的值）：
> - `VEHICLE_QUERY_TESTTWO_URL`：testtwo 环境域名
> - `VEHICLE_QUERY_PROD_URL`：prod 环境域名

## 接口说明

```
GET /api/icn-veh-domains-all?vin={VIN}
```

返回车辆的 Domain 域控环境配置信息，每个域控模块（5G、fsd-a、hu-f、xcu 等）包含：
- `isConnected`：连接状态
- `ip`：连接 IP
- `env`：所在环境
- `cell`：cell
- `latest`：最近在线时间（毫秒时间戳）
- `leaveTime`：离线时间（如有）

车辆无云端数据时，接口返回 `{}`（空对象）。

## 快速开始

```bash
# 安装依赖
pip install -r requirements.txt

# 查询（自动：先查 testtwo，无数据再查 prod）
python scripts/query.py <VIN>

# 指定 token 查询 prod（也可在提示时粘贴，会保存供下次使用）
python scripts/query.py <VIN> --token "your-x-chj-gwtoken"

# 只查 testtwo，不兜底查 prod
python scripts/query.py <VIN> --no-fallback
```

## 获取 x-chj-gwtoken

> 不知道怎么获取 x-chj-gwtoken？查看飞书文档 👉 [获取 x-chj-gwtoken 操作指南（含截图）](https://li.feishu.cn/docx/XjYQdXqzioap7JxRBpJco3b0nvg)

`x-chj-gwtoken` 有过期时间，如果 prod 查询报 401/403，重新获取一次即可。

## 执行步骤（供 Claude 使用）

### 1. 确认参数

先问用户以下信息，缺什么问什么：

- **VIN**：要查询的车辆 VIN（必填）

> 如果用户只给了 VIN，直接进入下一步；token 仅在 testtwo 无数据、需要兜底查 prod 时才需要。

### 2. 检查 Python 环境

```bash
python --version
```

确认 Python 3.10+ 可用。

### 3. 安装依赖

```bash
pip install -r requirements.txt
```

### 4. 运行查询脚本

```bash
python scripts/query.py <VIN>
```

- 若 testtwo 查到数据：直接展示各域控模块状态，结束。
- 若 testtwo 无数据：脚本会提示输入 `x-chj-gwtoken`（或可提前用 `--token` 传入），再查询 prod。

### 5. 向用户报告结果

- 查到数据：列出各域控模块的连接状态、IP、环境、最近在线时间。
- 未查到：说明 testtwo、prod 均无该车辆的 Domain 数据，可能是车辆未接入云端或 VIN 有误。

## 参数说明

| 参数 | 必填 | 说明 |
|------|------|------|
| `VIN` | 是 | 目标车辆 VIN（位置参数，17 位） |
| `--token` | 否 | x-chj-gwtoken，不传则 testtwo 无数据时交互式输入 |
| `--no-fallback` | 否 | 只查 testtwo，testtwo 无数据时不查 prod |

## 故障排查

| 问题 | 原因 | 解决 |
|------|------|------|
| 401 Unauthorized | x-chj-gwtoken 过期 | 重新获取 x-chj-gwtoken |
| vin 码格式异常 | VIN 不是 17 位 | 确认 VIN 是否正确 |
| testtwo 与 prod 均无数据 | 车辆未接入云端或 VIN 有误 | 确认 VIN，或到 licar 平台确认车辆状态 |
