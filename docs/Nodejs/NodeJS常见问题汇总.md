---
title: NodeJS常见问题汇总
date: 2022-08-25 15:30:59
tags:
  - Nodejs
categories: Nodejs
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

[openssl version](https://bitbw.top/public/img/my_gallery/c267a3e017f456c23e61e0d7d7278a2.png)

果然`openssl`版本不对需要升级一下`openssl`版本 ,[升级的方法](https://blog.csdn.net/londa/article/details/125861556)(有点麻烦建议使用 docker 解决)
