# 技术栈升级方案

> 项目：Bitbw 个人博客
>
> 当前记录时间：2026-09-09
>
> 原则：保留 Docusaurus，最小改动完成升级；先保证页面、文章和中英文路由不回归，再处理依赖清理。

## 1. 当前状态

| 项目 | 当前版本/状态 |
| --- | --- |
| Docusaurus | 2.2.0 |
| React / React DOM | 17.0.2 |
| TypeScript | 4.7.4 |
| MDX | `@mdx-js/react` 1.6.22 |
| Prism | `prism-react-renderer` 1.3.5 |
| Node.js | `>=16.14` |
| 站点 | 中英文双 locale，静态部署 |

当前技术栈已经偏旧，但没有必要迁移到 Next.js、引入 CMS 或重做文章系统。博客的核心需求是 Markdown + 静态构建，Docusaurus 仍然匹配。

## 2. 目标状态

优先目标：

- Docusaurus 2.2.0 → Docusaurus 3.x（执行时安装当前稳定版）；
- React 17 → React 18；
- TypeScript 4.7 → TypeScript 5.x；
- MDX 1 → Docusaurus 3 对应的 MDX 3 体系；
- `prism-react-renderer` 升级到 Docusaurus 3 兼容版本；
- Node.js 使用当前维护中的 LTS 版本，建议 Node 22 或更高维护版；
- 保留 `trailingSlash: true`，避免静态托管下中英文切换 404；
- 保留当前黑底、橙色强调和固定 dark mode 视觉方案。

暂不升级到 React 19，除非 Docusaurus 目标版本明确要求或项目验证后确认收益足够。暂不迁移 Next.js。

## 3. 升级顺序

### 阶段 0：准备与基线

1. 新建升级分支，例如 `chore/upgrade-docusaurus`。
2. 记录当前可用命令：

   ```bash
   npm ci
   npm run typecheck
   npm run build
   ```

3. 用浏览器验证 `/`、`/blog/`、`/docs/intro/`、一篇中文文章、同一篇英文文章及中英文切换。

### 阶段 1：升级 Docusaurus 主包

先只升级 Docusaurus 相关包，不顺手升级所有依赖：

```bash
npm install @docusaurus/core@latest @docusaurus/preset-classic@latest @docusaurus/module-type-aliases@latest
```

重点检查 `docusaurus.config.js`、主题导入、文章 frontmatter、MDX 内容、图片、代码块和 `trailingSlash`。

### 阶段 2：升级 React 与 TypeScript

```bash
npm install react@18 react-dom@18
npm install --save-dev typescript@5 @tsconfig/docusaurus@latest
npm run typecheck
npm run build
```

当前首页是普通 React 页面，没有复杂状态和客户端副作用，React 18 通常不需要额外重构。

### 阶段 3：处理 MDX、代码高亮和内容兼容性

不要手动强行安装一组 MDX 包。先让 Docusaurus 3 的 preset 管理兼容版本；只有构建报错时，才按错误补包或改文章。

检查：

- `title / date / authors / tags / categories`；
- 标题中的引号、冒号、括号和 Emoji；
- Markdown 图片路径；
- Windows 本地路径；
- HTML 标签和 MDX 组件；
- `prism-react-renderer` 主题导入路径。

### 阶段 4：内容和路由回归

按构建错误逐篇修，不做批量重写。优先处理 YAML、MDX、图片、外部链接和 locale 路由问题。

对无法在博客中解析的原项目本地链接，改成项目名、代码路径或公开仓库链接；不要把 `D:\...` 路径暴露到线上页面。

### 阶段 5：最终验证

```bash
npm ci
npm run typecheck
npm run build
npm run serve
```

用 Playwright MCP 验证中文首页/文章页、英文首页/文章页、双向语言切换、尾斜杠、404、深色主题对比度、代码块和移动端导航。

## 4. 验收清单

- [ ] `npm ci` 成功
- [ ] `npm run typecheck` 成功
- [ ] `npm run build` 成功
- [ ] 中文和英文构建目录都存在
- [ ] 中英文文章页可访问
- [ ] 中英文相互切换正常
- [ ] `/docs/intro/` 可访问
- [ ] 首页最近文章链接正常
- [ ] 深色主题文字可读
- [ ] 代码块可读、可复制
- [ ] 图片没有破图
- [ ] 没有新增路由或资源 404

## 5. 回滚方案

每个阶段单独提交。出现构建无法恢复、文章大量无法解析、语言切换回归或页面大面积异常时，停止继续升级并只回退当前阶段提交。

## 6. 不做的事情

- 不迁移 Next.js；
- 不引入 Tailwind、CMS 或数据库；
- 不重写文章正文；
- 不添加 `hash`、`cnblogs.postid` 等旧公共论坛记录；
- 不为了“最新”直接升级 React 19；
- 不把本地项目路径和公司内部凭据写入公开文章。

## 7. 执行前检查

```bash
npm outdated
npm view @docusaurus/core version peerDependencies
npm view @docusaurus/preset-classic version peerDependencies
```

升级完成后不要只看构建成功；必须完成浏览器验收，尤其是中英文切换和静态托管尾斜杠。
