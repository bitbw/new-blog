---
title: Ubuntu 下几种软件安装的方法
date: 2021-01-10 08:34:56
tags:
  - Linux
  - ubuntu
categories: Linux
cnblogs:
  postid: "15393006"
hash: afd0692ab86ffdb113321d61af9f5ca54777f46eceb1025f59f4fd658437ded9
---

## **1、tar.gz 软件包的安装**

**1）解压 tar.gz 包**

```
tar -zxvf nginx-1.8.1.tar.gz -C /home/Desktop  # 将软件包名.tar.gz解压到指定的目录下
```

**2）进入解压后的文件目录下**

**执行“./configure”命令为编译做好准备；**

```
cd nginx
sudo ./configure --prefix=/opt/nginx  # 表示安装到/opt目录下
```

**3）执行“make”命令进行软件编译；**

**4）执行“make install”完成安装；**

**5）执行“make clean”删除安装时产生的临时文件。**

## 2、 apt-get 安装方法

ubuntu 默认的软件管理系统是 apt。apt 有很多国内软件源，推荐使用淘宝。

apt-get 的基本软件安装命令是:

**sudo apt-get install 软件名**

## **3、 deb 包的安装方式**

deb 是 debian 系 Linux 的包管理方式，ubuntu 是属于 debian 系的 Linux 发行版，所以默认支持这种软件安装方式。
当下载到一个 deb 格式的软件后,在终端输入这个命令就能安装：

**sudo dpkg -i \*\*软件名\*\*.deb**

## **4、二进制编译或者脚本安装方式**

github 上一般都会提供二进制源码或者脚本安装方式。
这类软件,你会在软件安装目录下发现类似后缀名的文件，如： .sh .py .run 等等,有的甚至连后缀名都没有,直接只有一个 INSTALL 文件。或者是一个其他什么的可执行文件。
对于这种软件,可尝试以下几种方式安装：

\*在软件目录下输入: ./软件名\*\* **
或者 : sh 软件名.sh
或者: python 软件名.py**
