---
title: TypeScript常见问题汇总
date: 2022-03-11T09:32:59.000Z
tags:
  - TypeScript
categories: TypeScript
hash: 7fe43859955a5e137d68c705ca996f1dd86673295f5aa9018ae738955c2ea4be
cnblogs:
  postid: '16228058'
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
