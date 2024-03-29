---
title: electron-builder常见问题汇总
date: 2022-07-29T16:38:07.000Z
tags:
  - electron-builder
  - Electron
categories: Electron
hash: 4f0f8525d75fa7a285b420d0d5b375e97ab835f3cc23ef2d80251d110dc6bd4f
cnblogs:
  postid: '17041095'
---

## electron-updater 下载无进度问题

突然某一次更新 download-progress 事件不触发了
下载进度显示了，直到下载结束 触发`update-downloaded`事件
开始以为是 electron-builder 和 electron-updater 版本问题，因为最近更新过`node_modules`
尝试将 electron-builder 和 electron-updater 更到最新， 还是不行 😖

开始将问题点转到 请求上，因为之前给 nginx 加了 gzip，考虑是不是 gzip 压缩后无法读取进度了

### 解决

nginx.conf

```yml
    gzip on; # 开启 gzip 压缩输出 
    gzip_min_length 1k; # 1k 以上开启 gzip
    gzip_types
        # ...
        # application/octet-stream 这里注释防止大文件（.exe）下载时读取不到进度
```

去除 nginx.conf 中`application/octet-stream` 二进制流类型的压缩，发现`update-downloaded`事件正常了

gzip压缩后其实通过浏览器下载这个 exe 文件时也不显示进度, 估计是压缩后是直接下载 .gz 文件（下载好以后直接写入文件）， 而未压缩使用流式下载（边下边写入文件）
![image](https://s2.loli.net/2023/01/13/I8RacKUt547jNmX.png)
