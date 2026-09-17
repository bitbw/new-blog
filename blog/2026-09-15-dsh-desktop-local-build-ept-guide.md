---
title: "DeepSeek Harness 桌面版安装使用指南"
date: 2026-09-15T09:00:00.000Z
authors:
  - bowen
tags:
  - AI
  - 开发工具
  - 工程实践
categories: AI 与 Agent
---

## Summary

这是一篇保姆级教程 🧭：从「去哪下载源码」开始，一步步带你在 Windows 上把 DeepSeek Harness（以下简称 DSH）桌面端构建起来、启动成功，再按需加上快捷方式或接入公司 EPT 模型。每一步都有命令、有预期现象、有排错提示，照着抄就能跑通。

**项目地址先记住**（后面所有命令都在这个仓库里运行）：

📌 **DSH 官方源码仓库：https://github.com/deepseek-ai/deepseek-harness**

找不到仓库、找不到技能、找不到脚本？直接翻下面的 [资源地址](#资源地址) 一节，全部列好。

⚠️ 本文不包含任何真实用户名、API Key、portal token、Authorization 内容或公司项目固定路径。所有示例路径（如 `D:\dev\deepseek-harness`）都可以换成你自己的目录。

## Table of Contents

- [资源地址](#资源地址)
- [本文约定](#本文约定)
- [适用场景](#适用场景)
- [第 1 步：准备软件环境](#第-1-步准备软件环境)
- [第 2 步：下载 DSH 源码](#第-2-步下载-dsh-源码)
- [第 3 步：安装依赖](#第-3-步安装依赖)
- [第 4 步：构建并启动桌面端](#第-4-步构建并启动桌面端)
- [第 5 步（可选）：创建 Windows 快捷方式（双击一键打开）](#第-5-步可选创建-windows-快捷方式双击一键打开)
- [第 6 步（可选）：接入 EPT 模型](#第-6-步可选接入-ept-模型)
- [第 7 步：按顺序验证](#第-7-步按顺序验证)
- [常见问题](#常见问题)
- [运行原理](#运行原理)
- [总结](#总结)
- [验证记录](#验证记录)
- [相关阅读](#相关阅读)
- [Dev Note](#dev-note)

## 资源地址

| 用途 | 地址 |
| --- | --- |
| DSH 官方源码仓库（本文所有命令都在这） | https://github.com/deepseek-ai/deepseek-harness |
| DSH 官方发布页（如果官方发布了可运行安装包） | https://github.com/deepseek-ai/deepseek-harness/releases |
| ept-dsh 技能安装地址（内部 AI 市场，可选 EPT 章节用） | https://ai-market.chehejia.com/?page=skills&skill=vfmxzgyvvqvtm5mmvf4j&creatorUid=18211132604_64538&rankType=hot&pageSize=20 |
| Oh-My-DSH 插件聚合社区 | https://github.com/like-study1/Oh-My-DSH |
| Awesome DSH Plugin 精选插件列表 | https://github.com/awesome-dsh-plugin/awesome-dsh-plugin |
| Node.js 官网（下载 LTS 版） | https://nodejs.org |
| Git 官网 | https://git-scm.com |
| pnpm 官网 | https://pnpm.io |
| npmmirror 镜像（国内下载加速） | https://npmmirror.com |

> 💡 只想体验已发布版本、不想折腾构建？先去官方发布页找直接可运行的发布包。本文的源码方式适合需要看日志、调试、改桌面端或接入本地技能的读者。

## 本文约定

为了不迷路，先约定两个路径符号，后面全文统一使用：

- `<dsh-source>`：DSH 源码根目录。本文示例统一用 `D:\dev\deepseek-harness`；如果你克隆到别的目录，把命令里这个路径换成你自己的即可。
- `<skill-root>`：ept-dsh 技能的本地安装目录，只在可选 EPT 章节用到。示例：`$env:USERPROFILE\.agents\skills\ept-dsh`（即 `C:\Users\你的用户名\.agents\skills\ept-dsh`）。技能装在其他位置就用实际目录替换。

## 适用场景

当需要在 Windows 本地运行 DeepSeek Harness 桌面应用，或者希望把公司 EPT 模型接入桌面端时，使用本文。本文优先采用源码构建方式，适合需要调试、查看日志和使用最新源码的场景。

- 如果你是**第一次接触**：按第 1 步到第 4 步顺序走一遍即可；快捷方式（第 5 步）和 EPT（第 6 步）都是可选的，按需再看。
- 如果你**已经跑通桌面端**：直接看第 6 步（可选 EPT 接入）和第 7 步（验证）。
- 如果你**遇到问题**：直接跳到[常见问题](#常见问题)对号入座。

## 第 1 步：准备软件环境

### 需要装什么

| 软件 | 用途 | 从哪下载 |
| --- | --- | --- |
| Windows PowerShell | 执行命令（Win11 自带的 Windows Terminal 也可以用） | 系统自带 |
| Git | 克隆源码 | https://git-scm.com |
| Node.js | 运行构建脚本，版本要满足仓库 `package.json` 的 `engines` 要求 | https://nodejs.org |
| pnpm | 安装依赖，版本要与仓库 `packageManager` 声明一致 | `npm install -g pnpm` 或激活 corepack |

### 验证是否装好

打开 PowerShell，依次执行下面三条命令：

```powershell
node --version
pnpm --version
git --version
```

预期看到类似输出（版本号以你本机为准）：

```text
v20.x.x
10.x.x
git version 2.x.x
```

如果哪条命令报「无法将项识别为 cmdlet、函数、脚本文件或可运行程序」，说明对应软件没装或没加入 PATH，回上表下载安装后重新打开 PowerShell 再验证。

> ⚠️ Node 和 pnpm 的**具体版本要求以仓库根目录 `package.json` 为准**，不要想当然装最新版。克隆完源码后，在仓库根目录执行下面命令即可看到要求：

```powershell
$pkg = Get-Content -Raw package.json | ConvertFrom-Json
"packageManager = " + $pkg.packageManager
"engines        = " + ($pkg.engines | ConvertTo-Json -Compress)
```

### 国内网络加速（可选，推荐）

首次安装会下载大量依赖和 Electron 二进制，网络慢时建议先设置镜像：

```powershell
# 依赖走 npmmirror 镜像
pnpm config set registry https://registry.npmmirror.com

# Electron 二进制走镜像（在要安装依赖的那个 PowerShell 会话里设置）
$env:ELECTRON_MIRROR = 'https://npmmirror.com/mirrors/electron/'
```

## 第 2 步：下载 DSH 源码

### 方式 A：用 Git 克隆（推荐）

把下面命令里的 `D:\dev\deepseek-harness` 换成你想放源码的目录（目标目录不存在会由 git 自动创建）：

```powershell
git clone https://github.com/deepseek-ai/deepseek-harness.git D:\dev\deepseek-harness
Set-Location D:\dev\deepseek-harness
```

- 第一行：把官方仓库完整克隆到本地，这就是后面的 `<dsh-source>`。
- 第二行：进入仓库根目录，后续所有命令都在这里执行。

如果已经有源码目录，进入该目录更新到最新：

```powershell
Set-Location D:\dev\deepseek-harness
git pull --ff-only
```

### 方式 B：下载 ZIP 源码包

如果 Git 克隆慢或失败（内网/代理问题），可以打开 https://github.com/deepseek-ai/deepseek-harness ，点绿色 **Code** 按钮 → **Download ZIP**，解压到本地目录。

注意：解压出来的目录名可能带 `-main` 或 `-master` 后缀，解压后要**进入包含 `package.json` 和 `pnpm-workspace.yaml` 的那一层**再执行命令。

### 确认在仓库根目录

不论用哪种方式，先确认位置对了：

```powershell
Get-ChildItem package.json, pnpm-workspace.yaml
```

预期输出这两个文件的名字：

```text
package.json
pnpm-workspace.yaml
```

如果找不到这些文件，说明当前目录不是仓库根目录，别继续，先 `cd` 进去。

## 第 3 步：安装依赖

在仓库根目录执行：

```powershell
pnpm install
```

- 这一步会下载 workspace 依赖、原生包和前端构建产物，**首次执行比较久（几分钟到十几分钟），耐心等，不要中途 Ctrl+C**。
- 什么算成功：命令走到最后没有红色 error，一般会看到 `Done in xxx` 之类的收尾输出。

源码更新后如果遇到旧构建产物、插件入口或类型导出错误，先清理再安装：

```powershell
pnpm run clean
pnpm install
```

> ⚠️ 不要通过修改源码或禁用插件来绕过旧构建产物问题；遇到 `MISSING_EXPORT` 类报错请先走「清理 → 重装 → 重新构建」流程，详见[常见问题](#常见问题)。

## 第 4 步：构建并启动桌面端

### 首次构建并启动

在仓库根目录执行：

```powershell
Set-Location D:\dev\deepseek-harness
pnpm run clean
pnpm dev:desktop
```

- `pnpm run clean`：清掉旧构建产物，避免残留文件干扰（首次执行可以省略，但执行了更稳妥）。
- `pnpm dev:desktop`：构建桌面主进程、Host、客户端插件和 Web 前端，并启动 Electron 开发桌面端。**同样比较久，第一次以弹出 Electron 窗口为成功标志。**

### 之后用已有构建产物快速启动

构建产物存在的情况下，之后每次启动用：

```powershell
Set-Location D:\dev\deepseek-harness
pnpm start:desktop
```

### 设置 DSH 用户目录（重要）

DSH 用 `DSH_HOME` 环境变量定位用户级设置、凭据、会话和任务数据（也就是 `settings.yaml` 所在的目录）。**不设置的话，桌面开发脚本可能使用一个隔离的 development home，桌面端就读取不到你已有的 provider、模型和会话配置。**

建议启动前显式设置（每次新开 PowerShell 都要设置一次，这就是后面快捷方式存在的意义）：

```powershell
$env:DSH_HOME = Join-Path $env:USERPROFILE '.dsh'
Set-Location D:\dev\deepseek-harness
pnpm start:desktop
```

- 第一行：把 DSH 用户目录指向 `C:\Users\你的用户名\.dsh`。
- 首次使用时 `.dsh` 目录可以由 DSH 自动创建；已经有配置的用户应确保它指向包含 `settings.yaml` 的目录。

### 怎么判断启动对了

启动日志应显示类似内容：

```text
desktop development: DSH_HOME=C:\Users\<用户名>\.dsh
```

如果日志里显示的是 `apps\desktop\.desktop-build\development\home`，说明当前进程**没有**使用你的用户 DSH 目录——停掉进程，重新设置 `DSH_HOME` 后再启动。

## 第 5 步（可选）：创建 Windows 快捷方式（双击一键打开）

这一步是**可选的**：不需要桌面快捷方式的话，直接跳到[第 6 步（可选）](#第-6-步可选接入-ept-模型)或[第 7 步](#第-7-步按顺序验证)即可，DSH 桌面端本身已经能在第 4 步成功运行。

需要的话继续：每次开 PowerShell 手动敲三行太麻烦，创建一个桌面快捷方式，以后双击即可。

快捷方式本质是三件事：

- 目标程序：Windows PowerShell。
- 工作目录：DSH 源码根目录。
- 启动命令：先设置 `DSH_HOME`，再执行 `pnpm start:desktop`。

### 推荐的启动命令（先手动验证一遍）

把路径换成你自己的源码目录，在 PowerShell 里试跑一次，确认这个命令能正常打开桌面端：

```powershell
$env:DSH_HOME = Join-Path $env:USERPROFILE '.dsh'
Set-Location 'D:\dev\deepseek-harness'
pnpm start:desktop
```

⚠️ 环境变量赋值必须写成 `$env:DSH_HOME = ...`。不要写成 `=...`，后者会被 PowerShell 当作命令执行，并出现「无法将项识别为 cmdlet、函数、脚本文件或可运行程序」的错误。

### 用 PowerShell 一键创建 `.lnk`

把下面脚本里的 `$dshSource` 改成你的源码目录，整体复制到 PowerShell 里执行：

```powershell
$dshSource = 'D:\dev\deepseek-harness'   # ← 改成你的源码目录
$shortcutPath = Join-Path ([Environment]::GetFolderPath('Desktop')) 'DSH 桌面版.lnk'
$iconPath = Join-Path $dshSource 'apps\web\public\favicon.ico'
$command = "& { `$env:DSH_HOME = (Join-Path `$env:USERPROFILE '.dsh'); Set-Location '$dshSource'; pnpm start:desktop }"

$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = Join-Path $env:WINDIR 'System32\WindowsPowerShell\v1.0\powershell.exe'
$shortcut.Arguments = "-NoProfile -ExecutionPolicy Bypass -Command `"$command`""
$shortcut.WorkingDirectory = $dshSource
if (Test-Path -LiteralPath $iconPath) { $shortcut.IconLocation = "$iconPath,0" }
$shortcut.Description = '启动 DSH 桌面版'
$shortcut.Save()

Write-Output "已创建：$shortcutPath"
```

执行完桌面会出现「DSH 桌面版」快捷方式。**双击验证：先闪一个 PowerShell 窗口 → 日志出现 `DSH_HOME=...\.dsh` → Electron 窗口打开**，就成功了。

### 图标相关的坑

- 如果官方源码只有 SVG 图标，先把它转成 ICO，或使用一个包含 16、24、32、48、64、128、256 像素的多尺寸 ICO。单独把 16 或 32 像素图片放大成 ICO，会导致桌面图标模糊。
- Windows 会缓存旧图标。替换 ICO 后按 `F5` 刷新桌面；仍未更新时，重启 Windows 资源管理器，或将快捷方式指向一个新的 ICO 文件名。

## 第 6 步（可选）：接入 EPT 模型

不接 EPT 时，直接使用 DSH 已配置的默认模型即可，本章可以跳过。

EPT 接入**不需要修改 DeepSeek Harness 源码**，只需要按 `ept-dsh` 技能操作。先用资源地址里的链接在 AI 市场安装 **ept-dsh** 技能，安装后把技能实际安装目录记为 `<skill-root>`（示例：`$env:USERPROFILE\.agents\skills\ept-dsh`）。

常用路线有两条：

- `ept-copilot`（EPT Codex）：使用 EPT Codex Responses API，直连，无需本地代理。
- `ept-claude`（EPT Claude）：使用 EPT Claude Anthropic API，通过本机代理把 DSH 的 `x-api-key` 请求转换为 EPT 要求的 `Authorization: Bearer` 请求。

⚠️ 不要把技能中的凭据文件内容复制到本文档或任何分享出去的文档里。

### 接入 EPT Codex

EPT Codex provider 通常使用：

```yaml
api: openai-responses
```

并通过 `EPT_CODEX_API_KEY` 引用凭据。凭据应由 EPT 登录或刷新脚本写入用户凭据存储，不要把真实 key 写入 `settings.yaml`、快捷方式参数或项目文件。

当 EPT 登录态刷新后，按技能脚本刷新 Codex key：

```powershell
python '<skill-root>\scripts\refresh_ept_key.py'
```

刷新后重启 DSH 桌面端，让 provider 重新读取配置。

### 接入 EPT Claude

先启动本机代理（默认监听 `http://127.0.0.1:8787`）：

```powershell
python '<skill-root>\scripts\start_ept_claude_proxy.py'
python '<skill-root>\scripts\start_ept_claude_proxy.py' --status
python '<skill-root>\scripts\test_ept_claude_proxy.py'
```

代理从 EPT 登录态中读取当前 `portal_token`，因此登录态刷新后通常不需要重启代理。代理不应记录 prompt、token 或 Authorization 内容。

EPT Claude provider 的关键字段如下：

```yaml
llm-pi-ai:
  providers:
    ept-claude:
      displayName: EPT Claude (Anthropic)
      apiKeyEnv: EPT_CLAUDE_AUTH_TOKEN
      api: anthropic-messages
      baseURL: http://127.0.0.1:8787
      models:
        - id: <model-id>
          name: <model-name>
```

💡 凭据怎么填：在 DSH 用户目录（`DSH_HOME` 指向的目录）的 `.credentials.yaml` 中加入 `EPT_CLAUDE_AUTH_TOKEN`，填**任意非空占位值**即可。本机代理会忽略这个值、改用 EPT 当前登录态完成真实认证，所以绝不把真实 token 写进任何配置文件。

### 同步 EPT Claude 模型

EPT Claude 代理提供模型目录接口：

```text
GET http://127.0.0.1:8787/v1/models
```

使用技能中的同步脚本把当前模型目录写入 DSH 设置：

```powershell
python '<skill-root>\scripts\sync_ept_claude_models.py'
```

同步脚本会在覆盖设置前创建备份。模型目录变化后重新同步，并重启桌面端。DSH 桌面端的模型选择器读取本地 provider catalog；**不能假设**它每次启动都会自动把远端 `/v1/models` 写回 `settings.yaml`。

## 第 7 步：按顺序验证

启动 DSH 前，按下面顺序检查，每一条都通过再进下一步：

1. 确认 `DSH_HOME` 指向预期用户目录（看启动日志，参考[第 4 步](#第-4-步构建并启动桌面端)）。
2. 确认 EPT Claude 代理的 `--status` 正常（仅接 Claude 时需要）。
3. 运行 `test_ept_claude_proxy.py`，确认代理能够返回成功响应（仅接 Claude 时需要）。
4. 确认 `settings.yaml` 是合法 YAML，模型项缩进正确。
5. 重启 DSH 桌面端，在模型选择器中检查 provider 和模型。
6. 发送一个最小测试请求；⚠️ 不要在日志中打印凭据或完整请求头。

合法的模型列表格式（注意 `- id` 与 `name` 同级缩进）：

```yaml
models:
  - id: <model-id>
    name: <model-name>
```

不要写成下面这样（`name` 少缩进了两格，会报 `BAD_INDENT`）：

```yaml
models:
  - id: <model-id>
  name: <model-name>
```

## 常见问题

### git clone 很慢或失败

先确认能访问 GitHub（网络/代理）。公司内网环境可配置 Git 代理后重试；仍然不行就改用[方式 B：下载 ZIP](#方式-b下载-zip-源码包)，下载速度通常更稳定。

### Electron 下载超时或卡住

安装依赖时给 Electron 指定镜像（在要执行 `pnpm install` 的 PowerShell 会话里）：

```powershell
$env:ELECTRON_MIRROR = 'https://npmmirror.com/mirrors/electron/'
pnpm install
```

### pnpm install 网络报错

设置 npmmirror 镜像后重试：

```powershell
pnpm config set registry https://registry.npmmirror.com
pnpm install
```

### 首次构建很久

正常。`pnpm dev:desktop` 要同时构建桌面主进程、Host、客户端插件和 Web 前端，第一次十几分钟都不奇怪。只要最终弹出 Electron 窗口就是成功；中途不要 Ctrl+C。

### 模型列表中没有 EPT

检查启动日志中的 `DSH_HOME`，再检查该目录的 `settings.yaml` 是否包含 EPT provider。修改配置后重启桌面端。

### `settings.yaml` 报 `BAD_INDENT`

先停止 DSH，恢复最近的 `settings.yaml.bak-*` 备份，再检查 YAML 列表项是否按两级缩进。**不要**直接删除整个 `.dsh` 目录，其中可能包含任务和会话数据。

### 出现 `MISSING_EXPORT` 或插件入口缺失

通常是旧构建产物残留。回到仓库根目录执行：

```powershell
pnpm run clean
pnpm dev:desktop
```

### 调试端口被占用

关闭残留的 Electron 进程后重试。只结束属于 DSH 源码目录的进程，避免误杀其他 Electron 应用。

### EPT Claude 返回 401 或 403

先检查 EPT 登录态和本机代理：

```powershell
python '<skill-root>\scripts\start_ept_claude_proxy.py' --status
python '<skill-root>\scripts\test_ept_claude_proxy.py'
```

如果代理测试失败，按公司 EPT 登录流程重新登录；不要修改 DSH 源码，也不要把 portal token 填进桌面端界面。

### PowerShell 启动后使用了错误的 DSH 目录

检查启动命令中是否有正确的 `$env:DSH_HOME = ...`。如果日志仍显示 development home，删除旧快捷方式并重新创建，避免继续使用旧的错误参数。

## 运行原理

如果想知道「为什么这么配」，简单讲一下：

DSH 桌面端由 Electron 主进程、桌面 Host、Web 客户端和 Cordis plugin tree 组成。启动脚本负责构建或加载桌面产物；`DSH_HOME` 负责选择用户级设置、凭据、会话和任务目录。

EPT Codex 通过 OpenAI Responses provider 访问 EPT。EPT Claude 通过 `ept-claude` provider 访问本机代理；代理读取 EPT 登录态，把 Anthropic Messages API 的认证方式转换成 EPT 要求的 Bearer 认证。模型同步脚本把远端模型目录转换为 DSH provider 的本地 `models` 配置。

快捷方式本身不保存模型或 token，只保存 PowerShell 启动命令、工作目录和图标路径。凭据应留在用户级 DSH 或 EPT 登录态目录。

## 总结

- 源码与资源全部在官方仓库：https://github.com/deepseek-ai/deepseek-harness ，找不到就去[资源地址](#资源地址)查表。
- 构建链路就三步：克隆 → `pnpm install` → `pnpm dev:desktop`；日常启动只用 `pnpm start:desktop`。
- 所有「读不到配置」的问题，先检查 `DSH_HOME` 和启动日志。
- EPT 接入不动源码，跟着 `ept-dsh` 技能走；凭据只进用户级凭据存储，不进文档。

## 验证记录

本文关键命令已在 Windows PowerShell 环境验证：

- `pnpm install`、`pnpm run clean` 和 `pnpm dev:desktop` 用于源码安装和构建。
- `pnpm start:desktop` 在设置 `DSH_HOME` 后可以启动本地桌面端。
- PowerShell 快捷方式命令可以正确设置 `DSH_HOME` 并切换到仓库根目录。
- EPT Claude 技能的代理状态、代理测试和模型同步命令可用于可选 EPT 接入。
- 文档示例不包含真实凭据。

## 相关阅读

- `<skill-root>\SKILL.md`：EPT Codex、EPT Claude、本机代理、凭据刷新和排查命令。
- `<dsh-source>\apps\desktop\README.md`：桌面端开发目录、运行时资源和构建说明。
- `<dsh-source>\docs\config-catalog.md`：provider 配置字段和设置目录。
- 《DeepSeek Harness 必装的 10 个插件》：安装完桌面端后，想看更多玩法可以读这篇。

## Dev Note

本文是跨环境的安装与接入指南。实际仓库版本、Node/pnpm 版本、EPT provider 字段和脚本行为发生变化时，应以当前 DSH 源码（https://github.com/deepseek-ai/deepseek-harness ）和 `ept-dsh` 技能为准；不要把某台机器的绝对路径、模型列表或临时凭据固化到本文档。