---
title: vuetify常见问题汇总
date: 2021-06-09 10:06:39
tags:
  - Vuetify
  - Vue
categories: Vue
cnblogs:
  postid: "15393015"
hash: 08bc8a52da53d0871bb68b564ee3ed250629bcb84766b998f0d41763c17e9942
---

## vuetify 2.5.3 版本提示 DEPRECATION WARNING: Using / for division is deprecated and will be removed in Dart Sass 2.0.0.

### github issues:

https://github.com/vuetifyjs/vuetify/issues/13694

### 完整提示

```bash
DEPRECATION WARNING: Using / for division is deprecated and will be removed in Dart Sass 2.0.0.

Recommendation: math.div($grid-gutter, 6)

More info and automated migrator: https://sass-lang.com/d/slash-div

   ╷
62 │     'sm': $grid-gutter / 6,
   │           ^^^^^^^^^^^^^^^^
   ╵
    node_modules/vuetify/src/styles/settings/_variables.scss 62:11      @import
    node_modules/vuetify/src/styles/settings/_index.sass 1:9            @import
    node_modules/vuetify/src/styles/styles.sass 2:9                     @import
    node_modules/vuetify/src/components/VDataTable/_variables.scss 1:9  @import
    stdin 2:9                                                           root stylesheet

DEPRECATION WARNING: Using / for division is deprecated and will be removed in Dart Sass 2.0.0.

Recommendation: math.div($grid-gutter, 6)

More info and automated migrator: https://sass-lang.com/d/slash-div

```

### 解决

用 sass < 1.33 作为解决方法

官方的说明：我正在为此恢复修复，它完全破坏了注入自定义 sass 变量（[#13737](https://github.com/vuetifyjs/vuetify/issues/13737)）的项目。要使警告静音，请安装`sass@~1.32`

步骤：

修改 package.json

```json
"sass": "~1.32",
```

然后 npm install

# v-autocomplete 多选 不保留滚动位置

### github issues:

https://github.com/vuetifyjs/vuetify/issues/11969

### 问题原因

https://github.com/treardon17/vuetify/commit/9f8059112eabbd890f9f3efbc59459235a777996

```js
//packages/vuetify/src/components/VSelect/VSelect.ts
// 删除下面的代码
this.setMenuIndex(-1);
```

### 解决

可以使用 github issues 中的解决方案 ，或者等官方更新修复这个 bug
