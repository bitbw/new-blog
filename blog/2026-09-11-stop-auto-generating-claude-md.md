---
title: "别再自动生成 CLAUDE.md 了，最新论文把真相讲透了"
date: 2026-09-11T09:00:00.000Z
authors:
  - bowen
tags:
  - AI
  - 开发工具
  - 工程实践
categories: AI 与 Agent
---

> 原文：[别再自动生成 CLAUDE.md 了，最新论文把真相讲透了](https://mp.weixin.qq.com/s/76V5tqHX1GkKPhUlK07Yrg)
>
> 本文根据公众号原文重新整理 Markdown 格式，保留原文的核心观点、实验数据和实践建议。

<!-- more -->

很多团队都会给代码仓库加一个 `AGENTS.md` 或 `CLAUDE.md`，用来描述：

- 项目结构
- 依赖安装方式
- 测试命令
- 代码风格
- 目录和模块的注意事项

直觉上看，这些上下文应该能帮助 AI 编程助手少猜一点、多做对一点。

但一篇论文给出了一个反直觉的结论：

> 上下文文件确实会改变 Agent 的行为，但不一定会让它更容易完成任务。

论文标题是《Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?》，研究对象正是 `AGENTS.md`、`CLAUDE.md` 这类仓库级上下文文件。

## 先说结论

`CLAUDE.md` 或 `AGENTS.md` 不应该被写成另一份 README，也不应该靠自动生成不断堆内容。

更合理的定位是：

> 用一份短小的工程约束，告诉 Agent 那些它自己很难安全推断、但做错代价很高的规则。

如果一条信息 Agent 可以通过 `ls`、`rg`、读取 README 或运行测试自行发现，就不一定值得写进上下文文件。

## 实验是怎么做的？

作者搭建了两套 benchmark，分别观察仓库级上下文文件是否能提高 coding agent 完成真实工程任务的成功率。

| 数据集 | 规模 | 作用 |
| --- | ---: | --- |
| SWE-Bench Lite | 300 个任务 | 测试 LLM 自动生成 context file 在热门仓库中的效果 |
| AgentBench | 138 个任务 | 测试开发者真实 context file 在较新或小众仓库中的效果 |

AgentBench 来自 12 个真实 GitHub 仓库。这些仓库本身带有开发者编写的 `AGENTS.md` 或 `CLAUDE.md`，作者再从 PR 和 issue 中抽取任务，生成并校验回归测试。

实验设置分为三组：

- **NONE**：不提供上下文文件。
- **LLM**：使用 Agent 推荐方式自动生成上下文文件。
- **HUMAN**：使用仓库开发者真实提交的上下文文件。

被测对象包括 Claude Code + Sonnet 4.5、Codex + GPT-5.2，以及 Qwen Code + Qwen3-30B-Coder。

主要指标是 `success rate`：Agent 生成补丁后，测试是否全部通过。

同时还统计了：

- Agent 步骤数
- 推理成本
- 工具调用次数
- 搜索文件次数
- 测试次数
- reasoning token 数量

## 自动生成的 `CLAUDE.md` 不太行

在 8 个主要设置中，LLM 自动生成的 context file 有 5 个降低了任务成功率。

实验给出的平均结果大致是：

| 数据集 | 成功率变化 | 步骤数变化 | 推理成本变化 |
| --- | ---: | ---: | ---: |
| SWE-Bench Lite | 下降约 0.5% | 增加 2.45 步 | 增加约 20% |
| AgentBench | 下降约 2% | 增加 3.92 步 | 增加约 23% |

也就是说，自动生成的上下文文件并没有稳定提效，反而可能让 Agent 做更多事、消耗更多 token，而成功率略有下降。

人工编写的上下文文件表现稍好：在 AgentBench 上平均带来约 4% 的成功率提升，但同样会增加步骤数和成本。论文统计的平均步骤增量为 3.34 步，成本最高增加约 19%。

这背后的直觉很简单：每多给 Agent 一条规则，它就多了一份需要判断和执行的内容。

## Agent 其实非常遵守命令

实验一开始还怀疑：上下文文件没有提升成功率，是不是因为 Agent 根本没读、没按规则执行？

Trace 分析给出了相反答案：Agent 不但会读，而且遵守得很明显。

当仓库中存在上下文文件时，Agent 更频繁地：

- 搜索代码
- 读取更多文件
- 运行更多测试
- 执行上下文文件中点名的工具

论文中的一个对比示例是：

| 行为 | 被 context file 提及时 | 未被提及时 |
| --- | ---: | ---: |
| `uv` 使用次数 | 平均 1.6 次/实例 | 低于 0.01 次/实例 |
| 仓库特定工具 | 平均 2.5 次/实例 | 低于 0.05 次/实例 |

所以，问题不是 Agent 不听话，而是它太听话了。

如果 `AGENTS.md` 里写了很多看起来合理的建议，Agent 就会认真执行：你写了某个目录，它可能真的会去读；你要求额外验证，它可能真的会多跑一组测试。

## 上下文文件会增加推理成本

论文还统计了 reasoning token 的变化。

LLM 生成 context file 后：

- 在 SWE-Bench Lite 上，GPT-5.2 的 reasoning token 增加约 22%，GPT-5.1 Mini 增加约 14%。
- 在 AgentBench 上，GPT-5.2 增加约 14%，GPT-5.1 Mini 增加约 10%。

这就像给一位工程师交代任务时，额外塞给他十条注意事项。他自然会更谨慎地逐条核对，也会更慢。

如果这些注意事项都是关键约束，成本是值得的；如果只是把代码里已经能看出来的内容再复述一遍，就会变成上下文噪音。

## 仓库概览没有想象中有用

很多 `AGENTS.md` 或 `CLAUDE.md` 会写这样的项目结构：

```text
src/: core implementation
tests/: unit tests
docs/: documentation
scripts/: helper scripts
```

看起来这可以帮助 Agent 更快找到文件，但论文专门测试了一个指标：Agent 第一次触达原始 PR patch 中相关文件，需要多少步。

结论是：上下文文件并没有明显缩短这个过程。

对于 GPT-5.1 Mini 这类相对弱一些的模型，有上下文文件时反而可能更慢。通过人工检查 trace，作者发现 Agent 会多次寻找和阅读上下文文件，即使相关内容已经出现在它的上下文中。

这说明一个现实问题：对于现代 coding agent 来说，仓库概览可能已经不是稀缺信息。它本来就会执行 `ls`、`rg`、读取测试和检查文件，你再把目录树讲一遍，边际价值并不高。

真正重要的通常不是“这里有什么”，而是“这里为什么不能随便改”。

## 为什么自动生成的文件容易没用？

论文还有一个很关键的消融实验：

1. 先生成 context file。
2. 删除仓库中的其他文档材料，包括 `.md` 文件、示例代码和 `docs/` 目录。
3. 再评估 Agent 的表现。

结果反而变好了：在没有其他文档时，LLM 生成的 context file 平均提升约 2.7%，甚至优于开发者编写的 context file。

这解释了一个看似矛盾的现象：

- 为什么主实验里自动生成 `AGENTS.md` 没什么用？
- 为什么很多开发者又觉得加了 `AGENTS.md` 后效果变好了？

答案可能是：

- 如果仓库本来文档很差，自动生成的 context file 确实能补一点文档缺口。
- 如果仓库已经有 README、docs 和 examples，它往往只是在压缩复述已有文档。
- 这时它的边际价值很低，甚至会制造额外负担。

所以，自动生成 `AGENTS.md` 最大的问题不是“自动生成一定不好”，而是它很容易变成一份二手 README。

## `AGENTS.md` 应该怎么写？

我的理解是，`AGENTS.md` 的定位应该从“项目介绍”改成“工程约束”。

### 不建议写什么？

- README 摘要
- 大段项目背景
- 完整目录树
- 宽泛的编码原则
- Agent 可以通过搜索和测试自行发现的信息

这些内容多数没有错，但不够稀缺：Agent 要么已经知道，要么可以自己发现。

### 更值得写什么？

| 类型 | 示例 |
| --- | --- |
| 强制工具链 | 必须使用 `uv sync`，不要使用 `pip install -r requirements.txt` |
| 测试入口 | 后端使用 `uv run pytest tests/api`，前端使用 `pnpm test --filter web` |
| 生成文件规则 | 不要手改 `src/generated/`；修改 schema 后执行 codegen |
| 迁移规则 | 数据库迁移必须使用 `uv run alembic revision --autogenerate` |
| 完成前检查 | 先跑 focused test，再跑受影响 package 的测试 |

每一条规则都应该尽量降低真实场景中的错误概率。

## 一个相对合理的 `AGENTS.md`

```markdown
# AGENTS.md

## Required commands

- Install dependencies with `uv sync`.
- Run focused tests with `uv run pytest path/to/test.py -q`.
- Run package tests with `uv run pytest tests/<package> -q`.
- Format with `uv run ruff format`.

## Repository-specific rules

- Do not edit files under `src/generated/`; update schemas and run `uv run codegen`.
- Database migrations must be created with `uv run alembic revision --autogenerate`.
- Use `pnpm` for frontend packages. Do not use `npm install`.

## Known pitfalls

- Integration tests require `TEST_DATABASE_URL`.
- Snapshot files must be updated with `UPDATE_SNAPSHOTS=1`.

## Before finishing

- Run the smallest failing or relevant test first.
- Then run the package-level test suite touched by the change.
```

这份文件并不长，但每一条都在试图减少真实场景中的错误。

## 论文的边界

这篇论文的证据链比较完整，但也不能过度解读。

### 研究范围有限

论文主要研究 Python 仓库。前端、移动端或其他语言仓库，可能会得到不同结果。

### 结果存在随机性

每个 Agent 或模型只进行了一次采样，运行结果可能受到随机性影响。

### 指标并不全面

论文主要观察任务通过率，没有覆盖代码质量、架构一致性和长期可维护性等指标。

因此，更稳妥的结论不是“上下文文件没用”，而是：

> 不要写大而全的 `AGENTS.md` 或 `CLAUDE.md`，应该写能让模型减少犯错的少量规则。

## 最后：上下文是有成本的

AI 编程工具越来越强，模型上下文窗口也越来越大，但工程上下文并不是免费的。

它会影响 Agent 的：

- 搜索路径
- 工具选择
- 测试策略
- 推理长度
- 注意力分配

好的上下文会减少错误，差的上下文会制造犹豫。

因此，`AGENTS.md` 的正确定位不是“让 Agent 更懂整个项目”，而是：

> 告诉 Agent 那些它自己很难安全推断、但做错代价很高的少量规则。

Context engineering 的核心不是堆上下文，而是筛选上下文。

## 参考资料

1. [Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?](https://arxiv.org/abs/2602.11988)
2. [原公众号文章：别再自动生成 CLAUDE.md 了，最新论文把真相讲透了](https://mp.weixin.qq.com/s/76V5tqHX1GkKPhUlK07Yrg)

