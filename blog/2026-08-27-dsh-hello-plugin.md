---
title: "dsh-hello-plugin"
date: 2026-08-27T09:00:00.000Z
authors:
  - bowen
tags:
  - AI
  - 开发工具
  - 工程实践
categories: AI 工具
---
# dsh-hello-plugin

一个 **0 依赖**的 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 插件，
用来演示 Cordis 插件系统的四个核心机制，并且**能在任意目录直接安装**。

> 这个文件夹里的插件就是为 `D:\bowen\git-project\dsh-hello-plugin\` 准备的，
> 不需要放进 DSH 仓库，也不需要联网装依赖。

---

## 目录结构与“每步作用在哪”

```
dsh-hello-plugin/
├── index.js            # 插件本体（唯一源码，0 依赖）
├── package.json        # 打包安装路线（dsh plugin add）用的 bundle 清单
├── cordis.yml          # 开发期路线：--patch 覆盖层（引用上面的 index.js）
├── cordis.patch.yml    # 打包路线：bundle 在被安装时应用的那一层
└── README.md           # 本文件
```

`index.js` 里的插件扮演了这四种角色，各自作用在 DSH 的不同层：

| # | 插件里的一段 | 作用在哪个机制/层 | 怎么观察 |
|---|---|---|---|
| 0 | `export const name` | Cordis 插件的身份 | — |
| 1 | `export const inject = ['tools']` | **Cordis 依赖注入 + 生命周期 gating**：框架等到 `ctx.tools` 就绪才把本插件从 `PENDING` 激活到 `ACTIVE` 并调用 `apply()` | 加载顺序不再是手排的，而是“等服务” |
| 2 | `apply(ctx)` 第一行日志 | **fiber 进入 ACTIVE**（插件生命周期入口） | 启动终端打印 `[dsh-hello-plugin] ACTIVE …` |
| 3 | `ctx.effect(() => … setInterval …)` | **可逆副作用**：卸载/HMR 时自动 `clearInterval` | 改配置热替换后定时器不留残留 |
| 4 | `ctx.on('session/created', …)` | **钩住 Harness 应用生命周期**：订阅会话子系统（`packages/core/session`）的真实 `emit` 事件 | 新建聊天时终端打印 `session/created` |
| 5 | `ctx.tools.register({…})` | **插入工具执行流水线**（`packages/core/tools`）：注册 `greet` 工具，schema 自动流入系统提示词装配 | 在 UI 里让模型调用 `greet` |
| 6 | `apply()` 末尾 `return () => …` | **卸载清理最后一步**（disposer，与各 effect 逆序执行） | 热替换/退出时打印 `DISPOSED` |

---

## 前提

你的 DSH 是**从源码跑起来的**（界面上应该是 `http://127.0.0.1:3080`），且在
`D:\bowen\github\deepseek-harness` 有可执行的 checkout、`pnpm` 可用。
（如果不是从源码跑，见「路线 B」。）

---

## 路线 A · 开发期安装（最快，推荐）

这一步不“安装”到任何地方，而是让 DSH **在启动时叠加一层 patch** 把插件挂进去。

1. 停掉当前正在跑的 DSH Web（占用 3080 的那个进程）。
2. 在 DSH 源码根目录执行：

   ```powershell
   cd D:\bowen\github\deepseek-harness
   pnpm dsh web --patch D:/bowen/git-project/dsh-hello-plugin/cordis.yml
   ```

3. 打开 `http://127.0.0.1:3080`。

**验证四件事：**

- 终端出现 `[dsh-hello-plugin] ACTIVE — apply(ctx) 执行 …`（插件装上了）。
- 在 UI 开一个新对话 → 终端出现 `[dsh-hello-plugin] 生命周期钩子触发 → session/created …`（挂上生命周期的证据）。
- 输入：`用 greet 工具跟 Ada 打个招呼` → 模型调用 `greet`，得到 `你好, Ada!`（工具进流水线的证据）。
- 改一下 `cordis.yml` 里的 `greeting`/`heartbeatMs` 再重启，观察配置生效、旧实例干净卸载。

> 为什么要用 `file:///D:/...` 而不是 `D:/...`？`D:\...` 会被 Node 当成 URL 的
> scheme `d:` 解析而报错；`file:///D:/...` 才是合法的模块标识符（见
> `vendor/loader/src/config/tree.ts` 的 `import()` 解析）。

**卸载路线 A**：去掉启动命令里的 `--patch …` 参数即可，或者把 `- insert` 整段删掉。

---

## 路线 B · 打包安装（正式安装进 profile）

把插件变成一个可通过 `dsh plugin` 安装的组合包（bundle）。适合分发给别人 / 长期使用。

1. 确认 `dsh` CLI 可用（源码 checkout 下用 `pnpm dsh` 代替 `dsh`）。
2. 在本插件目录安装其 checkout：

   ```powershell
   cd D:\bowen\git-project\dsh-hello-plugin
   dsh plugin --profile demo add .
   ```

   > 首次使用会初始化名为 `demo` 的 profile。因为我们声明了 `dsh.bundle.patch`
   > （见下面），`dsh` 会把 `dsh-hello-plugin` 追加进该 profile 的 `dsh.profile.bundles`。

3. 先只看组合后配置、再启动：

   ```powershell
   dsh --profile demo --dump-config     # 会看到 “# == dsh-hello-plugin” 那一层
   dsh --profile demo
   ```

4. 验证方式同路线 A（打开 Web UI 观察上面四件事）。

**这里的 `package.json` 起了什么作用？**

```json
{
  "main": "index.js",                                // 插件入口 = 同一个 0 依赖文件
  "files": ["index.js", "cordis.patch.yml"],         // 发布/打包只带这两个文件
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } }  // 声明“我是一个组合包，贡献这层 patch”
}
```

**卸载路线 B**：

```powershell
dsh plugin --profile demo remove dsh-hello-plugin   # 同时移除依赖和它贡献的层
```

**从 git / tarball 安装**：

```powershell
dsh plugin --profile demo add ./dsh-hello-plugin-0.1.0.tgz   # 或 github:you/dsh-hello-plugin
```

（你这份是纯 JS、`main` 就是构建产物，没有 `prepare` 构建脚本这道坎，git 安装也安全。）

---

## 配置文件一览

**`cordis.yml`（路线 A 专用）：**

```yaml
- insert:
    - id: dsh-hello-plugin
      name: 'file:///D:/bowen/git-project/dsh-hello-plugin/index.js'
      config:
        greeting: '你好'
        heartbeatMs: 0      # 大于 0 时每秒打印心跳（演示 effect 清理）
        verbose: true
```

- `insert` = 往装配树里插入一行；插件加载时 `config` 会原样传给 `apply(ctx, config)`。
- 因为没导出 `Config` schema，这里配置是“透传 + 代码内默认值”的方式。

**`cordis.patch.yml`（路线 B 专用）：** 唯一的差别是把 `name` 换成包名 `dsh-hello-plugin`，
这样库才在 profile 的 `node_modules` 里按模块名解析到已安装的代码。

---

## 怎么继续扩展

- **加配置校验 / 默认值**：在 `index.js` 导出 schemastery 的 `Config`：

  ```js
  // 需要联网先在本目录 pnpm add @deepseek-ai/schemastery（或复用 DSH 仓库里的）
  import Schema from '@deepseek-ai/schemastery'
  export const Config = Schema.object({
    greeting: Schema.string().default('Hello'),
    heartbeatMs: Schema.number().default(0),
    verbose: Schema.boolean().default(false),
  })
  ```

  一旦导出了 `Config`，Cordis 就会用它对 `cordis.yml` 的 config 做校验并填默认值。

- **对外提供服务**：把 `apply(ctx)` 改成 `Service` 子类并用 `super(ctx, 'hiService')` +
  `ctx.provide(...)`，别的插件就能 `inject: ['hiService']` 拿到它。

- **参考**：[user/develop/basic](D:\bowen\github\deepseek-harness\docs\user\develop\basic\index.zh.md)、
  [Cordis primer](D:\bowen\github\deepseek-harness\docs\cordis-primer.md)、
  [Cordis tutorial](D:\bowen\github\deepseek-harness\docs\cordis-tutorial\index.zh.md)。

---

*LICENSE: MIT · 纯演示用途，无外部依赖。*
