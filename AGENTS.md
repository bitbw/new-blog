# AGENTS.md

## 项目说明

这是 Bitbw 的个人技术博客，基于 Docusaurus + Markdown 构建，默认语言为 `zh-Hans`，同时生成 `en` 版本。

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
- `build/`：构建产物，不作为源码修改；
- `i18n/`：Docusaurus 翻译文件。

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

安装依赖：

```bash
npm ci
```

开发服务：

```bash
npm run start
```

指定英文 locale：

```bash
npm run start -- --locale en --port 3002
```

生产构建和静态预览：

```bash
npm run typecheck
npm run build
npm run serve
```

## 路由约束

- `trailingSlash: true` 必须保留；
- 博客链接使用 `/blog/YYYY/MM/DD/slug/`；
- 英文链接使用 `/en/blog/YYYY/MM/DD/slug/`；
- 修改 i18n 或路由后，必须验证中文 → English → 中文；
- Docusaurus `start` 一次只运行一个 locale；英文开发验证使用 `--locale en`。

## UI 约束

- 保留黑底、橙色强调和固定 dark mode；
- 正文、侧栏、文章元信息必须有足够对比度；
- 不引入新的 CSS 框架或图标库；
- 修改样式后使用 Playwright MCP 查看实际页面，不只依赖构建成功。

## 升级约束

技术栈升级方案见 [UPGRADE_PLAN.md](./UPGRADE_PLAN.md)。

升级时按阶段执行，每阶段都运行：

```bash
npm run typecheck
npm run build
```

不要直接删除 lockfile，也不要一次性升级所有依赖。先升级 Docusaurus，再升级 React 和 TypeScript，最后处理 MDX/Prism 兼容问题。

## 验证重点

- 首页和文章页可访问；
- 中英文文章都能生成；
- 语言切换不出现 404 或 `/en/en/...`；
- 静态部署地址带尾斜杠；
- 文章文字、目录、代码块和链接可读；
- 构建警告区分可接受的外部本地链接警告与必须修复的路由/资源 404。
