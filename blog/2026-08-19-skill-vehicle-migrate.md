---
title: "完整流程 - 从 prod 迁移车辆到 testtwo 并推送应用"
date: 2026-08-19T09:00:00.000Z
authors:
  - bowen
tags:
  - 自动化
  - 工具开发
  - AI
categories: 自动化与效率
---
# 完整流程 - 从 prod 迁移车辆到 testtwo 并推送应用

> 一站式编排：**检测是否存在 → 添加车辆 → 添加白名单 → 切换云端环境 → 批量推送应用**。
> 本 skill 是**编排层**：把各叶子能力按顺序串联，判断点必须询问用户；具体接口操作由各子 skill 完成。

<!-- more -->


## 流程概览

```
Step 1 [检测]    testtwo 查询车辆是否存在 → 存在则跳过 Step 2
Step 2 [添加]    不存在时：prod 查询 → testtwo 添加车辆 + 绑定设备
Step 3 [白名单]  通过飞书机器人罗伯特添加 X01 白名单（线上 + 线下）
Step 4 [切环境]  ⚠ 询问用户是否需要切换云端环境（prod → testtwo）
Step 5 [推送]    ⚠ 询问用户是否需要批量推送（按车型选 OTA 测试分组）
```

## 前置条件

> ⚠ 本 skill 是**编排层**，依赖同市场发布的 3 个子 skill。需与本 skill 一起安装，否则 `flow.py list` 会显示「缺」，流程无法执行。

### 1. 安装依赖（插件市场）

本 skill 与子 skill 都发布在插件市场 `lixiang-skills-marketplace`，先添加并刷新市场，再按名称安装：

```bash
# 添加插件市场（首次执行）
/plugin marketplace add https://gitlab.chehejia.com/ai-market/lixiang-skills-marketplace.git

# 刷新市场，拉取最新插件列表
/plugin marketplace update lixiang-skills-marketplace

# 按名称安装（直接写插件名，不要带 lixiang-skills-marketplace@ 前缀）
/plugin install cheyun-vehicle-migrate-prod-to-testtwo-push
/plugin install cheyun-vehicle-sync-prod-to-testtwo
/plugin install cheyun-lark-robert-whitelist-env
/plugin install cheyun-amp-batch-push-app

# 安装完成后执行，使插件生效
/reload-plugins
```

以下 4 个插件在本流程中的作用与入口脚本：

| 市场中的名称 | 在本流程中的作用 | 入口脚本 |
|-------------|----------------|---------|
| `cheyun-vehicle-migrate-prod-to-testtwo-push` | 本编排 skill（主流程） | `flow.py` |
| `cheyun-vehicle-sync-prod-to-testtwo` | Step 1~2 检测/添加车辆 | `sync.py` |
| `cheyun-lark-robert-whitelist-env` | Step 3~4 白名单/切换环境 | `send.py` |
| `cheyun-amp-batch-push-app` | Step 5 批量推送 | `push.py` |

### 2. 运行所需凭据

| 条件 | 说明 |
|------|------|
| `x-chj-gwtoken` | Step 1~2 查询/同步需要（从 licar.chehejia.com F12 Network 复制） |
| `lark-cli` + 飞书群 | Step 3~4 需要（需先加入罗伯特所在飞书群并 `lark-cli auth login`） |
| AMP Cookie | Step 5 需要（testtwo 登录 cookie，见子 skill 说明） |

## 子 skill 一览

| 步骤 | 子 skill | 入口脚本 |
|------|---------|---------|
| 1~2 检测/添加 | `cheyun-vehicle-sync-prod-to-testtwo` | `sync.py --token …` |
| 3 白名单 | `cheyun-lark-robert-whitelist-env` | `send.py whitelist <VIN>` |
| 4 切换/查询环境 | `cheyun-lark-robert-whitelist-env` | `send.py switch-env / query-env` |
| 5 批量推送 | `cheyun-amp-batch-push-app` | `push.py add <VIN…> --group …` |

> 每个子 skill 都是独立可安装的 skill，本 skill 只负责编排，不重复实现。

## 驱动命令

```bash
# 打印完整 5 步流程与命令（推荐先跑这个）
python scripts/flow.py plan <VIN...>

# 打印某一步的说明与命令
python scripts/flow.py step <1..5> <VIN...>

# 校验子 skill 是否就位
python scripts/flow.py list
```

## 执行步骤（供 Claude 使用）

> 汇总结论：把 flow.py 输出的命令复制执行；每步完成向用户汇报后再进下一步。

1. **确认 VIN 列表**（17 位，多台空格/逗号分隔）
2. **跑 `flow.py plan <VIN...>`** 拿到完整清单与命令
3. **Step 1~2 迁移**：确认 `x-chj-gwtoken`（没有就引导用户从 licar F12 复制，见 `cheyun-vehicle-sync-prod-to-testtwo` 的飞书文档），运行 `sync.py <VIN> --token <token>`；若车辆已存在会提示，跳过添加
4. **Step 3 白名单**：确认 `lark-cli` 可用且已进群，运行 `send.py whitelist <VIN>`（无论什么车型都按 X01；线上+线下都要）
5. **Step 4 切换环境**：**必须询问用户**是否需要切换（车辆可能不在线，切了无意义）；需要则运行 `send.py switch-env <VIN> prod testtwo`
6. **Step 5 批量推送**：**必须询问用户**是否需要推送；需要则按车型选组（X04B=`3000742`，X04C=`3000743`，或 `push.py groups --name <关键字>` 查），运行 `push.py add <VIN...> --group <名称或id>`
7. **收尾汇报**：每台车的迁移/白名单/环境/推送结果汇总给用户

## 判断点（必须询问用户，不要自动执行）

| 判断点 | 原因 |
|--------|------|
| Step 4 是否切换云端环境 | 车辆可能不在线，切换了无意义，由用户判断车辆状态 |
| Step 5 是否批量推送 | 属额外操作，需用户确认 |

## 参考文档

| 内容 | 位置 |
|------|------|
| 迁移/检测/添加车辆接口 | 见 `cheyun-vehicle-sync-prod-to-testtwo` 技能说明 |
| 白名单/切换环境 | 见 `cheyun-lark-robert-whitelist-env` 技能说明 |
| 测试分组查询接口 | `docs/查询测试分组.md` |
| AMP 登录 Cookie 获取 | 飞书文档 [获取AMP登录Cookie操作指南](https://li.feishu.cn/docx/NyhpdAD9uohnfAxKFzecj8IpnKb) |

## 故障排查

| 问题 | 原因 | 解决 |
|------|------|------|
| `flow.py list` 显示「缺」 | 子 skill 目录缺失 | 按上文安装依赖，装完执行 `/reload-plugins` |
| `/plugin install lixiang-skills-marketplace@xxx` 报 Marketplace not found | 当前 CLI 不支持 `市场名@插件名` 写法 | 去掉前缀直接 `/plugin install xxx` |
| 迁移报 401/403 | `x-chj-gwtoken` 过期 | 重新获取并传入；见 sync skill 飞书文档 |
| 白名单发送失败/找不到群 | 未进群 / token 过期 | 先通过邀请链接进群，再 `lark-cli auth login` |
| 推送报 `code 240420` | AMP Cookie 过期 | 重新登录 testtwo AMP 复制最新 Cookie |

