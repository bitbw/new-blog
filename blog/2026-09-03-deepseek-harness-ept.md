---
title: "DeepSeek Harness 接入 EPT 模型指南"
date: 2026-09-03T09:00:00.000Z
authors:
  - bowen
tags:
  - AI
  - 开发工具
  - 工程实践
categories: AI 与 Agent
---
# DeepSeek Harness 接入 EPT 模型指南

🛠️ 工具分享 | 2026-09-03

**使用方式：把这篇文档丢给你电脑的 Agent（Codex、Claude 或其他），让 AI 帮你配置。**

## 推荐 Skill

在 AI 市场安装 **ept-dsh** Skill：

https://ai-market.chehejia.com/?page=skills&skill=vfmxzgyvvqvtm5mmvf4j&creatorUid=18211132604_64538&rankType=hot&pageSize=20

> ⚠️ 注意：这个 Skill 不是接入融合云网关，而是调用**你自己的 EPT LLM API**（EPT Codex Responses API / EPT Claude Anthropic API）。每次对话都从你自己的 EPT 额度中扣除，占用的是个人 EPT 用量，与融合云 Token 额度无关。想用公司融合云额度，请参考《DeepSeek Harness 接入融合云模型指南》。

## 效果

- 在 DSH 中使用 EPT 模型（如 baidu-deepseek-v4-flash）
- 一键启动 / 停止 / 查看 DSH Web（端口 3080）
- 一键启动 / 停止 / 测试 EPT Claude 本地代理（127.0.0.1:8787）
- 一键把 EPT Codex Key 刷新进 DSH 凭据

## 前置条件

- 已安装 DeepSeek Harness，`~/.dsh` 目录存在
- 已登录 EPT，`~/.config/ept/auth_session.json` 存在且含 `portal_token`
- 电脑已安装 Codex 或 Claude 客户端，可安装 Skill

## 第一步：安装 Skill

打开上面的 AI 市场链接安装 ept-dsh。安装后直接对你的 Agent 说「使用 ept-dsh 启动 DSH」即可。

## 第二步：配置 settings.yaml

编辑 `~/.dsh/settings.yaml`，在末尾追加 provider 配置。

走 **EPT Claude**（需要本机代理）：

```yaml
llm-pi-ai:
  providers:
    ept-claude:
      displayName: EPT Claude (Anthropic)
      apiKeyEnv: EPT_CLAUDE_AUTH_TOKEN
      api: anthropic-messages
      baseURL: http://127.0.0.1:8787
      models:
        - id: baidu-deepseek-v4-flash
          name: baidu-deepseek-v4-flash
```

走 **EPT Codex**（直连，无需代理）：

```yaml
llm-pi-ai:
  providers:
    ept-copilot:
      displayName: EPT Codex
      apiKeyEnv: EPT_CODEX_API_KEY
      api: openai-responses
      baseURL: https://portal-k8s-prod.ep.chehejia.com/api/copilot/codex/v1
      models:
        - id: baidu-deepseek-v4-flash
          name: baidu-deepseek-v4-flash
```

模型 id 以 EPT 实际提供的为准；/models 接口 404 不代表 provider 不可用，直接用已知模型 id 即可。

## 第三步：启动 EPT Claude 代理（仅 ept-claude 需要）

EPT Claude 要求 `Authorization: Bearer`，而 Anthropic SDK 默认发 `x-api-key`，所以 Skill 内置了本机代理做转换。把 `<skill-root>` 换成 Skill 实际安装路径（如 `~/.agents/skills/ept-dsh`）：

```powershell
python "<skill-root>\scripts\start_ept_claude_proxy.py"
python "<skill-root>\scripts\test_ept_claude_proxy.py"
```

代理只监听 127.0.0.1:8787；每次请求实时读取 EPT 登录态，登录态刷新后无需重启代理。

## 第四步：填入 / 刷新凭据

- **EPT Claude**：`~/.dsh/.credentials.yaml` 中添加 `EPT_CLAUDE_AUTH_TOKEN`。代理会忽略这个值，改用 EPT 当前 `portal_token`，所以填非空占位符即可。
- **EPT Codex**：EPT 登录态刷新后，在同一 PowerShell 会话确认 `EPT_CODEX_API_KEY` 环境变量已存在，然后执行：

```powershell
python "<skill-root>\scripts\refresh_ept_key.py"
```

该脚本只更新 `refs.EPT_CODEX_API_KEY`，保留其他凭据，并自动生成 `.bak-时间戳` 备份。更新后重启 DSH Web。

## 第五步：启动 DSH

```powershell
# npx 方式（推荐）
python "<skill-root>\scripts\start_dsh.py" --npx

# 源码方式
python "<skill-root>\scripts\start_dsh.py" --source --source-path "<dsh源码目录>"

# 查看 / 停止
python "<skill-root>\scripts\start_dsh.py" --status
python "<skill-root>\scripts\start_dsh.py" --stop
```

> 必须使用 DSH 输出的完整 `?token=...` 地址，不能只打开裸地址；同一时间只启动一个 3080 实例。

## 验证

```powershell
python "<skill-root>\scripts\start_ept_claude_proxy.py" --status
python "<skill-root>\scripts\test_ept_claude_proxy.py"
python "<skill-root>\scripts\start_dsh.py" --status
```

代理测试通过会输出 `EPT Claude proxy 通过：HTTP 200`。

## 关键参数说明

| 参数 | 值 | 说明 |
| --- | --- | --- |
| `baseURL` | `http://127.0.0.1:8787` | EPT Claude 本地代理地址 |
| `api` | `anthropic-messages` / `openai-responses` | 分别对应 Anthropic / OpenAI 兼容协议 |
| 代理端口 | 8787 | 仅监听 127.0.0.1 |
| DSH Web 端口 | 3080 | 同一时间单实例 |

## 回滚

```powershell
# 恢复备份（refresh 脚本自动生成）
Copy-Item "$env:USERPROFILE\.dsh\.credentials.yaml.bak-时间戳" "$env:USERPROFILE\.dsh\.credentials.yaml" -Force
```

删除 `settings.yaml` 中的 `ept-claude` / `ept-copilot` provider 节即可回到原状。

## 常见问题

**Q: 看不到 EPT 模型？** 检查 `settings.yaml` 缩进、凭据 ref 是否匹配、代理是否已启动。

**Q: Claude 401 / 403？** 先运行 `test_ept_claude_proxy.py`；失败则重新执行 EPT 登录或 `ept claude`，不要改 DSH 源码。

**Q: 代理或 DSH 端口冲突？** 先 `--stop`，再启动一个实例。

**Q: 浏览器打开 401？** 使用完整 `?token=...` URL。

**Q: 用这个 Skill 会扣费吗？** 会。它调用的是你自己的 EPT LLM API，所有请求从个人 EPT 额度中扣除；如需使用公司融合云额度，请改用融合云网关方案。
