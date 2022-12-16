---
title: Ubuntu 解压文件后名称乱码问题
date: 2021-01-10 16:09:01
tags:
  - Linux
  - ubuntu
categories: Linux
cnblogs:
  postid: "15393008"
hash: 0859f6cf98cff623b1e848611a932abb0df0a624eca0c31be449ba883e2cd9da
---

由于中文的 Windows 使用的是 GBK 编码，而 Linux 默认使用 UTF-8 编码的，如果在 Windows 打包带中文文件的 zip 包，则这个 zip 包在 Linux 下面使用默认的归档管理器打开这个 zip 包的时候，中文文件名会显示乱码。

## 解决方法 1：

使用 GBK 格式解压

```bash
unzip -O GBK *.zip
```

## 解决方法 2:

安装 p7zip-rar

```bash
sudo apt-get install p7zip-rar
export LANG=zh_CN.GBK  		# 临时在控制台修改环境为zh_CN.GBK，然后解压缩即可
7za  x  需要解压的文件.zip
export LANG=zh_CN.utf-8 	# 用完别忘了改回来
```
