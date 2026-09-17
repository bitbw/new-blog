---
title: "不打开融合云应用中心也能部署？用 licloud-cli 把融合云发布流程搬到终端"
date: 2026-09-08T09:00:00.000Z
authors:
  - bowen
tags:
  - 融合云
  - CLI
  - CI/CD
categories: 项目实践
---
> **一句话摘要：** 把“登录租户 → 找流水线 → 触发构建 → 选制品 → 发布应用 → 查状态”这条应用中心流程，收敛成 `licloud-cli` 的几条命令；该人工确认的地方保留确认，该页面配置的地方不强行自动化。

> 如果你还不熟悉如何使用融合云应用中心完成应用部署，可以先阅读：[融合云应用中心通用部署流程](https://li.feishu.cn/docx/IUjXdSeLxoFIqQxd2vjcpZSPnAf)。
>
> 本文对应的 CLI 版本文档：[融合云应用中心CLI部署流程](https://li.feishu.cn/docx/SM5tdYxzeoxezLxayYycjRZTnmd)。


<!-- more -->

## 每次发布，为什么总要在应用中心里点一圈

一个服务第一次部署到融合云，真正花时间的通常不是写 Dockerfile，而是把一串页面操作完整走完：

- 先找到正确租户，再找到正确代码库；
- 仓库下可能有多条流水线，不能随便挑一条；
- 构建成功了，还要确认镜像进入了正确制品库；
- 发布时要选对应用、组件、环境和镜像；
- 环境变量、端口、域名、探针又散落在不同配置页面；
- 失败后还要回头看构建日志、发布状态和组件实例。

这些步骤并不神秘，但它们有一个共同特点：**信息多、重复高、选错代价大**。

所以我最近把这条流程换了一个入口：不再把“应用中心页面”当成唯一入口，而是先用 `licloud-cli licloud-agent` 把能命令化的部分跑起来。

## 一句话说清 `licloud-agent` 是什么

`licloud-agent` 不是一个本地 Codex，也不是一个普通的 REST 命令集合。它更像是融合云已经部署好的**云端 CI/CD Agent 客户端**：你在终端里用自然语言描述意图，CLI 把请求、租户、会话和认证信息交给融合云 Agent，再由云端 Agent 调用流水线、制品、应用和发布能力。

```text
PowerShell
    ↓
licloud-cli
    ↓
融合云云端 CICD Agent
    ↓
构建流水线 / 制品库 / 应用 / 组件 / 发布服务
```

它和自己写一个 chatbot Agent 的思路是相似的：都有自然语言、会话、工具调用和多步执行；区别在于，`licloud-agent` 的 Prompt、工具和 Agent Loop 由平台维护，你通过 CLI 使用它，不需要自己实现一套 CI/CD 工具注册系统。

## 先装好 CLI，再开始部署

安装入口：

[在 AI Market 查看 licloud-cli](https://ai-market.chehejia.com/kill=whn4epql3bhpzf2wugje&tab=doc?page=cli&cli=t1asy2aqlyiorf4koqfs)

安装后检查：

```powershell
licloud-cli version
licloud-cli --help
```

首次登录融合云：

```powershell
licloud-cli auth login
```

检查登录状态并查看租户：

```powershell
licloud-cli auth status
licloud-cli tenant list
```

记住目标租户的 `tenantId`。后续 `licloud-agent` 请求都要带上：

```text
--tenant-id <tenant_id>
```

> PowerShell 里要把自然语言整体放在双引号中。反引号 `` ` `` 只用来换行，不要用它包住查询内容。

## 一次部署到底怎么跑

### 第一步：先确认代码和 Dockerfile

在项目目录检查 Git 状态：

```powershell
git remote -v
git status
git log --oneline -10
```

融合云 Agent 查询流水线时，建议使用 HTTPS Git 地址，并确认以 `.git` 结尾：

```text
SSH:   git@gitlab.chehejia.com:group/repo.git
HTTPS: https://gitlab.chehejia.com/group/repo.git
```

Dockerfile 至少确认三件事：

- 服务监听 `0.0.0.0`，不能只监听 `127.0.0.1`；
- 容器端口和应用实际监听端口一致；
- `CMD` 或 `ENTRYPOINT` 指向真实启动命令。

没有合适的 Dockerfile 时，可以让 Agent 帮忙生成或更新，但入口文件、端口和启动命令仍要自己确认。让 AI 生成 Dockerfile 不等于免掉构建前检查。

### 第二步：先查流水线，别默认选最新

```powershell
licloud-cli licloud-agent "查询仓库 https://gitlab.chehejia.com/group/repo.git 的构建工程和关联流水线" --tenant-id <tenant_id>
```

一个仓库存在多条流水线很常见。不要默认选择第一条或最新一条，优先按下面顺序判断：

1. 项目已有 `.robot/build_config.yaml` 记录的流水线；
2. 流水线的 `artifactKey` 与目标组件绑定的 `artifactKey` 一致；
3. 仓库只有一条流水线；
4. 无法判断时，让人根据流水线绑定组件选择。

需要进一步确认时：

```powershell
licloud-cli licloud-agent `
  "查询流水线 <pipeline_name> 的详细信息，包括构建阶段、Dockerfile 和分支" `
  --tenant-id <tenant_id>
```

这一步看起来慢一点，但比“构建成功后才发现制品不能发布”省时间得多。

### 第三步：没有流水线就创建，已有的优先复用

```powershell
licloud-cli licloud-agent `
  "创建流水线，语言是 <language>，仓库 https://gitlab.chehejia.com/group/repo.git，分支 <branch>，使用源码中的 Dockerfile，路径是 ./Dockerfile，并将构建镜像存储到制品库" `
  --tenant-id <tenant_id> `
  --request-id <uuid>
```

如果只是 Dockerfile 需要调整，优先更新现有流水线，不要重复创建：

```powershell
licloud-cli licloud-agent `
  "更新流水线 <pipeline_name> 的 Dockerfile 内容为：<dockerfile_content>" `
  --tenant-id <tenant_id> `
  --request-id <uuid>
```

`--request-id` 是有副作用操作的幂等键：网络超时时，重试必须使用同一个值；用户主动发起新一轮操作时，才生成新的值。

### 第四步：触发构建并查询状态

建议使用已经确认过的 commit：

```powershell
licloud-cli licloud-agent `
  "运行流水线 <pipeline_name>，使用 <commit_id> commit" `
  --tenant-id <tenant_id> `
  --session-id <session_id> `
  --request-id <uuid>
```

继续查询构建状态：

```powershell
licloud-cli licloud-agent `
  "查询构建状态" `
  --tenant-id <tenant_id> `
  --session-id <session_id>
```

构建期间不要反复触发同一流水线。构建失败时，直接把问题交给 Agent 诊断：

```powershell
licloud-cli licloud-agent `
  "诊断构建失败原因，并给出 Dockerfile 或流水线修复建议" `
  --tenant-id <tenant_id> `
  --session-id <session_id>
```

### 第五步：发布应用和组件

构建成功后，发布到可用的非管控环境：

```powershell
licloud-cli licloud-agent `
  "把刚才构建的镜像发布到 <environment> 环境，应用名为 <app_name>，组件名为 <component_name>" `
  --tenant-id <tenant_id> `
  --session-id <session_id> `
  --request-id <uuid>
```

如果应用或组件不存在，Agent 可以按上下文自动创建。发布流程通常会串起：

- 选择构建制品；
- 创建应用和组件；
- 创建发布泳道；
- 配置端口运维特征；
- 写入环境变量运维特征；
- 触发 Kubernetes 发布。

### 第六步：环境变量不要塞进 Dockerfile

运行时变量建议通过 `--env-vars` 传入：

```powershell
licloud-cli licloud-agent `
  "把刚才构建的镜像发布到 <environment> 环境" `
  --tenant-id <tenant_id> `
  --session-id <session_id> `
  --env-vars '[{"name":"APP_ENV","value":"test"},{"name":"PORT","value":"8080"}]' `
  --request-id <uuid>
```

敏感值在执行前确认，不能写进 Git、Dockerfile 或普通日志。后续发布确认、环境选择和跨 session 续轮命令，也要继续携带完整的 `--env-vars`，否则配置可能没有带到发布流程里。

### 第七步：查询发布状态并诊断

```powershell
licloud-cli licloud-agent `
  "查询 <app_name> 的 <component_name> 在 <environment> 环境的发布状态" `
  --tenant-id <tenant_id>
```

遇到问题时：

```powershell
licloud-cli licloud-agent `
  "诊断 <app_name> 的 <component_name> 在 <environment> 环境的发布问题" `
  --tenant-id <tenant_id>
```

## 它真正省下来的是什么

### 1. 少点页面，不是少做判断

CLI 把查询、创建、构建、发布串起来了，但租户、分支、流水线、制品和环境的判断依然重要。自动化最怕的不是多点几下，而是把错误的制品发布到错误的组件。

### 2. 把“记住上次怎么发”变成配置

建议在项目中保存 `.robot/build_config.yaml`，记录：

```yaml
version: '1.0'
deployMethod: build-and-deploy
app:
  tenantId: <tenant_id>
  appName: <app_name>
  componentName: <component_name>
  artifactKey: <artifact_key>
pipeline:
  name: <pipeline_name>
  artifactKey: <artifact_key>
  gitUrl: https://gitlab.chehejia.com/group/repo.git
  branch: <branch>
```

其中最关键的是：

```text
pipeline.artifactKey == app.artifactKey
```

这条关系能避免下次重新部署时选错流水线。

### 3. 把失败处理也纳入流程

构建失败、发布失败不是流程之外的异常，而是流程的一部分：先查状态，再诊断，再决定更新 Dockerfile、复用流水线还是回到页面处理。

## 哪些事情还不要强行 CLI 化

目前不建议把下面几项默认当成 CLI 已经完全覆盖：

- 生产环境和管控集群发布；
- 域名申请，以及“跨域”“强制 HTTPS 及重定向”等插件配置；
- HTTP 探针的具体路径、初始延迟等细节；
- CPU、内存、副本数等组件资源配置；
- 分支自动构建、准入镜像分支和高级发布触发节点；
- Pod、容器日志、健康检查、页面和业务接口的最终验证。

一句话：**CLI 适合做主流程，页面适合做高风险配置和最后确认。**

## 最短命令清单

```powershell
# 登录和租户
licloud-cli auth login
licloud-cli auth status
licloud-cli tenant list

# 查询应用
licloud-cli licloud-agent "我有哪些应用" --tenant-id <tenant_id> -o table

# 查询流水线
licloud-cli licloud-agent "查询仓库 <git_url> 的构建工程和关联流水线" --tenant-id <tenant_id>

# 查询构建状态
licloud-cli licloud-agent "查询构建状态" --tenant-id <tenant_id> --session-id <session_id>

# 查询发布状态
licloud-cli licloud-agent "查询 <app_name> 的发布状态" --tenant-id <tenant_id>
```

## 最后检查一遍

- [ ] CLI 已登录，租户 ID 正确；
- [ ] 代码已推送，分支和 commit 已确认；
- [ ] Dockerfile、端口和启动命令正确；
- [ ] 选择的流水线和 `artifactKey` 能对应目标组件；
- [ ] 构建成功且镜像进入制品库；
- [ ] 构建/发布操作使用固定 `request-id`；
- [ ] 环境变量通过 `--env-vars` 传入；
- [ ] 发布状态和实例状态正常；
- [ ] 域名、探针、资源和高级发布配置已人工复核；
- [ ] 健康检查、页面或业务接口验证通过。

**最后一句：** 应用中心没有消失，它只是从“每次都要手点的主入口”，变成了“CLI 主流程之外的高风险确认台”。


## 延伸阅读

- [融合云应用中心通用部署流程](https://li.feishu.cn/docx/IUjXdSeLxoFIqQxd2vjcpZSPnAf)
- [融合云应用中心CLI部署流程](https://li.feishu.cn/docx/SM5tdYxzeoxezLxayYycjRZTnmd)


