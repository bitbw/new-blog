---
title: "DeepSeek Harness 必装的 10 个插件"
date: 2026-09-04T09:00:00.000Z
authors:
  - bowen
tags:
  - AI
  - 开发工具
  - 工程实践
categories: AI 与 Agent
---
# DeepSeek Harness 必装的 10 个插件

截至2026年8月15日，Oh-My-DSH目录已收录精选插件 **1117个**，监测生态仓库 **1521个**，累计获得Star **301295** 颗。

今天这篇文章，我就从众多插件里，挑出10个**最值得装**的，希望对你会有所帮助。

## 一、先搞懂Harness的插件怎么装

在聊具体插件之前，我们先花2分钟搞清楚怎么装插件。

Harness的插件安装只有一条命令：

```
dsh plugin --profile web add "github:owner/repo#ref"
```

比如装一个视觉插件：

```
dsh plugin --profile web add "github:liustack/modlens#main"
```

这条命令会从GitHub拉取插件代码，通过`dsh.bundle`声明自动启用它。安装完成后，**重启dsh web服务并刷新页面**，插件就生效了。

**一个重要的坑**：启动Web UI时必须加上`--patch`参数，否则很多插件和技能不会生效。完整命令：

```
npx @deepseek-ai/dsh web --patch
```

另外，官方建议插件仓库打上`#dsh`标签，这样社区目录才能自动收录。想找更多插件，可以直接在GitHub搜索`dsh-plugin`话题。

下面开始正式推荐。

## 二、插件1：ModLens

它给纯文本模型装上一双眼睛。

**仓库**：liustack/modlens | **Star**：905+

DeepSeek本身是纯文本模型，最大的短板就是**看不了图**。你贴一张报错截图、丢一个UI设计稿，它只能对着文字干瞪眼。

ModLens的README第一句就是"Give a text-only model sight"。

装上之后，图片可以直接粘贴进聊天框，它通过一个原生的`modlens_read_image`工具，把图转成结构化文本证据，再喂给DeepSeek作答。

核心思路是：**DeepSeek还是那个纯文本模型，但凭空多了双眼睛**。视觉模型把图像内容"翻译"成文字，纯文本模型再接着处理——就像请了个会看图的朋友在旁边给你念。

**安装命令**（注意必须锁版本号，别用@latest）：

```
dsh plugin --profile web add "@liustack/modlens@3.17.2"
```

**场景**：贴报错截图让AI分析、丢UI设计稿让AI还原、识别流程图中的文字信息。

## 三、插件2：dsh-web-ui

它从毛坯到精装，一站式全家桶。

**仓库**：zhu1090093659/dsh-web-ui | **Star**：1013+

如果只让装一个插件，我会选dsh-web-ui。

默认的dsh web界面就是个纯聊天框，用久了你会觉得它"太素了"。

装上这个插件集之后直接变精装房——**任务看板、Git图谱、右侧面板、移动端UI、宠物、实时Token统计、皮肤中心，一套全给齐**。

最让我惊喜的是**任务看板（dsh-task-board）**：五列看板——待规划/待办/进行中/已完成/已失败。卡片能直接交给真实DSH会话去执行，跑完自动更新状态，还支持cron定时任务。

**安装命令**：

```
dsh plugin --profile web add "github:zhu1090093659/dsh-web-ui#main"
```

装完之后，左侧边栏多了任务看板、Git图谱、Token统计等面板，整个界面从"毛坯"变成了"精装"。

**场景**：所有场景。这是Harness的"基础设施级"插件，装了不亏。

## 四、插件3：dsh-better-sidebar

它把WebUI变成Codex风格的工作台。

**仓库**：omdsh-dev/DSH-better-sidebar | **Star**：684+

如果你习惯用Codex或Claude Code的界面风格，dsh-better-sidebar就是给你准备的。

这个插件给Harness的WebUI加了一个**侧边栏工作台**，支持文件查看/编辑、终端、Git、子代理，还有可扩展的Tab。

装完之后，整个界面跟Codex几乎一模一样。

**安装命令**：

```
dsh plugin --profile web add "github:omdsh-dev/DSH-better-sidebar#main"
```

**dsh-better-sidebar vs dsh-web-ui**：前者更像一个完整的**工作台布局**，侧重文件树、终端、Git这些开发工具；后者更像一个**功能集合包**，侧重任务看板、皮肤、宠物这些增强功能。

两个可以一起装，互不冲突——better-sidebar管布局，web-ui管功能。

**场景**：习惯IDE风格界面的开发者，想在浏览器里获得类似Codex的体验。

## 五、插件4：dsh-TUI

它把Harness搬回终端。

**仓库**：ccch1mneyyy/dsh-TUI | **Star**：793+

这是dsh中最火的插件之一。

官方没有推出任何CLI或TUI形式，所以TUI只能通过插件来扩展。

装上之后执行：

```
dsh --profile cc-tui
```

就可以进入DeepSeek Harness的**全屏终端界面**了。常用的命令基本都涵盖了。

**dsh-TUI vs dsh-better-sidebar**：better-sidebar是给WebUI补一个工作台，dsh-TUI则是**直接把整个交互搬回终端**。

平时习惯在浏览器里看文件树、预览Markdown，就装better-sidebar；已经在日常离不开Claude Code、Codex CLI这种风格的，就装dsh-TUI。

**安装命令**：

```
dsh plugin --profile web add "github:ccch1mneyyy/dsh-TUI#main"
```

**场景**：终端爱好者、习惯CLI工作流的开发者、想在远程服务器上跑Harness的场景。

## 六、插件5：deepseek-harness-desktop

它把Harness变成桌面App。

**仓库**：anywhere-labs/deepseek-harness-desktop | **Star**：4745+

这是最近最火的Harness插件之一。

官方没有提供桌面端，社区把这个缺口补上了。

**核心功能**：把DeepSeek Harness打包成**Electron桌面应用**，自动启动和管理本地Harness服务，集成系统托盘+桌面窗口。

最爽的一点是：**无需装Node.js、无需敲命令**。双击图标就能跑起来。

**注意**：这是**社区项目**，不是DeepSeek官方桌面端。目前主要支持macOS和Windows。插件市场、手机远程这些能力还在后续规划里。

**安装方式**：直接去GitHub Releases下载对应平台的安装包，双击安装即可。

**场景**：不想装Node.js、不想敲命令的开发者，或者想在系统托盘里随时启动Harness的用户。

## 七、插件6：dsh-at-file

它让引用文件，像Codex一样丝滑。

**仓库**：omdsh-dev/dsh-at-file

这是我在Codex中见过的功能——通过`@`的方式引用文件。

装上之后，在对话输入框中输入`@`，会自动弹出工作区文件列表供你选择，选中的文件内容会自动附加到提示词中。

不用再手动复制粘贴文件内容了。

**安装命令**：

```
dsh plugin --profile web add "github:omdsh-dev/dsh-at-file#main"
```

**场景**：需要频繁引用项目文件进行对话的场景。

装了之后，Harness在文件引用这个体验上就追平了Codex。

## 八、插件7：dsh-agent-teams

它能让多智能体团队协作。

**仓库**：NanmiCoder/dsh-agent-teams

安装这个插件后，任何会话只需一句自然语言（例如"用AgentTeams调研一下XX"），即可驱动一个**多智能体团队**协作完成目标，并在Web GUI右上角实时看到团队活动面板。

**工作流程**：创建团队（队长=当前会话Agent）→拉成员（可续聊子代理）→拆任务并声明依赖→成员间直接收发消息（邮箱直达+唤醒，无队长中转）。

**安装命令**：

```
dsh plugin --profile web add "github:dsh-external/dsh-agent-teams#main"
```

**注意**：本仓库不公开，`github:`安装依赖本机git对`dsh-external/dsh-agent-teams`的读取权限。

**场景**：需要多Agent协作的复杂任务，比如市场调研、技术选型分析、多维度报告生成。

## 九、插件8：dsh-plan-execute

它能让双模型路由，规划和执行分离。

**仓库**：dsh-external/dsh-plan-execute

这个插件的思路非常聪明：**规划用推理模型，执行用经济模型**。

复杂任务先让推理模型做规划和拆解，生成的子任务再交给经济模型去执行。

规划阶段的思考质量高，执行阶段的成本低——**脑子和手脚分开用**。

**安装命令**：

```
dsh plugin --profile web add "github:dsh-external/dsh-plan-execute#main"
```

装完之后，Web设置页会多出"规划/执行模型"的配置行。

**场景**：复杂任务需要高质量规划，但不想让执行过程烧太多Token。

这是"降本增效"的典型插件。

## 十、插件9：dsh-context-doctor

它让你看清模型的"上下文账单"。

**仓库**：Zhenyu98/dsh-context-doctor

很多人不知道，大模型每次请求**背着多少上下文**——系统提示词、技能目录、工具schema全部累加在一起，每一轮都在烧Token。

dsh-context-doctor让你**看清这笔账单**。它逐项量化指令链/技能目录/工具schema的Token成本，自动检测重复与冲突，给出可执行裁剪建议。

Web端提供圆环面板可视化展示，同时提供`context_audit`工具供Agent调用。全程只读，不影响任何配置。

**安装命令**：

```
dsh plugin --profile web add "github:Zhenyu98/dsh-context-doctor#main"
```

**场景**：Token消耗异常的排查、Agent上下文优化、成本敏感型项目的精细化管理。

## 十一、插件10：dsh-reverse-skill

它里面包含85个安全研究技能包。

**仓库**：dhicoc/dsh-reverse-skill

一个包含了**85个SKILL.md**的技能路由包，覆盖逆向工程、授权渗透测试与安全研究等领域。

如果你在做安全相关的工作，这个插件能让你快速获得一整套方法论和工具链。

**安装命令**：

```
dsh plugin --profile web add "github:dhicoc/dsh-reverse-skill#main"
```

**场景**：安全研究、代码审计、逆向工程、渗透测试。

## 十二、优缺点

### 优点

1. **极致可定制**：从毛坯到精装，全部自己决定。不像其他工具那样"给你什么用什么"。
2. **生态爆炸式增长**：1117个插件，1521个生态仓库，301295颗Star。你要的功能大概率已经有了。
3. **安装极其简单**：一条`dsh plugin --profile web add`命令搞定一切。不需要手动下载、解压、配置。
4. **开源协议友好**：MIT协议，可自由使用、修改、商用。

### 缺点

1. **版本波动大**：目前还是developer preview，插件迭代很快，装之前记得看版本。
2. **部分插件需要额外配置**：比如ModLens需要锁版本号，dsh-agent-teams需要Git权限。
3. **启动时记得加--patch**：否则技能和部分插件不生效。

### 选装建议

| 用户类型 | 推荐插件组合 |
| --- | --- |
| 只想用Harness干活 | dsh-web-ui + dsh-at-file |
| 想要Codex风格界面 | dsh-better-sidebar + dsh-at-file |
| 纯终端爱好者 | dsh-TUI |
| 不想装Node.js | deepseek-harness-desktop |
| 需要看图 | 加装ModLens |
| 复杂任务/多Agent | 加装dsh-agent-teams和dsh-plan-execute |
| 成本敏感 | 加装dsh-context-doctor |

## 十三、写在最后

回到最初的问题：**DeepSeek Harness必装的10个插件是什么？**

我给它们分了三个层次：

**第一层（核心体验层）**：dsh-web-ui和dsh-better-sidebar。这两个是Harness的"精装修"，装了之后界面体验直接从"毛坯"变"精装"。

**第二层（交互方式层）**：dsh-TUI（终端）、deepseek-harness-desktop（桌面App）、dsh-at-file（@引用文件）。这三个决定了你用什么方式跟Harness交互。

**第三层（能力扩展层）**：ModLens（看图）、dsh-agent-teams（多Agent）、dsh-plan-execute（双模型）、dsh-context-doctor（上下文审计）、dsh-reverse-skill（安全技能）。这些按需加载，需要什么能力就装什么插件。

DeepSeek给Harness的口号是"一切皆插件"。

从这一千多个插件来看，这真的不是口号——**模型、工具、技能、会话、沙箱、存储、循环、调度、UI，全都可以拆下来换掉**。

**我的建议是**：先装dsh-web-ui和dsh-at-file这两个最基础的，把Harness从"毛坯"变成"能住"。然后根据你的使用习惯，选一个交互方式（TUI或桌面App）。最后遇到具体需求的时候（比如要看图、要多Agent协作），再去GitHub搜索`dsh-plugin`话题找对应的插件装上。

一千多个插件，总有一款适合你。

## 开源地址

- **DeepSeek Harness官方仓库**：https://github.com/deepseek-ai/deepseek-harness（11万+ Star）
- **Oh-My-DSH插件聚合社区**：https://github.com/like-study1/Oh-My-DSH（1117个插件）
- **Awesome DSH Plugin精选列表**：https://github.com/awesome-dsh-plugin/awesome-dsh-plugin（218个插件）
