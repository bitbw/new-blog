---
title: Git 常用命令
date: 2021-06-24 09:50:14
tags:
  - Git
categories: Git
cnblogs:
  postid: "15392421"
hash: b4eea134b465738224dbab20ba7e153b2b23c67b493612e3ad15dbf874795f56
---
## config

 git 全局配置文件在 ~ 目录下 .gitconfig 文件
 git 项目配置文件在 项目目录下 .git 文件夹下 config 文件

## remote 远程仓库

### git 远程分支详解

 参考[Git refspec与远程分支的重要操作](https://blog.csdn.net/weixin_39616416/article/details/111160820)

### 查看本地关联的远程仓库

```bash
git remote -v
# 远程仓库名  远程仓库地址
# origin  https://github.com/xxx/my-blog.git (fetch)
# origin  https://github.com/xxx/my-blog.git (push)
```

### 本地设置远程仓库

```bash
#  git remote add （添加远程仓库） origin（远程仓库名随便起） https://github.com/xxx/my-blog.git （远程仓库地址）
git remote add origin https://github.com/xxx/my-blog.git
#  git push 推送代码 -u 同时为当前推送设置上游分支  origin master （origin 就是上面起的远程仓库名 master 分支名）
git push -u origin master
```

### 修改远程仓库地址

```bash
# git remote set-url origin（远程仓库名） https://github.com/xxx/my-blog1.git （远程仓库地址）
git remote set-url origin https://github.com/xxx/my-blog1.git

```

## 查看 GIT 未推送的提交记录

#### 1 查看到未传送到远程代码库的提交次数

```bash
git status
```

显示结果类似于这样：

```bash
$ git status
On branch master
Your branch is ahead of 'origin/master' by 2 commits.
  (use "git push" to publish your local commits)

nothing to commit, working tree clean
```

#### 2 查看到未传送到远程代码库的提交描述/说明

```bash
git cherry -v
```

显示结果类似于这样：

```bash
+ afd5134be3bee5285d6c2ee2c82fc323012d74bb Update commit 1
+ 37a165ec0586f4af745bf538bc139fda6f1df672 Update commit 2
```

#### 3 查看到未传送到远程代码库的提交详情

```bash
git log master ^origin/master
```

这是一个 git log 命令的过滤，^origin/master 可改成其它分支。
显示结果类似于这样：

```bash
commit 37a165ec0586f4af745bf538bc139fda6f1df672 (HEAD -> master)
Author: xxxx <xxxxx@163.com>
Date:   Mon Jul 26 17:46:34 2021 +0800

    Update commit 1

commit afd5134be3bee5285d6c2ee2c82fc323012d74bb
Author: xxx <xxxx@163.com>
Date:   Mon Jul 26 09:54:24 2021 +0800

    Update commit 2
```

总结
git status 只能查看未传送提交的次数
git cherry -v 只能查看未传送提交的描述/说明
git log master ^origin/master 则可以查看未传送提交的详细信息

## Github 相关

新建仓库

```bash
echo "# test111" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/bitbw/test111.git
git push -u origin main
```

已有仓库

```bash
git remote add origin https://github.com/bitbw/test111.git
git branch -M main
git push -u origin main
```

## git设置代理

### 设置局部代理

```bash
git config --local http.proxy 127.0.0.1:1080
```

### 端口要设置为本地代理的端口

### 设置全局代理

```bash
git config --global http.proxy 127.0.0.1:1080
```

为全局的 git 项目都设置代理

取消代理设置

```bash
git config --local --unset http.proxy
git config --global --unset http.proxy
```

### git clone 同时设置代理

```bash
git clone -c http.proxy=http://127.0.0.1:1080  https://github.com/xxx.git
```

设置快捷别名

```bash
git config --global alias.cloneProxy = clone -c http.proxy=http://127.0.0.1:1080
```

## git 大小写问题

问题复现:

1. .新建一个 a.js 文件(大小写不敏感的状态下)，并提交
2. .修改本地 a.js 变为 A.js，文件内容无变更，无法提交
3. 执行git config core.ignorecase false，修改 大小写敏感 规则，然后提交，查看结果，此时会存在 大小写 同时存在的文件
4. 此时某种机缘下，再次执行 git config core.ignorecase true，大小写不敏感，
5. 此时执行 git push ， 即把最新的更新都更新到了 a.js 中
6. 此时再修改 大小写敏感规则为敏感， 执行 git pull ，并不会拿到最新的更新。比如自己想要的是第一次修改后的 A.js ，但是服务器有一个没7. 有更新的 A.js 和 有更新的 a.js,而你只能拿到前者，所以就会遇到各种各样的坑……

### 解决办法

执行git config --global core.ignorecase false，全局设置 大小写敏感 。

1. 文件变更比较少的情况
直接使用以下命令重命名文件，在 git 中不要直接修改文件名，最好的办法是使用下面的方式，

```bash
git mv -f [你想要删掉的文件] [你想要留下的文件]
git mv -f a.js A.js

## 等同于：

git rm a.js
git add A.js
```

这个命令的目的就是删除不需要的大小写同名文件，修改后 git push 提交变更即可。

2. 变更比较多，并且拥有分支较高权限

- 在 github 删除该分支
- 本地执行 git rm -r --cached . (注意后面‘点号’)
- 然后重新 git push，就ok了
此法不太好，有点暴力，容易出问题，但适用于 变更发生于近期的情况。

总结：
其实看解决办法的话，只是一个很小的问题，但是出现的 bug 确实是让人很头疼的，因为 mac windows 在不设置大小写敏感规则的时候默认大小写是不敏感，项目部署的机器是 Linux 的，而 Linux 是大小写敏感的。所以这样的问题平时不易发现，本地调试的时候大部分时候并不会出错误，只有在项目部署的时候问题才会显示出来。

## git push同时推送到两个远程仓库

[原文地址](https://www.jianshu.com/p/edc85a20ada9)

进入你的项目目录，打开.git/config文件(.git是隐藏目录，需要打开显示隐藏文件…)

在url = xxx下再加一行其他远程库的路径，例如，开源中国的：

此后，你只需要git push origin master，即可同时推送到两个不同仓库的master。

## git 别名配置

```bash
  git config --global alias.co checkout
  git config --global alias.br branch
  git config --global alias.ci commit
  git config --global alias.st status
```

## git 根据用户名统和时间查看代码统计

[参考:git 时间 查看代码统计](https://www.csdn.net/tags/OtTaEg4sNzU1NC1ibG9n.html)
[参考:gitlab代码查看行数](https://blog.csdn.net/fsjwin/article/details/122267764)
[参考:git log排除文件](https://www.csdn.net/tags/MtjaYg3sNjE1NTMtYmxvZwO0O0OO0O0O.html)

```sh
# 代码量统计
# 说明 ":(exclude)nouse" 为需要排除的文件  -- since开始时间 --until 结束时间   git log '分支名称'
git log --format='%aN' | sort -u | while read name; do echo -en "$name\t"; git log 'bowen' --author="$name" --since=2022-02-07 --until=2022-8-15 --pretty=tformat: --numstat  -- . ":(exclude)nouse_backup"  ":(exclude)package-lock.json" ":(exclude)yarn.lock"   | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }' -; done
```

## git worktree 的使用

参考 [git worktree 使用笔记](https://www.cnblogs.com/jasongrass/p/11178079.html)

### 工作模式

- worktree add 新的文件夹
- 打开的文件夹下载依赖后修改
- 测试没问题后  git push -u origin HEAD:目标分支
- 删除新的文件夹  git worktree prune 清理

### 注意事项

worktree 不允许两个 worktree 使用同一个分支。如果有这个需要怎么办？

- 新建一个分支，reset 到目标分支，再基于这个新分支工作，效果一样。
- 新建一个分支，使用 git push -u origin HEAD:目标分支， 目标分支再 pull

使用后不使再用的 worktree 删除后 ，运行 git worktree prune 清理
