---
title: 使用 ubuntu 打造 NAS
date: 2021-06-03T09:08:36.000Z
tags:
  - ubuntu
  - Linux
categories: Linux
cnblogs:
  postid: '15393032'
hash: deb25fdc9d280ba07f6c78af271876201abc855ecfa8bd20b234858af9b162e9
---

# Ubuntu 文件管理软件安装

## Ubuntu 的安装

参考： https://www.cnblogs.com/masbay/p/10745170.html

## 开启 ssh 服务

Ubuntu 默认不会开启 ssh 服务。所以我们无法对 Ubuntu 进行远程连接，这对 Ubuntu 的运维造成了很大不便。本文详细讲解如何在 Ubuntu18 下开启 ssh 服务。

_关键指令(root 用户下，非 root 用户所有指令前加 sudo)_

**\*ps -e | grep ssh（查看 ssh 服务是否开启）\***

**\*apt-get install openssh-client（安装 ssh 客户端程序）\***

**\*apt-get install openssh-server（安装 ssh 服务端程序）\***

**\*service ssh start 或者 /etc/init.d/ssh start（开启 ssh 服务）\***

**\*service ssh stop 或者 /etc/init.d/ssh stop（关闭 ssh 服务）\***

**\*指令 1：ps -e | grep ssh（ 查看 ssh 服务是否开启）\***

运行**_ps -e | grep ssh_**得出如图一的两行结果。ssh-agent 指的是 ubuntu 的 ssh 服务的客户端，用于该 ubuntu 远程连接其它 Linux 主机。sshd 指的是 ubuntu 的 ssh 服务的服务端，用于其它主机通过 ssh 服务连接该主机。

换句话说，如果没有 sshd 进程的话，别的系统是不能连接该 ubuntu 主机的，若是没有 ssh-agent 的话，该 ubuntu 主机也无法通过 ssh 连接其它主机。

**\*指令 2：apt-get install openssh-client（安装 ssh 客户端程序）\***

若是运行**\*ps -e | grep ssh\***没有查出 ssh-agent 服务，但是你又想通过 ssh 服务连接别的系统。那么就执行**\*apt-get install openssh-client\***安装 ssh 客户端。接着执行**_ssh 目标用户@目标 ip_**即可连接目标主机。正常情况 Ubuntu 默认开启 ssh-agent 服务。所以一般用不打指令 2。

**\*指令 3：apt-get install openssh-server（安装 ssh 服务端程序）\***

默认 ssh 的服务端是没有安装的，可用**\*ps -e | grep ssh\***查看。若是没有 sshd 的进程，则运行**_apt-get install openssh-server_**安装 ssh 服务端。接着重新执行 ps -e | grep ssh 便可发现 sshd 已启动。至此，其它主机便可通过 ssh 连接该主机。

sshd 和 ssh-agent 都已经启动。其它主机便可通过 ssh 连接该主机

**\*指令 4：service ssh start 或者 /etc/init.d/ssh start（开启 ssh 服务）\***

**\*指令 5：service ssh stop 或者 /etc/init.d/ssh stop（关闭 ssh 服务）\***

指令 4 和指令 5 便是开启和关闭 sshd 服务进程的。

以上便是 Ubuntu18 下安装开启 ssh 进程的所有流程。
来源：https://www.jianshu.com/p/4b50b55ebb4d

### 问题

#### SSH连服务器提示“Permission denied(publickey,...).”的原因与解决办法

**原因分析：**

错误提示的大意是拒绝许可，括号中的各种验证失败或未能验证

**解决办法：**

（1）编辑/etc/ssh/sshd_config配置文件：

```sh
vim /etc/ssh/sshd_config 
```

（2）将  第34行左右的  PermitRootLogin 设置为 yes  第58行左右的 PasswordAuthentication 设置为yes，如下图

![image-20220527213951303](https://s2.loli.net/2023/01/13/jStr2PTyRCYdoDV.png)

（3）重启sshd服务

```shell
 systemctl restart sshd
```



## Samba 共享文件服务

参考：https://www.linuxidc.com/Linux/2018-11/155466.htm

## FTP 文件传输服务

安装完 ssh 就可以使用 sftp ，也可以再装一个 vsftpd 

运行：sudo apt-get install vsftpd 命令，安装 VSFTP 工具

安装好了之后，使用如下命令启动 FTP 服务：

sudo systemctl start vsftpd
sudo systemctl enable vsftpd

查看是否开启

sudo ss -tunlp | grep -i ftp





## Gitlab

###  安装

gitlab 企业版 --> ee

gitlab 社区版 --> ce

> tip 官方文档很详细 建议查看官方文档

官方社区版安装教程：https://docs.gitlab.com/ce/install/

推荐使用 docker 容器方式：

[docker容器方式安装教程](https://docs.gitlab.com/omnibus/docker/)

```bash
sudo docker run --detach \
  --hostname gitlab.example.com \
  --publish 9443:443 --publish 9080:80 --publish 9022:22 \
  --name gitlab \
  --restart always \
  --volume $GITLAB_HOME/config:/etc/gitlab \
  --volume $GITLAB_HOME/logs:/var/log/gitlab \
  --volume $GITLAB_HOME/data:/var/opt/gitlab \
  --shm-size 256m \
  gitlab/gitlab-ce:latest
```

[docker容器方式配置教程](https://docs.gitlab.com/ee/install/docker.html#configuration)



# 内网穿透

##  ZeroTier One

### 安装 ZeroTier One 内网穿透

官网：https://www.zerotier.com/

使用这行命令安装 ZeroTier One

curl -s https://install.zerotier.com/ | sudo bash

复制下面代码，将 NetWork ID 从 zerotier 官方网站中复制到下面代码中

sudo zerotier-cli join （NetWork ID）

若出现”200 join OK”则添加成功

## frp

### 安装 frp 内网穿透

[官方文档](https://gofrp.org/docs/setup/)

#### 下载

目前可以在 Github 的 [Release](https://github.com/fatedier/frp/releases) 页面中下载到最新版本的客户端和服务端二进制文件，所有文件被打包在一个压缩包中。

#### 部署

解压缩下载的压缩包，将其中的 frpc 拷贝到内网服务所在的机器上，将 frps 拷贝到具有公网 IP 的机器上，放置在任意目录。

#### 开始使用

编写配置文件，先通过 `./frps -c ./frps.ini` 启动服务端，再通过 `./frpc -c ./frpc.ini` 启动客户端。如果需要在后台长期运行，建议结合其他工具使用，例如 `systemd` 和 `supervisor`。 

如果是 Windows 用户，需要在 cmd 终端中执行命令。

配置文件如何编写可以参考 [示例](https://gofrp.org/docs/examples/) 中的内容。

这个示例通过简单配置 TCP 类型的代理让用户访问到内网的服务器。

### 阿里云配置

需要开启防火墙 中的对应端口  `7000` `6000` ...

### 通过 SSH 访问内网机器

1. 在具有公网 IP 的机器上部署 frps，修改 frps.ini 文件，这里使用了最简化的配置，设置了 frp 服务器用户接收客户端连接的端口：

   ```ini
   [common]
   bind_port = 7000 # 用于与 frpc 连接
   ```

2. 在需要被访问的内网机器上（SSH 服务通常监听在 22 端口）部署 frpc，修改 frpc.ini 文件，假设 frps 所在服务器的公网 IP 为 x.x.x.x：

   ```ini
   [common]
   server_addr = test.com
   server_port = 7000  # 用于与 frps 连接
   
   [ssh]
   type = tcp
   local_ip = 127.0.0.1
   local_port = 22
   remote_port = 6000  # 代理 访问 test.com:6000 相当于访问 127.0.0.1:22
   ```

   `local_ip` 和 `local_port` 配置为本地需要暴露到公网的服务地址和端口。`remote_port` 表示在 frp 服务端监听的端口，访问此端口的流量将会被转发到本地服务对应的端口。

3. 分别启动 frps 和 frpc。

4. 通过 SSH 访问内网机器，假设用户名为 test：

   `ssh -oPort=6000 test@x.x.x.x`

   frp 会将请求 `x.x.x.x:6000` 的流量转发到内网机器的 22 端口。
   
   MEIFGMOCJGAGTQFR

