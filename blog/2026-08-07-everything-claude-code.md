---
title: "🎯 Everything Claude Code（ECC）上手分享：给 Claude Code 装上「AI 操作系统」"
date: 2026-08-07T09:00:00.000Z
authors:
  - bowen
tags:
  - AI
  - 开发工具
  - 工程实践
categories: AI 工具
---
## 一个痛点开场

用 AI 干活干多了，我发现最扎心的不是"它写不出来"，而是这三件事：

一是**配置天天重来**。Claude Code 换了新会话就不认识你；CLAUDE.md、agents、hooks、rules 每个项目都要重新搭一遍，搭完上个项目的经验又带不过来。

二是**干完没人把关**。让 AI 并行拉起来跑得挺热闹，但「看起来都对」和「真的对」之间差一道独立检核。好几次交付物差点带病出门，就是少了这一道。

三是**没有章法**。想让 AI 先规划再动手、提交前自查、测试写规范……说一次管一次，换个说法它又忘了。

所以我就在想：能不能把「并行干活、常驻记忆、质量把关、越用越懂我、干活有章法」这几件事，打包成一个开箱即用的东西，不用每次重新解释？

**ECC（Everything Claude Code）就是这么长出来的。**

## 一句话说清它是什么

> **ECC 是一套「AI 编程工具的配置全家桶」——把 67 个专业子智能体、281 个技能、94 个命令、一套工程规约和安全审计，封装成插件，装进 Claude Code 就能直接用。**

它不是针对某个功能的增强，而是把 Claude Code 从"一个能写代码的对话窗口"，升级成一支**配置好的 AI 团队**。

**数据卡片（截至 2026-08，均可复现验证）：**

| 维度 | 数值 | 说明 |
| --- | --- | --- |
| 交付规模 | 67 代理 / 281 技能 / 94 命令 | 装完即得，不用自己造 |
| 社区规模 | ≈23.8 万 star / 3.6 万 fork | GitHub 热榜级开源项目 |
| 打磨时长 | 10+ 个月高强日常使用 | 作者真实产品开发里迭代出来 |
| 安全审计 | 1282 项测试 / 98% 覆盖 / 102 条规则 | AgentShield，黑客松产物 |
| 语言覆盖 | 12+ 种语言文档 | 含简体中文 README |
| 授权 | MIT | 自由使用、可改 |
| 背书 | Anthropic 黑客松获胜者 | 作者团队实战验证 |

一句话：**它解决的不是『AI 写不写得快』，而是『AI 写得稳不稳、有没有人把关、还记不记得你是谁』。**

## 我亲测下来，它到底好在哪

### 1. 开箱就是一支「AI 团队」🎯

不用自己写 planner、code-reviewer、tdd-guide——这些它都配好了：写大功能 `/ecc:plan`，改完 `/ecc:code-review`，构建挂了有 build-error-resolver，C++/Go/Rust 各有专属 reviewer。

一句话：**67 个 agent，就是一支现成的、各司其职的「虚拟团队」。**

### 2. 281 个技能 = 各技术栈的最佳实践直接抄

`frontend-patterns`、`backend-patterns`、`python-patterns`、`golang-patterns`……让 AI 输出的不是"能跑"，而是**符合该语言惯用法的代码**；`tdd-workflow` 把"先写测试"变成每次都会执行的流程。

一句话：**想少踩坑，就先装一套别人踩完坑沉淀出来的 patterns。**

### 3. 一套规约，让 AI 干活「有章法」

`rules/` 里是必须遵守的硬约束：代码风格、git 规范、80% 覆盖率、提交前安全自查。装完之后，不管开哪个项目，AI 都默认按这套标准干活。

一句话：**等于把团队的工程纪律，也"配置化"了。**

### 4. 跨会话记忆 + 持续学习：AI 终于记得我

hooks 自动在会话开始加载上下文、会话结束存状态；`/instinct-status` 能看 AI 学到了我哪些习惯，`/evolve` 把相关习惯聚合成技能。用久了是真的"越用越懂我"。

一句话：**新会话里它不再是个陌生人。**

### 5. AgentShield：给 AI 配置上个「安全锁」🤔

扫描 CLAUDE.md / settings.json / MCP / hooks，查密钥泄露、注入风险、权限过宽。一句话命令就能跑：

```bash
npx ecc-agentshield scan
```

一句话：**把 AI 接进生产之前，先让它自己给自己体检一遍。**

### 6. 不止 Claude Code：一套配置，多端通用

Claude Code / Codex / Cursor / OpenCode / Gemini 都能用——skills 和 rules 的资产可以带走，不被某个工具绑定。

## 怎么装上就用（完整教程）

### 前置条件

- Claude Code **v2.1.0+**（ECC 依赖新版插件钩子机制，太老会踩坑）

```bash
claude --version
```

### 方式一：插件安装（推荐，2 分钟）

```bash
/plugin marketplace add https://github.com/affaan-m/ECC
/plugin install ecc@ecc
```

> ⚠️ 早期文档见过 `everything-claude-code@everything-claude-code` 这种旧标识符，现在统一成 `ecc@ecc`，以仓库最新 README 为准。

### 方式二：手动安装（想完全掌握装哪些）

```bash
git clone https://github.com/affaan-m/ECC.git && cd ECC
npm install

# ⚠️ 关键一步：rules 不随插件分发，必须手动复制，否则「规约不生效」
mkdir -p ~/.claude/rules
cp -R rules/common ~/.claude/rules/
cp -R rules/typescript ~/.claude/rules/   # 按技术栈追加 python/golang 等
```

### 常用命令速查

| 命令 | 作用 |
| --- | --- |
| `/ecc:plan "需求"` | 实现前先规划拆解 |
| `/ecc:code-review` | 代码质量 + 安全检查 |
| `/ecc:build-fix` | 一键修构建错误 |
| `/security-scan` | AgentShield 审计配置安全 |
| `/skill-create` | 从当前仓库 git 历史生成自己的技能 |
| `/instinct-status` / `/evolve` | 看 AI 学会了什么 / 聚合成技能 |
| `/sessions` | 管理会话历史 |

### 三个容易踩的坑

1. **别叠加安装**：已用 `/plugin install` 就不要再跑 `install.sh --profile full` 或 `npx ecc-install`，会技能重复。
2. **MCP 别一下开太多**：工具开关太多会挤爆上下文窗口，每个项目实际启用 < 10 个。
3. **multi-* 命令需额外装运行时**：`/multi-plan` 这类要 `npx ccg-workflow` 初始化才可用。

## 适合谁 / 不适合谁

**🎯 推荐给：**

- 重度 Claude Code 用户——少写重复配置、让 AI 干活更规范
- 多语言 / 多项目开发——一套 skills/rules 通用所有技术栈
- 想把"写代码"外包给 AI、但还想保留工程判断力的人——规划 / 评审 / 安全这些"人的活"，它帮你兜底

**⚠️ 要谨慎的：**

- Claude Code 新手：67 个 agent + 281 个技能信息量巨大，建议先只装 rules + 几个常用 skill
- 不喜欢被规约束缚的人：它会"管教"AI 的行为，自由发挥型会觉得被唠叨
- 只想改一行代码就收工的人：完整规划流程有额外开销

## 看完立即做（10 分钟落地清单）✅

1. `claude --version` 确认 ≥ v2.1.0
2. `/plugin marketplace add https://github.com/affaan-m/ECC` + `/plugin install ecc@ecc`
3. 手动补 rules（`git clone` + `cp rules/common`、`rules/typescript` 到 `~/.claude/rules/`）
4. `npx ecc-agentshield scan` 给现有配置体检一遍
5. 随手试一下 `/ecc:plan "给当前项目加个用户认证"`

🚀 装上之后你会发现：**AI 干活的方式，从"你要什么我给什么"，变成了"我按工程标准帮你把关、把成果交给你验收"。**

---

**参考资料：**

- GitHub 仓库：[affaan-m/ECC](https://github.com/affaan-m/ECC) ｜ 官网：[ecc.tools](https://ecc.tools)
- 作者 [@affaanmustafa](https://x.com/affaanmustafa) 的官方精简指南 / 长文指南 / 安全指南
- 许可：MIT，可直接用、可改造，记得给个 star

> 本文为个人亲测分享，所有数字均可到仓库 README 复现验证。

---

提报人：张博文
