---
title: "DSH 接入公司 LLM —— 集成工程"
date: 2026-08-31T09:00:00.000Z
authors:
  - bowen
tags:
  - AI
  - 开发工具
  - 工程实践
categories: AI 与 Agent
---
# DSH 接入公司 LLM —— 集成工程

> 目标：把公司内部 LLM 接口接进 DeepSeek Harness 直接用。
> 结论：**主路线（chj-gateway / deepseek-v4）已经在用**；本目录补全模型清单，并新增
> **EPT Copilot（GPT-5.6，Responses API）** 作为第二 provider（路线 C）。

<!-- more -->


---

## 一、现状盘点（已侦察确凿）

| 项 | chj-gateway（已有，主力） | ept-copilot（本次新增） |
|---|---|---|
| 端点 | `https://llm-gateway-proxy.inner.chj.cloud/llm-gateway/v1` | `https://portal-k8s-prod.ep.chehejia.com/api/copilot/codex/v1` |
| 协议 | `openai-completions`（标准 Chat Completions） | `openai-responses`（EPT/Codex 用的 Responses API） |
| 鉴权 | `CHJ_GATEWAY_API_KEY`（已在 `.credentials.yaml`） | `EPT_COPILOT_TOKEN`（需获取，见下） |
| 模型示例 | `kivy-deepseek-v4-flash-0731` / `kivy-deepseek-v4-pro` / `kivy-glm5` / `kivy-kimi-k2_6` ▲ | `azure-gpt-5_6-luna` / `sol` / `terra` |
| 现状 | ✅ 已配好，本会话正在用它跑 `kivy-deepseek-v4-flash-0731` | ❌ 未接入 |

▲ 完整模型清单请在本机连 VPN 后用 `verify.ps1` 拉取（网关 `/v1/models`）。

---

## 二、一句话的 EPT 机制解析

`ept codex` 做的事：用 `auth_session` 登录态 → 从企业 copilot 拉取配置 → 通过环境变量注入
`base_url + API key`（`EPT_CODEX_API_KEY`）→ 启动 Codex，Codex 走 **`.../api/copilot/codex/v1/responses`**。
也就是说公司 LLM 的“钥匙”是 **portal 域名的 Bearer 令牌**（`auth_session.json` 里的
`access_token` / `portal_token` 二选一，见 `verify.ps1` 探测结果）。

---

## 三、目录文件

```
dsh-ept-integration/
├── README.md             # 本文件
├── provider-merge.yml    # 两个 provider 的配置片段（合并目标）
├── verify.ps1            # ① VPN 终端先跑：拉 chj 模型 + 探测 ept 可用令牌
├── apply.ps1             # ② 备份+安全合并进 $DSH_HOME/settings.yaml
└── refresh-ept-key.ps1   # ③ （可选）刷新/写入 ept 令牌到 credentials
```

---

## 四、操作步骤

### 第 1 步（重要）：先探测，别急着改

在你的**正常终端**（已连公司 VPN）里跑：

```powershell
powershell -ExecutionPolicy Bypass -File D:\bowen\git-project\dsh-ept-integration\verify.ps1
```

它会（只读，绝不打印密钥值）：
1. 用 `CHJ_GATEWAY_API_KEY` 拉 `llm-gateway-proxy.../v1/models` → 打印真实模型 id 列表；
2. 依次用 `auth_session.json` 的 `access_token`、`portal_token` 作为 Bearer 探测
   `portal-k8s-prod.../api/copilot/codex/v1/models` → 打印**哪一个令牌被接受**（HTTP 200 即为通过），并在通过时打印该端点可用的模型 id。

> 把这两份“模型 id 列表”和“通过的令牌名”回贴给我，我再据此**定稿 `provider-merge.yml` 里的模型清单**（不要凭我给的那几个猜测字段，要以网关真实返回为准）。

### 第 2 步：合并配置到 DSH

确认 `provider-merge.yml` 里的模型/令牌符合第 1 步结果后：

```powershell
# 先看差量预览（不写盘）
D:\bowen\git-project\dsh-ept-integration\apply.ps1

# 确认无误再真正合并（会自动备份 settings.yaml）
D:\bowen\git-project\dsh-ept-integration\apply.ps1 -Apply
```

### 第 3 步：写入 ept 令牌（路线 B 用）

把第 1 步确认可用的令牌写进 DSH 凭据：

```powershell
D:\bowen\git-project\dsh-ept-integration\refresh-ept-key.ps1   # 交互式从 auth_session 提取并写入 .credentials.yaml
```

（写入的是 `EPT_COPILOT_TOKEN` 键；注意 `access_token` 每天过期，需定期刷新——脚本会提示。）

### 第 4 步：让 DSH 生效并选模型

改完 `settings.yaml` 后**重启 `dsh web`**，然后在 Web 的模型选择里切换：
- `CHJ LLM Gateway` → `kivy-deepseek-v4-*`（主力）
- `EPT Copilot` → `azure-gpt-5_6-*`（新增）

---

## 五、注意事项

- **密钥安全**：令牌属于敏感信息，脚本只在内存中使用、不回显；写入 `.credentials.yaml` 时保持该文件私密。
- **凭据自动刷新**：`access_token` 短有效期（`auth_session.json` 的 `expires_at`），企业后台凭据说 `refresh_token` 可续。用 cron / 开机脚本定期跑 `refresh-ept-key.ps1` 即可维持。
- **503 抖动**：日志曾见 `simulated no healthy upstream`（deepseek-v4-pro 偶发 503）。属网关上游问题；pi-ai 有重试策略，若频繁可顺手把 CLI 里的重试调高。
- 本沙箱无 VPN 且写盘受限，所以**所有实连验证都必须在你的正常终端完成**。

