---
title: "EPT DSH"
date: 2026-09-03T09:00:00.000Z
authors:
  - bowen
tags:
  - AI
  - 开发工具
  - 工程实践
categories: AI 与 Agent
---
# EPT DSH

使用公司 EPT 模型时，保留凭据在 `$env:USERPROFILE\.dsh\.credentials.yaml`，不得打印 key、token、凭据内容、请求体或 Authorization 头。

<!-- more -->


## 路线选择

- `ept-copilot`：EPT Codex Responses API，直连 `https://portal-k8s-prod.ep.chehejia.com/api/copilot/codex/v1`，`api: openai-responses`，凭据引用 `EPT_CODEX_API_KEY`。
- `ept-claude`：EPT Claude Anthropic API。必须经本 Skill 的本机代理，`api: anthropic-messages`，`baseURL: http://127.0.0.1:8787`，凭据引用可保留为 `EPT_CLAUDE_AUTH_TOKEN`。

不要修改 DeepSeek Harness 源码来适配 EPT Claude。Anthropic SDK 默认发 `x-api-key`，而 EPT Claude 要求 `Authorization: Bearer`；本机代理负责转换。

## Claude 代理

先启动并确认代理，再启动 DSH：

```powershell
python "<skill-root>\scripts\start_ept_claude_proxy.py"
python "<skill-root>\scripts\start_ept_claude_proxy.py" --status
python "<skill-root>\scripts\test_ept_claude_proxy.py"
```

代理只监听 `127.0.0.1:8787`。每次请求读取 `%USERPROFILE%\.config\ept\auth_session.json` 的 `portal_token`，所以 EPT 登录态刷新后无需重启代理。代理不记录 prompt 或 token。

在 `$env:USERPROFILE\.dsh\settings.yaml` 中保留或添加：

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

`EPT_CLAUDE_AUTH_TOKEN` 只需是非空凭据；代理会丢弃 DSH 传来的 key，改用 EPT 当前 `portal_token`。缺少该 ref 时，把一个非敏感占位值保存为该 ref，或同步当前 EPT token。

## 启动 DSH

优先使用内置脚本；同一时间只启动一个 3080 Web 实例：

```powershell
python "<skill-root>\scripts\start_dsh.py" --npx
python "<skill-root>\scripts\start_dsh.py" --source --source-path "<dsh-source>"
python "<skill-root>\scripts\start_dsh.py" --status
python "<skill-root>\scripts\start_dsh.py" --stop
```

npx 命令：

```powershell
$env:DSH_HOME = Join-Path $env:USERPROFILE '.dsh'
npx --yes --package '@deepseek-ai/dsh@alpha' dsh web --no-open
```

源码命令必须在 DSH 仓库执行：

```powershell
$env:DSH_HOME = Join-Path $env:USERPROFILE '.dsh'
pnpm dsh web --no-open
```

始终使用 DSH 输出的完整 `?token=...` URL，不能只打开裸地址。

## 刷新 EPT Codex key

在 EPT 登录态已刷新、且当前 PowerShell 拿到 `EPT_CODEX_API_KEY` 后执行：

```powershell
python "<skill-root>\scripts\refresh_ept_key.py"
```

代理认证会读取 `%USERPROFILE%\.config\ept\auth_session.json`；也可通过环境变量 `EPT_AUTH_SESSION` 指定该文件路径。刷新脚本读取环境变量 `EPT_CODEX_API_KEY`。

该脚本只更新 `refs.EPT_CODEX_API_KEY`，保留 `EPT_CLAUDE_AUTH_TOKEN`、`CHJ_GATEWAY_API_KEY` 和 `records`。更新后重启 DSH Web。

## 排查

- Claude 401/403：先运行 `python scripts/test_ept_claude_proxy.py`。失败时让用户重新执行 EPT 登录或 `ept claude`；不要改 DSH 源码。
- Claude 代理端口冲突：`python scripts/start_ept_claude_proxy.py --stop` 后重启。
- DSH Web 端口冲突：`python scripts/start_dsh.py --stop` 后只启动一个实例。
- 浏览器 401：使用包含 token 的完整 URL。
- EPT `/models` 404：不是 provider 不可用的证据；使用已知模型 id。
- Codex 401/403：刷新 `EPT_CODEX_API_KEY`，运行刷新脚本，然后重启 DSH。

