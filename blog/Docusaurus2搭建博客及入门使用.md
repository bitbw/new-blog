---
title: Docusaurus2搭建博客及入门使用
date: 2022-12-19T09:09:56.000Z
authors:
  - bowen
tags:
  - Docusaurus2
categories: Docusaurus2
keywords:
  - Docusaurus2
hash: ec4819480d748eca96fc2bb05db73573f2ddae6ed6ac964fd4802441bd6ede93
cnblogs:
  postid: '17041159'
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

官方建议使用docsearch的[申请界面](https://docsearch.algolia.com/apply/) 进行申请 预计两个星期左右给回复邮件 我等了3星期也没有回复 哎
决定自己配置搜索 [官方文档](https://docsearch.algolia.com/docs/legacy/run-your-own)
- 首先需要创建一个 [algolia 账号]( https://www.algolia.com/)
- 根据 [官方文档](https://docsearch.algolia.com/docs/legacy/run-your-own) 使用 docker 爬取自己站点的索引
- 配置 [docusaurus.config.js](https://docusaurus.io/docs/search#connecting-algolia)

> tip: 建议使用 github 的 codespaces 省得自己配环境
注意事项
- API_KEY设置为您的 API 密钥。确保使用具有索引写入权限的 API 密钥。它需要添加修改和删除权（我使用的是管理员密钥）
- 爬虫配置文件 config.json 需要使用[docusaurus-v2 的模板](https://github.com/algolia/docsearch-configs/blob/master/configs/docusaurus-2.json) 我使用官方的默认配置建立不了索引
- algolia 有 1000 条索引限制需要注意
- docusaurus.config.js algolia 配置 indexName 需要跟爬虫配置文件  config.json 中 index_name 一致 


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
