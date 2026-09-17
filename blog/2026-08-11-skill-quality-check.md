---
title: "Skill 质量检查（skill-quality-check）"
date: 2026-08-11T09:00:00.000Z
authors:
  - bowen
tags:
  - 自动化
  - 工具开发
  - AI
categories: 自动化与效率
---
# Skill 质量检查（skill-quality-check）

> 检查 skill 目录是否符合上传应用市场的质量标准，兼容输出接近内部评估接口的预检信息（SKILL.md 质量 / 脚本静态分析 / 模拟运行 / 一致性 / 兼容性 / skill 类型 / 沙箱可执行性 / Token 估算 / 安全发现）。
> 本检查器将 `__pycache__` 编译缓存目录及其中的编译产物文件**如实判为垃圾文件**，不再排除。

<!-- more -->


## 检查维度（对齐正式报告）

| 维度 | 检查内容 |
|------|----------|
| **SKILL.md 质量** | 目录/SKILL.md 存在、frontmatter 键与 YAML、name（长度/kebab-case/与目录名一致）、description（存在/≤1024/50-500/触发词数量）、正文行数、脚本布局、无不当目录、scripts/ 内容合规、assets/ 内容合规、垃圾/临时文件、根目录非标准文件、路径风格（正斜杠）、引用文件是否存在、引用嵌套深度、目录结构总评 |
| **脚本静态分析** | `scripts/` 下每个 `.py` 脚本：语法正确；存在外部调用（requests/subprocess 等）时必须设置 timeout |
| **模拟运行** | 实际执行每个脚本：`--help` 正常退出（退出码 0、无堆栈）；传入非法参数时优雅报错（退出码非 0、无 Traceback、有错误提示） |
| **一致性** | 代码中的环境变量均在 SKILL.md 文档中提及；requirements.txt 必须存在；所有第三方 import 均在 requirements.txt 中声明 |
| **兼容性** | Python 3.10+ 运行时、Claude Code/OpenClaw 兼容性预检 |
| **内部接口预检** | `--json` 输出 `company_compatible`，包括 skill 类型、外部依赖、沙箱可执行性、Token 估算、依赖/环境变量一致性和安全发现 |

## 快速开始

```bash
# 全量扫描 skills 项目根目录下所有 skill
python scripts/checker.py

# 指定一个或多个 skill 目录逐个检查
python scripts/checker.py cheyun-vehicle-cloud-online-status
python scripts/checker.py ../foo-skill ../bar-skill

# 覆盖扫描根目录、关闭模拟运行、JSON 输出
python scripts/checker.py --root D:/path/to/skills --no-run
python scripts/checker.py --json
```

`--json` 输出中的 `company_compatible` 是本地静态预检，不会访问公司服务端，也不能替代最终上传检测；它的字段和严重级别尽量贴近 AI Market 返回结构。

## 参数说明

| 参数 | 说明 |
|------|------|
| `dirs` | 要检查的 skill 目录（位置参数，可多个）；缺省扫描根目录下所有含 SKILL.md 的目录 |
| `--root <dir>` | 覆盖扫描根目录（默认 `D:\bowen\project\skills`） |
| `--no-run` | 关闭「模拟运行」，只做静态检查（零副作用） |
| `--json` | 输出 JSON 结果（供自动化脚本使用） |

## 执行步骤（供 Claude 使用）

### 1. 确认参数

- **目标**：检查某个具体 skill，还是全量扫描？缺省即全量扫描。
- **是否要模拟运行**：默认开启；若用户担心副作用或目标目录含会真实发送消息/调接口的脚本，可加 `--no-run`。

### 2. 运行检查器

```bash
python scripts/checker.py [skill_dir...] [--no-run]
```

### 3. 解读报告

- 每个 skill 一行 `[目录名] 整体得分 xx | 全部通过 / 有 N 项未通过`，各维度给出分类得分。
- `[PASS]` 通过；`[LOW ]` 次要问题（如触发词缺失、assets 混入非资源文件）；`[MED ]` 中等问题（如垃圾文件、语法错误、缺超时、依赖未声明）。
- 有未通过项时，把对应项的 `明细` 逐条反馈给用户并给出修复建议。

### 4. 常见修复

| 问题 | 修复 |
|------|------|
| `垃圾/临时文件`（明细含 `__pycache__` 缓存目录） | 删除该缓存目录后复查（运行脚本后必现，上传前再清一次；用 `rm -rf` 删除即可） |
| `scripts/ 内容合规`（存在非脚本文件） | 把模板等移入 scripts/ 下专用的模板子目录，其余非 .py 文件移出 scripts/ |
| `description 长度不足 50` | 补充触发词与能力描述，扩展 description |
| `触发词数量检查: 0 个` | 在 description 末尾加 `当用户提到"xxx"时触发`（引号内为触发词） |
| `存在外部调用但未设置超时` | 给 requests/subprocess 调用补 `timeout=` 参数 |
| `未声明的依赖: xxx` | 在 requirements.txt 补一行 `xxx==版本`（纯标准库则写 `# Pure standard library…`） |
| `出现堆栈跟踪` | 脚本顶层需 `if __name__ == "__main__":` 包裹 `try/except Exception` 优雅退出 |
| `引用文件是否存在`（正文引用了磁盘上不存在的路径） | 把正文中反引号内的路径改成真实存在的相对路径，或用描述性措辞，不要写成本就不存在的路径字符串（如示例、通配符、占位目录） |

## 故障排查

| 问题 | 原因 | 解决 |
|------|------|------|
| `未在 … 下找到含 SKILL.md 的 skill 目录` | 扫描根目录下没有带 SKILL.md 的目录 | 传入 `dirs` 指定目标，或用 `--root` 指定正确根目录 |
| 模拟运行报错/超时 | 目标脚本依赖特定环境或交互输入 | 加 `--no-run` 跳过模拟运行 |
| 结果中 `__pycache__` 反复出现 | 每次运行脚本都会生成编译缓存 | 上传前删除 scripts/ 下的 `__pycache__` 目录，并注意本检查器运行后自身也会生成缓存 |
| Python 3.10 以下 | 依赖 `list[str]` 等新语法 | 升级到 Python 3.10+ |

