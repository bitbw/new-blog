---
title: windows系统常见问题
date: 2021-08-06T08:54:29.000Z
tags:
  - windows
categories: Windows
cnblogs:
  postid: '15393028'
hash: 7f501c40880558cbaab48b1c2ffb7631deedf0370cd0e134cfacf75e89163aaa
---

## 电脑不进系统之开机重复自动修复不进系统

{% note primary %} 修复建议使用 wepe {% endnote %}

### 修复：

b 站视频：https://www.bilibili.com/video/BV1Gv41177gU?p=1&share_medium=android&share_plat=android&share_session_id=19331413-99af-4377-82ff-8b31a9cc451c&share_source=WEIXIN&share_tag=s_i&timestamp=1628169593&unique_k=IAUbQn

### wepe 下载地址

http://www.wepe.com.cn/download.html

#### 安装 U 盘卡在 38%左右不动的问题

原因：应该是 ui 界面卡住了

解决：打开任务管理器 找到 wepe 的任务 ，右键切换到，或双击 就可以了

### 各类型主机启动方式快捷键

![微PE工具箱bootice引导修复如何用？Windows系统引导修复教程](https://s2.loli.net/2023/01/13/jOugZeIKtq1M9aS.jpg)

### 修改环境变量并立即生效

[详解Windows不重启使环境变量修改生效(经典)](http://www.wjhsh.net/zht-blog-p-4033951.html)

- 修改完环境变量
- 打开cmd输入： set PATH=C:  （这里改的是 PATH 变量 修改别的变量就 key=value, value 无所谓是什么）
- 关闭cmd
- 重新打开cmd输入： echo %PATH% （验证一下是否生效）
