---
title: Docusaurus2搭建博客及入门使用
date: 2022-12-19 09:09:56
tags:
  - Docusaurus2
categories: Docusaurus2
keywords: [Docusaurus2]
---


## 开始上手

[官方文档](https://docusaurus.io/zh-CN/docs/category/getting-started)

## hexo 博客转换为 Docusaurus2 博客

hexo 博客可以轻松的转换为  Docusaurus2 博客

将文件从hexo 的`source\_posts` 移动到 Docusaurus2的 `blog` 下

可能会有一些报错， 再根据报错进行对应修复即可

<!-- more -->

### 设置摘要示例

docusaurus.config.js

```js
  blog: {
        // ...
          truncateMarker: /<!--\s*(more)\s*-->/,
        }
      
```

## 国际化 i18n

[官方文档](https://docusaurus.io/zh-CN/docs/i18n/tutorial)

> tip: Github Pages 不能部署国际化 我改用 [vercel](https://vercel.com/docs) 进行部署 ，使用 vercel 部署见[文档](https://vercel.com/docs/concepts/git/vercel-for-github)

## 搜索

[搜索](https://docusaurus.io/zh-CN/docs/search)

## 搜索引擎优化 (SEO)

[SEO](https://docusaurus.io/zh-CN/docs/seo)

## editUrl 编辑此页

```js
{
  editUrl: "https://github.com/bitbw/new-blog/tree/preview"
}
```

```
https://github.com/用户名称/仓库名称/tree/分支"
```

## 案例展示

[Docusaurus 案例展示](https://docusaurus.io/zh-CN/showcase)
[我的博客](https://github.com/bitbw/new-blog)
