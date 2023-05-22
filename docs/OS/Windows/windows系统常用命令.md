---
title: windows系统常用命令
date: 2022-07-18T10:26:56.000Z
tags:
  - windows
categories: Windows
hash: 452deed218a08c1cef1e2a42371dcde53f64993599bfa1b3b98b3d4ab49747bc
cnblogs:
  postid: '17041143'
---

## 查看所有进程

```cmd
tasklist
```

## 杀死具体进程

```cmd
taskkill /F /FI "imagename eq IsaHelp.exe"
```
