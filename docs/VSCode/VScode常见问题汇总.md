---
title: VScode常见问题汇总
date: 2021-11-18T16:54:46.000Z
tags:
  - vscode
categories: 工具使用
hash: a316ce726c17943f63d4ac97fce927edf4271c21964018b9b8a331dabfc310e2
cnblogs:
  postid: '15766330'
---

## Remote-SSH 插件

[文章地址](https://blog.csdn.net/WindSunLike/article/details/103292922)
[解决vscode远程连接报尝试写入的管道不存在，ssh remote， The process tried to write to a nonexistent pipe.](https://zhuanlan.zhihu.com/p/664354803)


### 遇到的问题

如果报管道错误，可能是以下问题

你的Linux服务器的ssh配置有问题，通过修改配置测试是否解决问题。
删除在服务器上创建的“ .vscode-server”目录。这是在主目录中创建的隐藏目录（您可以使用“ ls -la”显示我相信的所有文件）。可能是一些不正确的数据被缓存在那里，因此删除目录将使您的情况更加整洁。删除后，可以尝试通过vscode上的remote-ssh重新连接。
如果还是不行，可以尝试重新使用ftp将本地公钥上传到Linux上，然后将其复制到authorized_keys文件中，设置权限，重启SSH服务器，重新连接

### 注意事项

在使用公钥第一次连接到Linux时候，可能会让你输入密码，连接完成后，会在你的用户.ssh目录中中生成一个文件known_hosts，这个目录中还有公钥和私钥id-rsa.pub和id-rsa，然后将公钥上传到服务器上，重新重复上面的复制到.ssh/authorized_keys，并且重新设置权限，再重新尝试连接到Linux，就不需要再输入密码了

