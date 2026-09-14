---
title: "🚀 车云收尾\"两件套\"：切云端环境 + OTA 批量推 App —— 一个编排 Skill 一次串通"
date: 2026-08-12T09:00:00.000Z
authors:
  - bowen
tags:
  - 自动化
  - 工具开发
  - AI
categories: 自动化与效率
---
> **一句话摘要：** 上一轮我安利过"从 prod 迁车到 testtwo"，这次是接续它的**编排层 Skill**——把「检测 → 添加 → 白名单 → **切换云端环境** → **按车型批量推送 App 到 OTA 测试分组**」5 步串成一条线。其中最磨人的两件收尾活：**切环境**（prod ↔ testtw）和 **App OTA 推送**，终于不用再跨 AMP / 飞书机器人 / 云端平台人肉一遍。

---

## 你是否也被这两件"收尾活"烦着

把车搬进 testtwo、加好白名单，你以为完了——**真正磨人的是两个收尾动作**：

- **切换云端环境**：车得上测试环境联调，结果它云端环境还挂在 prod，联调各种连不上；得去跟飞书机器人「罗伯特」发命令切环境，发完还不知道切没切成，再查一遍；
- **添加 App 的 OTA 推送**：要推了，打开 AMP，按车型挑 OTA 测试分组——组号又长又难记（X04B=`3000742`、X04C=`3000743`……），记不住还得回头查，一台一台手点，点错就推到别人的测试环境。

这两件事**有规则、纯手工、跨平台**，还极其容易错。正适合交给 Claude Code。

所以我把迁移、白名单、切环境、批量推送**四个叶子能力串成一个编排 Skill**：一句人话触发，5 步一条龙跑完，中间该你拍板的节点自动停下来问你。

---

## 一、这个 Skill 是什么：编排层，把 4 个子能力按序串起来

它**不自造接口**，而是站在 4 个已发布的子 Skill 之上，把一条「完整流程」按顺序编排执行：

```
flow.py plan <VIN...>
  ├─ Step 1  检测：testtwo 里车是否已存在
  ├─ Step 2  添加：prod 查原车 → testtwo 建车 + 绑定设备（存在则跳过）
  ├─ Step 3  白名单：飞书机器人罗伯特加 X01（线上 + 线下）
  ├─ Step 4  ⚠ 切环境：prod ↔ testtwo（本 Skill 核心新增）
  └─ Step 5  ⚠ OTA 推送：选机型测试分组，批量推 App（本 Skill 核心新增）
```

| 步骤 | 动作 | 子 Skill | 入口 |
| --- | --- | --- | --- |
| 1~2 | 检测 / 添加车辆 | `cheyun-vehicle-sync-prod-to-testtwo` | `sync.py` |
| 3 | X01 白名单（线上+线下） | `cheyun-lark-robert-whitelist-env` | `send.py whitelist` |
| 4 | **切换云端环境** | 同上 | `send.py switch-env / query-env` |
| 5 | **批量推送 App 到 OTA 分组** | `cheyun-amp-batch-push-app` | `push.py add / groups` |

> 一整条流程 = `flow.py` 编排 + 4 个子 Skill。只装主 Skill 不装叶子，`flow.py list` 会显示「缺」，流程跑不了。

---

## 二、两件"新增"到底省了什么

### 场景 A：切换云端环境（Step 4）

**以前（约 5~10 分钟，跨两个界面）：**
找到车 → 判断它目前在 prod 还是 testtwo → 去飞书给机器人罗工发「切环境」命令 → 等回 → 切完再回云端平台查一次确认「现在到底在哪」→ 不在预期里再回头切一遍。

**现在：**
一行命令（或一句话）就切，切完回读确认在哪个环境：

```python
python send.py switch-env <VIN> prod testtwo   # 从 prod 切到 testtwo
python send.py query-env <VIN>                  # 随时查当前在哪个环境
```

一句话：**「切环境」从『发命令 + 手工回查』变成『一条命令 + 自动确认』。**

**为什么这个判断点必须先问你：** 车可能处于离线。车不在线的时候切换没有意义——是否切由你根据车辆状态拍板，Skill 不做主。

### 场景 B：批量推送 App 到 OTA 测试分组（Step 5）

**以前（一台车 8~15 分钟）：**
打开 AMP → 输入 VIN → 找到该车型对应的测试分组号（组号要在各分组里翻，因为 X04B=`3000742`、X04C=`3000743` 这种编码要死记）→ 把 App 推进分组 → 重复 N 台。

**现在：**
```python
push.py add VIN1 VIN2 VIN3 --group 3000742   # 多辆车一次批量推
push.py groups --name X04B                    # 记不住组号？按关键字搜
```

一句话：**「批量推送」从『反复挑组 + 手打组号』变成『一次点名、按机型分组一把推进去』。**

---

## 三、两个"判断点"：它知道什么时候该闭嘴

把流程做成「一门到底」最大的顾虑是**自动过头**。所以切环境和推送两队都设成了**询问点——只问你不自动跑**：

- **Step 4 为什么问？** 车不在线的时候切了等于白切，车辆在不在只有你掌握实况。
- **Step 5 为什么问？** 推送是**额外操作**，推错会误伤测试环境其他同学，必须你确认。

一句话：**AI 把能自动的自动掉，把该由你拍板的还给你——这正是它敢『一条龙』的底气。**

---

## 四、怎么装上、怎么用起来

### 安装（一条命令串，4 个一起装）

```bash
/plugin marketplace add https://gitlab.chehejia.com/ai-market/lixiang-skills-marketplace.git
/plugin marketplace update lixiang-skills-marketplace

/plugin install cheyun-vehicle-migrate-prod-to-testtwo-push
/plugin install cheyun-vehicle-sync-prod-to-testtwo
/plugin install cheyun-lark-robert-whitelist-env
/plugin install cheyun-amp-batch-push-app

/reload-plugins
```

> 或到 AI Market 详情页复制安装命令发给 ClaudeCode 机器人即可。

**运行所需凭据：**

| 凭据 | 用在 | 怎么拿 |
| --- | --- | --- |
| `x-chj-gwtoken` | Step 1~2 查/同步 prod | licar.chehejia.com 的 F12 → Network |
| `lark-cli` + 进飞书群 | Step 3~4 白名单/切环境 | 先进罗伯特所在飞书群，再 `lark-cli auth login` |
| AMP Cookie | Step 5 批量推送 | testtwo 登录浏览器 Copy 最新 Cookie |

### 用法：一句话 / 命令

| 需求 | 这么说 |
| --- | --- |
| 先看整条流程与命令（推荐先跑） | `flow.py plan <VIN...>` |
| 看某一步怎么执行 | `flow.py step <4/5> <VIN...>` |
| 检查子 Skill 是否就位 | `flow.py list` |
| 直接开跑 | 「把这辆车迁到 testtwo，切环境，再推到测试分组」或 `flow.py run <VIN...>` |

---

## 五、提示与避坑

| 问题 | 信号 | 解法 |
| --- | --- | --- |
| 子 Skill 没装齐 | `flow.py list` 显示「缺」 | 补装完整 4 个插件，再 `/reload-plugins` |
| `x-chj-gwtoken` | 迁移报 401/403 | 重新从 licar F12 复制一份 |
| 白名单发不出去 | 找不到群聊/发送失败 | 先进罗伯特所在飞书群，再登录 |
| 推送报错 | `code 240420` | AMP Cookie 过期，重登 testtwo 替换 |

> 别背组号：`push.py groups --name <关键字>` 帮你搜，X04B=`3000742`、X04C=`3000743` 这种事让它记。

---

## 适合谁 / 不适合谁

**🎯 推荐：**

- 天天在 prod ↔ testtwo 之间切云端环境的测试同学
- 要给一批车做 OTA 推送、还要按车型分组的
- 想省"切环境回查 + 背组号"这种纯枯燥操作的人

**⚠️ 谨慎：**

- 对云端环境 / OTA 分组关系还不太熟的——先跑 `flow.py plan` 看清单
- 对"自动推送"还没把握——Step 5 有刹车点，先手动跑几回确认

---

## 下一步规划

- 📅 支持 **VIN 列表文件**：CSV 批量 100 台，统一汇总报告
- 📅 **流程日志落盘**：每步可回溯，排查不用重跑
- 📅 凭证改走**环境变量**：token/cookie 集中管理，不散在命令里

---

## 结语

**「切环境 + OTA 批量推送」这两件收尾活，是我在车云测试里最想交出去的两件事。** 它们不是难，是碎、是重复、是不小心就错。把规则的部分交给编排，把判断的部分留给自己，这台车云测试的日常才算真的顺了下来。

装好之后，在 Claude / LiClaw 里说一句就行：

> **「把这台车迁到 testtwo，切个环境，再推到 X04B 测试分组」**

🚗 完整编排 Skill：https://ai-market.chehejia.com/?page=skills&skill=ckqpipedmzv0phihh4el

---


