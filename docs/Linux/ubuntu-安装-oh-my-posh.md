---
title: ubuntu 安装 oh-my-posh
date: 2021-04-15 13:35:05
tags:
  - Linux
  - ubuntu
  - powerline
  - oh-my-posh
categories: Linux
cnblogs:
  postid: "15393007"
hash: e2d50f092b31e83b2f947e152b82f475b8f08fa5b2f36cdcebafcadd14264396
---

## 前言

根据 Windows Terminal 中 powerline 的教程发现 oh-my-posh 还可以安装到 ubuntu 系统下，于是尝试了一下

## 安装

Windows Terminal 中 ubuntu 安装 oh-my-posh 教程：https://docs.microsoft.com/en-us/windows/terminal/tutorials/powerline-setup

oh-my-posh 官网：https://ohmyposh.dev/docs/

- linux 安装教程：https://ohmyposh.dev/docs/linux
- 字体安装教程：https://ohmyposh.dev/docs/fonts

### 安装 oh-my-posh

```bash
wget https://github.com/JanDeDobbeleer/oh-my-posh/releases/latest/download/posh-linux-amd64 -O /usr/local/bin/oh-my-posh
chmod +x /usr/local/bin/oh-my-posh
```

### 配置

```bash
mkdir ~/.poshthemes
wget https://github.com/JanDeDobbeleer/oh-my-posh/releases/latest/download/themes.zip -O ~/.poshthemes/themes.zip
unzip ~/.poshthemes/themes.zip -d ~/.poshthemes
chmod u+rw ~/.poshthemes/*.json
rm ~/.poshthemes/themes.zip
```

如果您使用的是 Ubuntu 18.04 或 16.04，则需要先安装正确版本的 golang：

```bash
sudo add-apt-repository ppa:longsleep/golang-backports
sudo apt update
```

### 自定义您的 Ubuntu 提示

查看所有主题

```bash
for file in ~/.poshthemes/*.omp.json; do echo "$file\n"; oh-my-posh --config $file --shell universal; echo "\n"; done;
```

`~/.bashrc`使用`nano ~/.bashrc`或您选择的文本编辑器打开文件。这是一个 bash 脚本，每次 bash 启动时运行。添加以下内容（将主题更改为您喜欢的主题）：

```bash
eval "$(oh-my-posh --init --shell bash --config ~/.poshthemes/jandedobbeleer.omp.json)"
```

> 如果出现乱码注意安装字体 官方推荐字体 Cascadia Mono PL 使用上会有问题 ，推荐 [Meslo LGM NF](https://github.com/ryanoasis/nerd-fonts/releases/download/v2.1.0/Meslo.zip)

### 字体安装

官方推荐[Meslo LGM NF](https://github.com/ryanoasis/nerd-fonts/releases/download/v2.1.0/Meslo.zip)：https://ohmyposh.dev/docs/fonts

下载地址：https://github.com/ryanoasis/nerd-fonts/releases/download/v2.1.0/Meslo.zip

安装方法：https://www.cnblogs.com/yuqianwen/p/3715835.html

解压

```bash
unzip Meslo.zip -d Meslo
cd Meslo
```

安装

```bash
 sudo mkdir /usr/share/fonts/ttf
 sudo cp *.ttf /usr/share/fonts/ttf
 cd /usr/share/fonts/ttf
 sudo chmod 744 *
 sudo mkfontscale
 sudo mkfontdir
 sudo fc-cache -f -v
```

![image-01](https://bitbw.top/public/img/my_gallery/image-20210415135918711.png)

## 在 vscode 中字体设置

```json
"terminal.integrated.fontFamily": "MesloLGM NF"

```
