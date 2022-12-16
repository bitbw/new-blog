---
title: TypeScript常见问题汇总
date: 2022-03-11 09:32:59
tags:
  - TypeScript
categories: TypeScript
hash: 98cf6e6c8260239fe69b0636341edf97458b93c16e4874129fda4eed6f8b30ba
cnblogs:
  postid: "16228058"
---


## 理解 `type Record<K extends keyof any, T> = { [P in K]: T; }`

```ts
// type KEY = keyof any //即 string | number | symbol
type Record<K extends keyof any, T> = {
    // [P in K]的意思是对象的key可以取 string，number，symbol.
    [P in K]: T;
};
// 规定对象类型 key 为 string， value 为 boolean
type Classes = Record<string, boolean>
```
