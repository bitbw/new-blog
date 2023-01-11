---
title: npm常见问题汇总
date: 2022-07-18T15:07:28.000Z
tags:
  - npm
  - Nodejs
categories: Nodejs
hash: 96b79fe41e9e08ba4791c8a2b265553ed2054e775202b9e8383cfcd9519ca96b
cnblogs:
  postid: '17041105'
---

## npm 每次提示 onfig global `--global`, `--local` are deprecated. Use `--location=global` instead

[github上的Issues](https://github.com/npm/cli/pull/4982)

### 原因

版本 v8.11 会出现这个问题

### 解决

升级到 v8.12.x
