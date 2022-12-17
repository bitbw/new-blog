---
title: path.resolve()的使用
date: 2020-12-30 13:34:08
tags:
  - Nodejs
  - path
  - Nodejs
categories: Nodejs
cnblogs:
  postid: "15392982"
hash: 9ff99a267e6386c1796d7355ff8dd341908d239525d89dd539eb438e31d51cc0
---

## 路径解析：path.resolve([from ...], to)

学习 webpack 遇到 path.resolve 但文档读完一遍很懵圈；

网上搜到一篇比较有用的文章 https://blog.csdn.net/kikyou_csdn/article/details/83150538

同时也给出了 join 连接路径和 resolve 路径解析的不同 ：https://www.cnblogs.com/moqiutao/p/8523955.html

这篇文章中有个比较好理解的观点就是 把 resolve 想象成 cd 命令。这样就容易理解了：

path.resolve()方法可以将多个路径解析为一个规范化的绝对路径。其处理方式类似于对这些路径逐一进行 cd 操作，与 cd 操作不同的是，这引起路径可以是文件，并且可不必实际存在（resolve()方法不会利用底层的文件系统判断路径是否存在，而只是进行路径字符串操作）。例如：

```
path.resolve('foo/bar', '/tmp/file/', '..', 'a/../subfile')
```

相当于

```
cd foo/bar
cd /tmp/file/
cd ..
cd a/../subfile
pwd
```

例子：

```
path.resolve('/foo/bar', './baz')
// 输出结果为
'/foo/bar/baz'
path.resolve('/foo/bar', '/tmp/file/')
// 输出结果为
'/tmp/file'

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif')
// 当前的工作路径是 /home/itbilu/node，则输出结果为
'/home/itbilu/node/wwwroot/static_files/gif/image.gif'
```

## 总结

- ./ 和目录名前面什么都不加代表当前目录下执行 cd

- / 表示根目录下执行 cd

- 所以要判断最后出来的是根目录还是当前工作目录看第一个参数的目录名前面是/ 还是 ./和什么都没加
