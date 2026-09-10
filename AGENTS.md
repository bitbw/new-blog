# AGENTS.md

## 规则来源

本文件是项目级 AI 编程助手规则的唯一来源。开始工作前先阅读完整内容；`CLAUDE.md` 只作为 Claude Code 入口，不重复维护规则。

## 项目说明

这是 Bitbw 的个人技术博客，基于 Docusaurus 3 + React + TypeScript + Markdown 构建，默认语言为 `zh-Hans`，同时生成 `en` 版本。

## 改动原则

- 先查现有代码和配置，再修改；
- 优先最小 diff，不新增无必要依赖；
- 不迁移框架，不做未请求的抽象；
- 修 bug 要修根因；
- 不修改外部参考目录：`D:\bowen\git-project\bitbw-site`、`D:\bowen\project\skills`、`D:\bowen\project\docs\aiforme\publish` 和 `D:\bowen\project` 下的公司项目；
- 外部目录只读，用于内容和视觉参考。

## 目录约定

- `blog/`：博客文章；
- `docs/`：站点 Notes 文档；
- `src/pages/index.tsx`：首页结构；
- `src/pages/index.module.css`：首页样式；
- `src/css/custom.css`：全局主题和文章页样式；
- `static/`：图片等静态资源；
- `build/`：站点构建产物，不作为源码修改；
- `i18n/`：Docusaurus 翻译文件；
- `backup_github/`：历史部署配置，仅在明确需要时修改。

## 文章 frontmatter

新文章统一使用：

```yaml
---
title: "文章标题"
date: 2026-09-09T09:00:00.000Z
authors:
  - bowen
tags:
  - 标签
categories: 分类
---
```

旧文章中的 `hash` 和 `cnblogs.postid` 是历史发布记录，新文章不添加。skill 原始文件中的 `name`、`description`、`license`、`metadata` 不要直接当作博客 frontmatter。

## 本地命令

```bash
npm ci                 # 安装依赖
npm run start          # 启动中文开发服务
npm run start -- --locale en --port 3002  # 启动英文开发服务
npm run typecheck      # TypeScript 检查
npm run build          # 生产构建
npm run serve          # 预览构建产物
```

## 路由与多语言约束

- `trailingSlash: true` 必须保留；
- 中文博客链接使用 `/blog/YYYY/MM/DD/slug/`；
- 英文博客链接使用 `/en/blog/YYYY/MM/DD/slug/`；
- 修改 i18n 或路由后，验证中文 → English → 中文；
- Docusaurus `start` 一次只运行一个 locale，英文开发验证使用 `--locale en`；
- 发布前确认首页、文章页、语言切换和静态资源路径正常。

## UI 约束

- 保留黑底、橙色强调和固定 dark mode；
- 正文、侧栏、文章元信息必须有足够对比度；
- 不引入新的 CSS 框架或图标库；
- 修改样式后使用 Playwright MCP 查看实际页面，不只依赖构建成功。

## 发布流程

项目采用双分支发布：

| 分支 | 环境 | 用途 |
|------|------|------|
| `preview` | 测试环境 | 日常开发联调，功能验证 |
| `main` | 正式环境（prod） | 稳定版本，对外发布 |

- **上测试环境**：将代码合并到 `preview` 分支并提交；
- **上正式环境**：将代码合并到 `main` 分支并提交。

操作规范：

1. 合并之前，先检查当前分支是否有未提交内容；如有，先执行 `git stash` 暂存，合并期间保持工作区干净，完成后再执行 `git stash pop` 恢复；
2. 先切换到目标分支并拉取最新代码：`git checkout <分支> && git pull`，发布分支尽量保持最新；
3. 合并并推送成功后，必须切回原开发分支，恢复暂存内容，并将当前开发分支推送到远程：`git push origin <开发分支>`；
4. 发布前确认构建通过，并检查发布分支状态和提交内容。

## 升级约束

技术栈升级方案见 [UPGRADE_PLAN.md](./UPGRADE_PLAN.md)。升级时按阶段执行，每阶段运行：

```bash
npm run typecheck
npm run build
```

不要直接删除 lockfile，也不要一次性升级所有依赖。先升级 Docusaurus，再升级 React 和 TypeScript，最后处理 MDX/Prism 兼容问题。

## 文档输出规范

方案、实施或输出类文档统一写入当前项目 `docs/<分类>/` 目录；优先复用已有分类，仅在确有必要时新建分类。同一主题的相关文档集中在同一分类目录下。

## 验证重点

- 首页和文章页可访问；
- 中英文文章都能生成；
- 语言切换不出现 404 或 `/en/en/...`；
- 静态部署地址带尾斜杠；
- 文章文字、目录、代码块和链接可读；
- 构建警告区分可接受的外部本地链接警告与必须修复的路由或资源 404。
