---
title: "SSP 车辆管理 - 从 prod 迁移车辆到 testtwo"
date: 2026-09-01T09:00:00.000Z
authors:
  - bowen
tags:
  - 自动化
  - 工具开发
  - AI
categories: 自动化与效率
---
> 📖 **不知道怎么获取 x-chj-gwtoken？看这里！** 👉 [飞书文档 - 获取 x-chj-gwtoken 操作指南（含截图步骤）](https://li.feishu.cn/docx/XjYQdXqzioap7JxRBpJco3b0nvg)

# SSP 车辆管理 - 从 prod 迁移车辆到 testtwo

> **核心原则：优先通过接口操作。**
> 流程：先查 prod 获取原车数据（需 `x-chj-gwtoken`）→ 再到 testtwo 还原创建（无需鉴权）。

## 环境信息

| 环境 | 域名 | 鉴权 |
|------|------|------|
| **prod（licar）** | `https://api-hmi-default-private-front.chehejia.com` | 需要 `x-chj-gwtoken` |
| **testtwo** | `https://bcs-jedi-stub-service.testtwo.k8s.chehejia.com` | 无需鉴权 |

> 域名可通过环境变量覆盖（默认使用上表中的值）：
> - `VEHICLE_SYNC_PROD_URL`：prod 环境域名
> - `VEHICLE_SYNC_TESTTWO_URL`：testtwo 环境域名

## 快速开始

```bash
# 安装依赖
pip install -r requirements.txt

# 直接提供 x-chj-gwtoken 运行（推荐）
python scripts/sync.py <VIN> --token "your-x-chj-gwtoken"

# 不提供 x-chj-gwtoken 运行（会提示输入）
python scripts/sync.py <VIN>
```

## 获取 x-chj-gwtoken

> 不知道怎么获取 x-chj-gwtoken？查看飞书文档 👉 [获取 x-chj-gwtoken 操作指南（含截图）](https://li.feishu.cn/docx/XjYQdXqzioap7JxRBpJco3b0nvg)

`x-chj-gwtoken` 有过期时间，如果迁移过程中报 401/403，重新获取一次即可。

## 工作流程

```text
1. [prod] 查询车辆基础信息 → vehSeriesNo、vehVariableModelNo、purpose
2. [prod] 查询车辆配置字  → vehicleConfigCode（HU 功能配置字）
3. [prod] 查询车辆设备信息 → SN、ICCID
4. [testtwo] 同步车辆基础信息（mes/vehicle-info/licar/sync）
5. [testtwo] 同步拓扑信息（mes/topology-info/sync）
6. [testtwo] 创建 HU 功能配置字（config-code/create）
7. [testtwo] 绑定设备（devices/bind）
8. [testtwo] 更新车辆展示信息（update-veh-info）
9. 验证结果
```

## 执行步骤（供 Claude 使用）

### 1. 确认参数

先问用户以下信息，缺什么问什么：

- **VIN**：要迁移的车辆 VIN（必填）
- **x-chj-gwtoken**：`x-chj-gwtoken`，如果用户没提供，引导用户去飞书文档查看获取步骤：📖 [获取 x-chj-gwtoken 操作指南（含截图）](https://li.feishu.cn/docx/XjYQdXqzioap7JxRBpJco3b0nvg)

> 如果用户提供了 VIN 和 x-chj-gwtoken，直接进入第 2 步。
> 如果用户只给了 VIN，先问 x-chj-gwtoken，并告知去飞书文档查看获取方式。

### 2. 检查 Python 环境

```bash
python --version
```

确认 Python 3.10+ 可用。

### 3. 安装依赖

```bash
cd "docs/skill/车云平台数据同步-prod-to-testtwo"
pip install requests
```

### 4. 运行同步脚本

```bash
python scripts/sync.py <VIN> --token "<token>"
```

如果用户没有提供 x-chj-gwtoken 参数，会交互式提示输入。

### 5. 向用户报告结果

- 成功：显示迁移完成 + 车辆信息摘要
- 失败：显示具体失败步骤 + 错误信息

## 参数说明

| 参数 | 必填 | 说明 |
|------|------|------|
| `VIN` | 是 | 目标车辆 VIN（位置参数） |
| `--token` | 否 | x-chj-gwtoken，不传则交互式输入 |

## 故障排查

| 问题 | 原因 | 解决 |
|------|------|------|
| 401 Unauthorized | x-chj-gwtoken 过期 | 重新获取 x-chj-gwtoken |
| 未找到车辆 | VIN 不存在于 prod | 确认 VIN 是否正确 |
| 同步失败 | 网络或服务异常 | 重试，或检查 testtwo 服务状态 |
