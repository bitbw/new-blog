---
title: Linux系统安装Nodejs和卸载Nodejs
date: 2020-12-13 09:57:32
tags:
  - Nodejs
  - Linux
categories: Nodejs
cnblogs:
  postid: "15392583"
hash: cdef7604e659ce53fdb4bd8e6ffbc6547ff43891efbb79e6dbefddb4926396d5
---


[ubuntu 安装 node 的三种方式](https://www.cnblogs.com/fireblackman/p/15688513.html)

> 不推荐安装最新的 node 版本 好多 npm 包都没有对应的最新 node 版本的编译好的包

## 安装环境

- 本机系统：CentOS Linux release 7.5
- Node.js：v12.18.1

## 获取 Node.js 安装包

- Node.js 安装包及源码下载地址为：<https://nodejs.org/en/download/>，你可以根据不同平台系统选择你需要的 Node.js 安装包，这里选择的是 [LTS] Linux Binaries (x64)。
- 官方下载地址 <https://nodejs.org/dist/latest-v12.x/>

## Linux 上安装 Node.js

```bash
wget https://nodejs.org/dist/v12.18.1/node-v12.18.1-linux-x64.tar.xz    // 下载
tar xf node-v12.18.1-linux-x64.tar.xz                                   // 解压
cd node-v12.18.1-linux-x64                                              // 进入解压目录
```

解压文件的 bin 目录底下包含了 node、npm 等命令（npm 全局安装的包），我们可以修改 linux 系统的环境变量（profile）来设置直接运行命令：

**老规矩先备份，养成修改重要文件之前先备份的好习惯。**

```bash
cp /etc/profile /etc/profile.bak
```

> /etc/profile 文件介绍： <https://www.cnblogs.com/xiaoshuxiaoshu/p/4689447.html>

然后 vim /etc/profile，在最下面添加 export PATH=$PATH: 后面跟上 node 下 bin 目录的路径

```html
export NODE_HOME=/root/node-v12.18.1-linux-x64 export PATH=NODE_HOME/bin:$PATH
```

如果 profile 不可修改 添加可写权

```bash
sudo chmod  a=rw  /etc/profile
```

立即生效

```bash
source /etc/profile
```

检查是否生效

```bash
env
```

建立软连接 （报已经存在错误： 先删除目标目录下的文件在操作）

```bash
 ln -s /root/node-v12.18.1-linux-x64/bin/node /usr/local/bin/node
 ln -s /root/node-v12.18.1-linux-x64/bin/npm /usr/local/bin/npm
```

添加 sudo （报已经存在错误： 先删除目标目录下的文件在操作）

```bash
sudo ln -s /root/node-v12.18.1-linux-x64/bin/node  /usr/bin/node
sudo ln -s /root/node-v12.18.1-linux-x64/lib/node  /usr/lib/node
sudo ln -s /root/node-v12.18.1-linux-x64/bin/npm  /usr/bin/npm
```

```bash
[root@localhost ~]# node -v
v12.18.1
```

OK！安装成功！

## 卸载

用上面步骤安装后可以直接删除 node-v12.18.1-linux-x64 文件夹

```bash
rm -rf /root/node-v12.18.1-linux-x64
```

进入 /usr/local/lib 删除所有 node 和 node_modules 文件夹

```bash
rm -rf /usr/lib/node  /usr/lib/node_modules
```

进入 /usr/local/include 删除所有 node 和 node_modules 文件夹

```bash
rm -rf /usr/local/include/node  /usr/local/include/node_modules
```

进入 /usr/local/bin 删除 node 的可执行文件

```bash
rm -rf /usr/local/bin/node
```

接着找到上面建立的软连接 依次删除即可

```bash
rm -rf /usr/bin/npm
```

卸载完成！

现在如果需要其他版本的 node ，就可以按上面的步骤从新安装一个其他版本的 node 了

## ubuntu 安装 node 的三种方式

### 直接使用ubuntu软件源安装

```
sudo apt update
sudo apt install nodejs npm
nodejs --version
v10.19.0
npm -v
```

### 从nodesource安装nodejs和npm

```
# 安装仓库
https://github.com/nodesource/distributions
Installation instructions
Node.js v17.x:

# Using Ubuntu
curl -fsSL https://deb.nodesource.com/setup_17.x | sudo -E bash -
sudo apt-get install -y nodejs

# Using Debian, as root
curl -fsSL https://deb.nodesource.com/setup_17.x | bash -
apt-get install -y nodejs
Node.js v16.x:

# Using Ubuntu
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Using Debian, as root
curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
apt-get install -y nodejs
Node.js v14.x:

# Using Ubuntu
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs

# Using Debian, as root
curl -fsSL https://deb.nodesource.com/setup_14.x | bash -
apt-get install -y nodejs
Node.js v12.x:

# Using Ubuntu
curl -fsSL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs

# Using Debian, as root
curl -fsSL https://deb.nodesource.com/setup_12.x | bash -
apt-get install -y nodejs
Node.js LTS (v16.x):

# Using Ubuntu
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Using Debian, as root
curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
apt-get install -y nodejs
Node.js Current (v17.x):

# Using Ubuntu
curl -fsSL https://deb.nodesource.com/setup_current.x | sudo -E bash -
sudo apt-get install -y nodejs

# Using Debian, as root
curl -fsSL https://deb.nodesource.com/setup_current.x | bash -
apt-get install -y nodejs
Optional: install build tools

To compile and install native addons from npm you may also need to install build tools:

# use `sudo` on Ubuntu or run this as root on debian
apt-get install -y build-essential

```

### nvm安装

```
# 通过脚本安装
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

```
vim .bashrc
# 添加如下代码
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm# 保存退出后，执行下面命令让配置生效source .bashrc
```

```
master@master:~$ nvm -v
0.39.0
```
