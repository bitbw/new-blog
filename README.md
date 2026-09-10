# Bitbw 技术博客

基于 Docusaurus 3、React、TypeScript 和 Markdown 构建的个人技术博客，默认提供中文站点，并生成英文版本。

## 快速开始

```bash
npm ci
npm run start
```

开发服务默认启动中文 locale；英文页面使用：

```bash
npm run start -- --locale en --port 3002
```

## 构建与验证

```bash
npm run typecheck
npm run build
npm run serve
```

`build/` 是构建产物，不作为源码目录修改。完整开发约定、路由约束、UI 规则和发布流程见 [AGENTS.md](./AGENTS.md)。

## 项目结构

```text
blog/                 博客文章
blog/authors.yml      作者信息
docs/                 Notes 文档
src/pages/            首页和页面组件
src/components/       首页及通用组件
src/css/              全局主题与文章样式
static/               图片、图标和其他静态资源
i18n/                 英文及主题翻译
sidebars.js           文档侧边栏配置
docusaurus.config.js  Docusaurus 站点配置
```

## 内容与路由

- 中文博客路径：`/blog/YYYY/MM/DD/slug/`；
- 英文博客路径：`/en/blog/YYYY/MM/DD/slug/`；
- 文章 frontmatter、分类、标签和多语言规则见 [AGENTS.md](./AGENTS.md)；
- 站点保留尾斜杠配置，发布前需要验证中英文页面和语言切换。

## 主题和部署

站点保持黑底、橙色强调和固定 dark mode。发布分支为：

| 分支 | 环境 |
|------|------|
| `preview` | 测试环境 |
| `main` | 正式环境（prod） |

完整发布操作、工作区恢复方式和发布前检查见 [AGENTS.md](./AGENTS.md) 的“发布流程”。
