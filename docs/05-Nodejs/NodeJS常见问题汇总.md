---
title: NodeJS常见问题汇总
date: 2022-08-25T15:30:59.000Z
tags:
  - Nodejs
categories: Nodejs
hash: c07b9f34224951f289c2be70bfe7b284edc7d26274cc22b4d334dcb0e62b5649
cnblogs:
  postid: '17041104'
---

## 报错 libcrypto.so.1.1: cannot open shared object file: No such file or directory

 完整报错信息

```
node:internal/modules/cjs/loader:1210
  return process.dlopen(module, path.toNamespacedPath(filename));
                 ^

Error: libcrypto.so.1.1: cannot open shared object file: No such file or directory
```

报错提示没有 `libcrypto.so.1.1` ，`libcrypto.so.1.1` 是 `openssl 1.1.x` 的库

验证一下版本

```bash
openssl version
```

![openssl version](https://s2.loli.net/2023/01/15/c6LvGjzCw4BSbDA.png)

果然`openssl`版本不对需要升级一下`openssl`版本 ,[升级的方法](https://blog.csdn.net/londa/article/details/125861556)(有点麻烦建议使用 docker 解决)
