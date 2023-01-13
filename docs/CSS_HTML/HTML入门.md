---
title: HTML入门
date: 2016-05-21T20:54:00.000Z
tags:
  - HTML
categories: HTML
cnblogs:
  postid: '15392425'
hash: 27a2c4add02dac43f76c3316ead3150ee0c226603e38241dcc7732ba100c2b07
---

![下载](https://s2.loli.net/2023/01/13/K38h2unAm9IdsgZ.jpg)

## 开发工具

- chrome
- sublime
- photoshop

## 主要浏览器

- IE
- 火狐（Firefox）
- 谷歌（chrome）
- safari
- opera

## 浏览器内核

- Trident(IE 内核)
- Gecko(firefox)
- webkit(Safari)
- Chromium/Blink(chrome)
- Presto(Opera)

## HTML 骨架格式

- 1 HTML 标签：

  作用所有 HTML 中标签的一个根节点。 最大的标签 根标签

- 2 head 标签： 文档的头部

  文档的头部描述了文档的各种属性和信息，包括文档的标题、在 Web 中的位置以及和其他文档的关系等。绝大多数文档头部包含的数据都不会真正作为内容显示给读者。注意在 head 标签中我们必须要设置的标签是 title

- 3.title 标签： 文档的标题

  作用：让页面拥有一个属于自己的标题。

- 4.body 标签：文档的主体 以后我们的页面内容 基本都是放到 body 里面的

  body 元素包含文档的所有内容（比如文本、超链接、图像、表格和列表等等。）

## HTML 标签分类

- 1.双标签 <标签名> 内容 </标签名> 比如 `<body>`我是文字 `</body>`
- 1.嵌套(包含)关系 `<head> <title> </title> </head>`

## HTML 标签关系

- 1.嵌套(包含)关系 `<head> <title> </title> </head>`
- 2.并列关系 `<head></head><body></body>`

## sublime 一些常用快捷键

![1574421790594](https://s2.loli.net/2023/01/13/vLUgBhE4kAQZNyX.png)

## 字符集

- utf-8 是目前最常用的字符集编码方式，常用的字符集编码方式还有 gbk 和 gb2312。
- gb2312 简单中文 包括 6763 个汉字
- BIG5 繁体中文 港澳台等用
- GBK 包含全部中文字符 是 GB2312 的扩展，加入对繁体字的支持，兼容 GB2312
- UTF-8 则包含全世界所有国家需要用到的字符
- 记住一点，以后我们统统使用 UTF-8 字符集, 这样就避免出现字符集不统一而引起乱码的情况了。

## HTML 常用标签

```html
标题标签 (熟记) head 头部. 标题 title 文档标题 HTML提供了6个等级的标题
<h1>
  <h2>
    <h3>
      <h4>
        <h5>
          和
          <h6>
            段落标签( 熟记)
            <p>文本内容</p>
            水平线标签(认识)
            <hr />
            是单标签 换行标签(熟记) <br />
          </h6>
        </h5>
      </h4>
    </h3>
  </h2>
</h1>
```

## 文本格式化标签(熟记)

<!-- ![1574422211138](./html1/1574422211138.png) -->

## img 标记属性

- src 图像的路径
- alt 图像不能显示时的替换文本
- title 鼠标悬停时显示的内容
- width 设置图像的宽度
- height 设置图像的高度
- border 设置图像边框的宽度

## 链接标签(重点)

`<a href="跳转目标" target="目标窗口的弹出方式">文本或图像</a>`

target：用于指定链接页面的打开方式，其取值有 self 和\_blank 两种，其中 self 为默认值，blank 为在新窗口中打开方式。

#### 注意

> 1.外部链接 需要添加 http:// www.baidu.com 2.内部链接 直接链接内部页面名称即可 比如`< a href="index.html"> 首页 </a >` 3.如果当时没有确定链接目标时，通常将链接标签的 href 属性值定义为“#”(即 href="#")，表示该链接暂时为一个空链接。 4.不仅可以创建文本超链接，在网页中各种网页元素，如图像、表格、音频、视频等都可以添加超链接。

## 锚点定位 （难点）

vk control control 1.使用相应的 id 名标注跳转目标的位置。

`<h3 id="two">第2集</h3>`

2.使用“a href=”#id 名>“链接文本"`</a>`创建链接文本（被点击的）`<a href="#two">`

## base 标签 基本的

- base 可以设置整体链接的打开状态
- base 写到 `<head> </head>` 之间
- 把所有的连接 都默认添加 target="\_blank"

## 特殊字符标签 （理解）

![1574422894085](https://s2.loli.net/2023/01/13/Z3CqnQtd5E7joUm.png)

## 路径(重点、难点)

### 相对路径

1.图像文件和 HTML 文件位于同一文件夹：只需输入图像文件的名称即可，如`<img src="logo.gif" />`。

2.图像文件位于 HTML 文件的下一级文件夹：输入文件夹名和文件名，之间用“/”隔开，如`<img src="img/img01/logo.gif" />`。

3.图像文件位于 HTML 文件的上一级文件夹：在文件名之前加入“../” ，如果是上两级，则需要使用 “../ ../”，以此类推，如`<img src="../logo.gif" />`。

### 绝对路径

绝对路径以 Web 站点根目录为参考基础的目录路径。之所以称为绝对，意指当所有网页引用同一个文件时，所使用的路径都是一样的

“D:\web\img\logo.gif”，或完整的网络地址，例如“<http://www.itcast.cn/image/logo.gif>”。
