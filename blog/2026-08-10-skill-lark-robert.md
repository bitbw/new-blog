---
title: "车云：通过群机器人「罗伯特」添加白名单 / 切换环境"
date: 2026-08-10T09:00:00.000Z
authors:
  - bowen
tags:
  - 自动化
  - 工具开发
  - AI
categories: 自动化与效率
---
# 车云：通过群机器人「罗伯特」添加白名单 / 切换环境

> 通过飞书群聊 @机器人「罗伯特」，发送**线上/线下白名单添加**、**切换/查询车辆云端环境**等指令。
> 使用 `lark-cli` 以用户身份发送，罗伯特才会响应。

## 环境准备

### 前置：必须先加入「罗伯特」所在飞书群

**使用本 skill 前，必须先进张博文邀请的飞书群**，否则无法向群里 @机器人「罗伯特」发消息。

> 张博文 邀请你加入飞书群，快点击
> https://applink.feishu.cn/client/chat/chatter/add_by_link?link_token=f61m352d-9482-44f8-9380-70c632fb8b66
> 加入吧！

- 若发送时提示无权限 / 找不到群聊（尚未进群），**请先通过上方邀请链接加入飞书群**，加入成功后再重试；
- 若不确定是否已进群，可在飞书客户端搜索群名确认。

本地如果没有 `lark-cli`，先按文档安装：

[lark-cli 安装指南](https://open.feishu.cn/document/mcp_open_tools/feishu-cli-let-ai-actually-do-your-work-in-feishu)

安装后在终端执行 `lark-cli --version` 确认可用。**首次使用或 token 过期时，先执行 `lark-cli auth login` 重新授权。**

## 命令一览

```bash
# 添加白名单（默认线上 + 线下都发送，间隔 1.5s）
python scripts/send.py whitelist <VIN>

# 只添加线上白名单
python scripts/send.py whitelist <VIN> --type online

# 只添加线下白名单
python scripts/send.py whitelist <VIN> --type offline

# 切换车辆云端环境（prod -> testtwo）
python scripts/send.py switch-env <VIN> prod testtwo

# 切换车辆云端环境（testtwo -> prod）
python scripts/send.py switch-env <VIN> testtwo prod

# 查询车辆云端环境
python scripts/send.py query-env <VIN>

# 不真正发送，只打印将生成的命令（用于核对）
python scripts/send.py whitelist <VIN> --dry-run
```

## 底层本质

以上命令最终执行的是 lark-cli 发送一条群消息，等价于：

```bash
lark-cli im +messages-send --as user --chat-id oc_826d073ba8c9bf029ad38bef60253e9c \
  --text '<at user_id="ou_f18b74520bac526a0242f42b615153be">罗伯特</at> 添加线上X01白名单 <VIN>'
```

| 部分 | 说明 |
|------|------|
| `--as user` | 以当前登录的**用户身份**发送（必须加，否则以机器人身份发送，罗伯特不会响应） |
| `--chat-id oc_826d073ba8c9bf029ad38bef60253e9c` | 目标群聊 ID（罗伯特所在的群） |
| `<at user_id="ou_f18b74520bac526a0242f42b615153be">罗伯特</at>` | 在群里 @罗伯特 |
| 消息内容 | `添加线上/线下X01白名单` + 空格 + VIN；`切换车辆云端环境 <VIN> <当前> <目标>`；`查询车辆云端环境 <VIN>` |

## 执行步骤（供 Claude 使用）

### 1. 确认参数

先问用户以下信息，缺什么问什么：

- **操作类型**：添加白名单 / 切换环境 / 查询环境
- **VIN**：目标车辆 VIN（必填）
- 添加白名单需确认是**线上、线下还是都要**（默认两条都发）
- 切换环境需确认**当前环境 → 目标环境**（prod / testtwo）

### 2. 检查 lark-cli

```bash
lark-cli --version
```

如果未安装，引导用户按上面文档安装；如果报 token/auth 相关错误，先 `lark-cli auth login`。

### 3. 发送指令

```bash
# 白名单（默认线上+线下）
python scripts/send.py whitelist <VIN>

# 切换环境
python scripts/send.py switch-env <VIN> <当前环境> <目标环境>

# 查询环境
python scripts/send.py query-env <VIN>
```

> 不确定时先加 `--dry-run` 核对要发送的内容，确认无误后再去掉发送。

### 4. 向用户报告结果

- 发送成功：告知已发送的操作与 VIN，白名单说明线上/线下均已添加，切换/查询说明请求已投递。
- 发送失败：展示错误信息；token 相关错误引导执行 `lark-cli auth login`。

## 注意事项（务必遵守）

- **必须使用 `--as user` 以用户身份发送**，否则罗伯特不会响应机器人消息。
- 由于飞书平台限制，不能跨 app 给第三方 bot 发 P2P 私聊，必须通过群聊 @ 的方式。
- **无论什么车型，都按 X01 发送**（罗伯特只识别 X01 格式）。
- **线上和线下白名单都要添加，不能漏掉任何一个**；脚本默认分两条发送，间隔 1.5s。
- **VIN 不要加引号**。
- **不要在 `<at>` 标签中的 `@` 前加反斜杠**：错误写法 `<at>...</at> \罗伯特</at>` 会导致无法正常 @ 用户。
- 当前 lark-cli 登录应用为 `cli_aaa26a27d8b91bc2`，罗伯特属于另一应用 `cli_9f7979022e3d500e`。

## 故障排查

| 问题 | 原因 | 解决 |
|------|------|------|
| 发送报「无权限」/「找不到群聊」/「不是群成员」 | 尚未加入目标飞书群 | 提示用户先通过张博文的邀请链接加入飞书群（见「环境准备」），加入后重试 |
| `lark-cli 执行失败` / token 相关 | token 过期 / 未登录 | 执行 `lark-cli auth login` 重新授权 |

## 参数说明

| 子命令 | 必填参数 | 说明 |
|--------|---------|------|
| `whitelist` | `VIN` | 添加 X01 白名单；`--type online/offline` 只发一条 |
| `switch-env` | `VIN from to` | 切换云端环境；`from` 当前环境，`to` 目标环境 |
| `query-env` | `VIN` | 查询车辆云端环境 |
| 通用 | - | `--dry-run` 只打印命令不发送 |
