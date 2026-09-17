---
title: "Playwright MCP + Codex / Claude Code：让 AI 真正操作浏览器，而不是只会告诉你怎么点"
date: 2026-09-11T09:00:00.000Z
authors:
  - bowen
tags:
  - AI
  - 开发工具
  - 工程实践
categories: AI 与 Agent
---

浏览器自动化最容易出现一种“看起来已经完成”的假象：AI 给你写了一段 Playwright 代码，命令也执行成功了，但它并没有真正看到页面、点击按钮、填写表单，更没有确认页面最后到底变成了什么样。

<!-- more -->

Playwright MCP 解决的正是这一步。它把浏览器变成 coding agent 可以调用的工具，让 Codex、Claude Code 等工具能够：

- 打开网页并读取真实页面结构；
- 点击、输入、选择、滚动和上传文件；
- 观察页面变化并根据结果继续执行；
- 截图、生成页面快照，辅助定位问题；
- 在浏览器中验证“功能真的能用”，而不是只验证代码能运行。

这篇文章记录一套比较稳妥的使用方式：先配置 Playwright MCP，再让 Codex 或 Claude Code 负责理解需求，最后由浏览器执行和验收。

## 一句话理解 Playwright MCP

> Playwright MCP 是一个 MCP Server，负责把 Playwright 浏览器能力暴露给 AI 编程工具；Codex、Claude Code 负责决定下一步做什么。

可以把它理解为三层：

```text
你的自然语言需求
        ↓
Codex / Claude Code：分析目标、选择工具、判断结果
        ↓
Playwright MCP：打开浏览器、查找元素、执行操作
        ↓
真实网页或本地 Web 应用
```

它和传统的“让大模型生成一段 Playwright 脚本”不完全一样：

- 传统脚本主要是一次性执行固定步骤；
- Playwright MCP 更像一个可交互的浏览器操作员；
- Agent 可以根据页面实际结果继续决策，而不是把所有步骤提前写死。

## 它适合解决什么问题？

### 1. 验证 AI 生成的 Web 应用

让 Agent 打开本地页面，完成登录、表单提交、列表筛选和页面跳转，确认前端功能真的能用。

### 2. 处理必须经过网页的工作

例如：

- 在内部平台创建配置；
- 上传文件并确认解析结果；
- 操作飞书、GitHub、工单系统等网页；
- 读取没有开放 API 的后台页面；
- 检查发布后的页面和交互状态。

### 3. 辅助排查前端问题

当用户说“按钮点了没反应”时，Agent 可以实际打开页面，查看控制台、网络请求、页面状态和错误提示，再回到代码中修改。

### 4. 做浏览器回归验证

在完成代码修改后，让 Agent 按真实用户路径走一遍：登录 → 创建数据 → 编辑 → 删除 → 刷新确认。

## 安装 Playwright MCP

最简单的启动方式是使用 npm：

```bash
npx @playwright/mcp@latest
```

如果希望固定版本，建议在团队项目中锁定版本，而不是每次都自动获取最新版本：

```bash
npx @playwright/mcp@0.0.69
```

> 版本号只是示例。实际使用时，以 Playwright MCP 官方仓库和团队验证过的版本为准。

### 常用启动参数

```bash
npx @playwright/mcp@latest \
  --browser chrome \
  --headless \
  --output-dir .playwright-output \
  --allowed-hosts localhost 127.0.0.1
```

Windows PowerShell 可以写成一行：

```powershell
npx @playwright/mcp@latest --browser chrome --headless --output-dir .playwright-output --allowed-hosts localhost 127.0.0.1
```

几个最有用的参数：

| 参数 | 作用 |
| --- | --- |
| `--browser chrome` | 指定浏览器，也可以使用 `firefox`、`webkit` 或 `msedge` |
| `--headless` | 无界面运行，适合 CI 或后台任务 |
| `--extension` | 连接已经打开的 Chrome / Edge 浏览器，适合复用登录态 |
| `--output-dir <目录>` | 保存截图、快照和其他输出 |
| `--allowed-hosts <主机>` | 限制浏览器允许访问的主机 |
| `--storage-state <文件>` | 使用已保存的登录状态 |
| `--user-data-dir <目录>` | 指定浏览器用户数据目录 |
| `--secrets <文件>` | 从 dotenv 文件加载敏感配置 |
| `--caps vision,pdf,devtools` | 开启额外能力 |

## 在 Codex 中配置

当前 Codex CLI 支持通过 `codex mcp add` 添加 MCP Server。

### 直接添加 stdio Server

```bash
codex mcp add playwright -- npx -y @playwright/mcp@latest
```

如果使用 Extension mode，让 Playwright MCP 连接当前已经打开的浏览器：

```bash
codex mcp add playwright -- npx -y @playwright/mcp@latest --extension
```

Windows PowerShell 中，如果命令参数解析出现问题，可以显式使用 `cmd /c`：

```powershell
codex mcp add playwright -- cmd /c npx -y @playwright/mcp@latest --extension
```

查看已配置的 MCP：

```bash
codex mcp list
```

查看某个 Server 的详情：

```bash
codex mcp get playwright
```

删除配置：

```bash
codex mcp remove playwright
```

### 我更推荐的 Codex 配置

开发调试时使用 Extension mode，复用已经登录的浏览器：

```bash
codex mcp add playwright -- npx -y @playwright/mcp@latest --extension --browser chrome
```

CI 或无头任务使用独立浏览器：

```bash
codex mcp add playwright -- npx -y @playwright/mcp@latest --headless --browser chrome
```

实际参数以当前版本 `npx @playwright/mcp@latest --help` 输出为准。不要把登录 Cookie、Token 或带权限的浏览器配置提交到 Git。

## 在 Claude Code 中配置

Claude Code 常用的 MCP 配置方式是：

```bash
claude mcp add playwright -- npx -y @playwright/mcp@latest
```

使用 Extension mode：

```bash
claude mcp add playwright -- npx -y @playwright/mcp@latest --extension
```

查看 MCP 状态：

```bash
claude mcp list
```

如果团队希望把配置随项目一起管理，可以使用项目级 MCP 配置；如果只是个人浏览器和个人登录态，应该使用用户级配置。

> Claude Code 的具体参数可能随版本变化。配置失败时，先运行 `claude mcp --help`，再按照当前 CLI 的帮助信息调整。

## Extension mode 和独立浏览器，怎么选？

这是 Playwright MCP 最容易选错的地方。

### Extension mode：适合操作你已经登录的浏览器

```bash
npx @playwright/mcp@latest --extension
```

它的特点是：

- 可以复用现有 Chrome / Edge 页面；
- 通常可以复用已登录状态；
- 适合飞书、GitHub、企业内部系统等需要登录的网页；
- 更接近“让 Agent 帮我操作当前浏览器”。

缺点也很明显：

- 操作的是当前浏览器里的真实账号；
- Agent 可能看到当前页面能看到的敏感信息；
- 页面状态受人工操作影响，复现性不如独立浏览器。

### 独立浏览器：适合自动化和回归验证

```bash
npx @playwright/mcp@latest --headless --browser chrome
```

它的特点是：

- 浏览器环境更干净；
- 流程更容易复现；
- 适合 CI、测试环境和批量任务；
- 不会直接接管你正在使用的浏览器窗口。

缺点是：

- 通常需要重新登录；
- 可能需要额外配置测试账号和 `storage-state`；
- 某些依赖真实浏览器扩展、证书或企业网络的页面可能无法直接运行。

我的选择建议：

| 场景 | 推荐模式 |
| --- | --- |
| 调试内部网页、飞书文档、需要复用登录态 | Extension mode |
| 本地 Web 应用回归测试 | 独立浏览器 |
| CI / 定时任务 | Headless 独立浏览器 |
| 多人共享的自动化流程 | 独立浏览器 + 测试账号 |
| 生产账号操作 | 尽量不要直接交给 Agent |

## 一套可复用的工作方式

不要只对 Agent 说“帮我打开网页操作一下”。更稳定的提示词应该包含目标、范围、确认点和停止条件。

### 示例：验证本地应用

```text
请使用 Playwright MCP 验证当前项目的登录流程：

1. 启动并打开本地 Web 应用。
2. 使用测试账号登录，不要使用我的个人账号。
3. 检查登录失败、登录成功和刷新后的状态。
4. 创建一条测试数据，再编辑并删除它。
5. 每一步都说明页面实际结果。
6. 如果发现问题，先记录复现步骤和控制台错误，不要直接修改代码。
```

### 示例：排查按钮无响应

```text
请使用 Playwright MCP 复现“提交按钮点击后没有反应”：

- 先打开页面并确认当前 URL；
- 检查按钮是否可见、可用，以及是否被其他元素遮挡；
- 点击按钮后等待页面状态变化；
- 查看控制台错误和网络请求；
- 最后告诉我最可能的根因和证据。

在没有得到我确认之前，不要提交表单中的真实数据。
```

### 示例：验证发布后的页面

```text
请使用 Playwright MCP 验证这个发布地址：

- 页面是否能正常打开；
- 首屏标题、核心按钮和主要图片是否加载；
- 在桌面尺寸和移动尺寸下分别检查布局；
- 点击主要入口，确认跳转 URL；
- 不要执行删除、发布、支付或其他不可逆操作。
```

## Playwright MCP 不只是“点击器”

高质量使用的关键不是让 Agent 点击更多按钮，而是让它形成“观察 → 操作 → 验证”的闭环。

```text
观察页面结构
    ↓
确认目标元素和当前状态
    ↓
执行一个最小操作
    ↓
等待页面稳定
    ↓
读取结果或错误
    ↓
决定下一步
```

例如，不要直接连续执行：

```text
点击登录 → 填账号 → 点击提交 → 点击发布
```

更安全的方式是：

1. 先确认页面确实是登录页；
2. 确认输入框和按钮对应正确；
3. 填入测试账号；
4. 提交后确认登录成功；
5. 到达目标页面后，再判断是否允许继续发布。

这也是 MCP 和普通脚本的差异：每一步都应该根据页面真实状态决定下一步，而不是盲目执行固定坐标。

## 安全边界：浏览器权限比代码权限更危险

Playwright MCP 可以操作真实网页，因此风险不只来自代码，也来自浏览器当前拥有的权限。

### 1. 不要默认使用个人生产账号

优先使用：

- 测试账号；
- 最小权限账号；
- 仅允许测试租户或测试项目的账号；
- 可以随时撤销的临时登录态。

### 2. 限制允许访问的域名

不要随意使用：

```bash
--allowed-hosts '*'
```

更推荐限定到实际需要的域名：

```bash
npx @playwright/mcp@latest \
  --allowed-hosts localhost 127.0.0.1 example.test
```

### 3. 对不可逆操作设置人工确认

以下操作不应该让 Agent 默认执行：

- 发布生产版本；
- 删除数据；
- 发消息、发邮件；
- 提交审批；
- 购买、支付或变更权限；
- 修改线上配置；
- 上传含敏感信息的文件。

可以让 Agent 做到“执行前停下来报告目标、参数和影响范围”，由人确认后再继续。

### 4. 不要提交浏览器状态文件

以下文件可能包含登录态或敏感信息，不要提交到仓库：

```text
storage-state.json
cookies.json
.playwright-mcp/
playwright-*.log
截图、HAR 文件和浏览器用户目录
```

建议加入 `.gitignore`：

```gitignore
.playwright-mcp/
.playwright-output/
playwright-*.log
storage-state*.json
```

## 常见问题

### MCP 已配置，但 Agent 看不到浏览器

检查这几件事：

1. MCP Server 是否正在运行；
2. Codex 或 Claude Code 是否已经重启并加载了配置；
3. Extension mode 是否真的连接到了浏览器；
4. 浏览器扩展和 MCP Server 是否使用了匹配的连接方式；
5. 是否有多个旧的 Playwright MCP 进程占用端口。

### 页面可以打开，但登录状态丢了

这是独立浏览器的正常现象。可以选择：

- 改用 Extension mode；
- 使用测试环境登录；
- 配置 `--storage-state`；
- 使用专门的用户数据目录；
- 不要复制个人生产环境 Cookie 到共享项目。

### Agent 一直重复读取页面

通常有三个原因：

- 页面还没有稳定；
- 目标元素的状态没有明确验证；
- 上下文中启用了太多浏览器工具或调试能力。

可以在提示词中加入明确的停止条件：

```text
如果连续两次读取页面后状态没有变化，停止操作并报告当前 URL、页面标题和最后一次工具结果。
```

### 页面打开了，但无法上传本地文件

优先检查：

- 当前 MCP 是否允许访问工作区文件；
- 文件路径是否使用绝对路径；
- 页面是否真的存在 `input[type=file]`；
- 当前浏览器是否由 Extension mode 接管；
- 文件是否位于允许访问的工作区范围内。

上传前不要把 Token、Cookie、私钥或内部配置文件作为测试文件。

## 我推荐的最小配置

如果只是日常用 Codex 或 Claude Code 操作网页，可以从这一套开始：

```bash
# Codex：开发调试，复用当前浏览器登录态
codex mcp add playwright -- npx -y @playwright/mcp@latest --extension

# 查看配置
codex mcp list
```

如果要做自动化回归：

```bash
# Codex：独立无头浏览器
codex mcp add playwright-ci -- npx -y @playwright/mcp@latest --headless --browser chrome --output-dir .playwright-output
```

然后在项目的 `AGENTS.md` 或团队约定中写清楚：

- 哪些地址可以访问；
- 使用哪个测试账号；
- 哪些操作必须人工确认；
- 测试数据如何清理；
- 验收成功的判断标准；
- 失败后需要保留哪些证据。

## 最后：让 Agent 操作浏览器，但不要把判断权完全交出去

Playwright MCP 的价值，不是把鼠标和键盘交给 AI，而是让 AI 获得了一个可以观察真实世界的执行工具。

真正稳定的组合是：

> Codex / Claude Code 负责理解任务和提出下一步，Playwright MCP 负责执行浏览器操作，人负责权限边界和最终确认。

如果只是把 MCP 工具全部打开，再让 Agent 自由点击，得到的很可能是一个“操作很快、风险也很快”的自动化流程。

更好的方式是从三个原则开始：

1. **先观察，再操作。**
2. **一次只做一个可验证动作。**
3. **不可逆操作必须人工确认。**

🚀 当这三个原则变成习惯后，Playwright MCP 才真正从“浏览器遥控器”变成了 coding agent 的浏览器执行层。

## 参考资料

- [Playwright MCP 官方仓库](https://github.com/microsoft/playwright-mcp)
- [Playwright MCP 官方文档](https://playwright.dev/docs/test-agents)
- [Codex CLI MCP 命令帮助](https://developers.openai.com/codex/cli/reference/)
- [Claude Code MCP 文档](https://docs.anthropic.com/en/docs/claude-code/mcp)

