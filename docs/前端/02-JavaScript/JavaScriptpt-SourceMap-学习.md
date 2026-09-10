---
title: JavaScriptpt SourceMap 学习
date: 2020-08-18T16:26:11.000Z
tags:
  - js
categories: js
hash: 85ac1e8f817398785306eae5c33cbfc5a8732ff9a4fe43ba6208f69dba2e5199
cnblogs:
  postid: '16228019'
---


## 学习资料

[阮一峰 JavaScript Source Map 详解](https://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html)

## Source map的格式

看一下项目中由 vue-cli 生成的 source map

源文件

```js
// 下面代码是在一行显示
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["404"],{"077b":function(n,c,t){"use strict";t("cfb7")},"8cdb":function(n,c,t){"use strict";t.r(c);var e=function(){var n=this,c=n.$createElement,t=n._self._c||c;return t("div",{staticClass:"container"},[n._v("404")])},s=[],i={},u=i,a=(t("077b"),t("0c7c")),l=Object(a["a"])(u,e,s,!1,null,null,null);c["default"]=l.exports},cfb7:function(n,c,t){}}]);
//# sourceMappingURL=404.f6b2607e.js.map
```
```js
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    _vm._b({ staticClass: "container" }, "div", false),
    [_vm._v("404")]
  )
}
var staticRenderFns = []
render._withStripped = true

export { render, staticRenderFns }
```

source map

```json
{
    "version": 3,
    "sources": [
        "webpack:///./src/views/404.vue?1c47",
        "webpack:///./src/views/404.vue?abb9",
        "webpack:///src/views/404.vue",
        "webpack:///./src/views/404.vue?ead0",
        "webpack:///./src/views/404.vue"
    ],
    "names": [
        "render",
        "_vm",
        "this",
        "_h",
        "$createElement",
        "_c",
        "_self",
        "staticClass",
        "_v",
        "staticRenderFns",
        "component"
    ],
    // 压缩后的代码只有一行所以没有; 号
    "mappings": "uGAAA,W,2CCAA,IAAIA,EAAS,WAAa,IAAIC,EAAIC,KAASC,EAAGF,EAAIG,eAAmBC,EAAGJ,EAAIK,MAAMD,IAAIF,EAAG,OAAOE,EAAG,MAAM,CAACE,YAAY,aAAa,CAACN,EAAIO,GAAG,UACvIC,EAAkB,GCGP,KCJ4V,I,wBCQvWC,EAAY,eACd,EACAV,EACAS,GACA,EACA,KACA,KACA,MAIa,aAAAC,E",
    "file": "js/404.f6b2607e.js",
    "sourcesContent": [
        "export * f..... "
    ],
    "sourceRoot": ""
}
```

```
　　- version：Source map的版本，目前为3。

　　- file：转换后的文件名。

　　- sourceRoot：转换前的文件所在的目录。如果与转换前的文件在同一目录，该项为空。

　　- sources：转换前的文件。该项是一个数组，表示可能存在多个文件合并。

　　- names：转换前的所有变量名和属性名。

　　- mappings：记录位置信息的字符串，下文详细介绍。
```

## mappings属性

下面才是真正有趣的部分：两个文件的各个位置是如何一一对应的。

关键就是map文件的mappings属性。这是一个很长的字符串，它分成三层。

>　第一层是**行对应**，以分号（;）表示，每个分号对应转换后源码的一行。所以，第一个分号前的内容，就对应源码的第一行，以此类推。
>
>　第二层是**位置对应**，以逗号（,）表示，每个逗号对应转换后源码的一个位置。所以，第一个逗号前的内容，就对应该行源码的第一个位置，以此类推。
>
>　第三层是**位置转换**，以[VLQ编码](https://en.wikipedia.org/wiki/Variable-length_quantity)表示，代表该位置对应的转换前的源码位置。

举例来说，假定mappings属性的内容如下：

>　mappings:"AAAAA,BBBBB;CCCCC"

就表示，转换后的源码分成两行，第一行有两个位置，第二行有一个位置。

## 位置对应的原理

每个位置使用五位，表示五个字段。

从左边算起，

>　- 第一位，表示这个位置在（转换后的代码的）的第几列。
>
>　- 第二位，表示这个位置属于sources属性中的哪一个文件。
>
>　- 第三位，表示这个位置属于转换前代码的第几行。
>
>　- 第四位，表示这个位置属于转换前代码的第几列。
>
>　- 第五位，表示这个位置属于names属性中的哪一个变量。

有几点需要说明。首先，所有的值都是以0作为基数的。其次，第五位不是必需的，如果该位置没有对应names属性中的变量，可以省略第五位。再次，每一位都采用VLQ编码表示；由于VLQ编码是变长的，所以每一位可以由多个字符构成。

如果某个位置是AAAAA，由于A在VLQ编码中表示0，因此这个位置的五个位实际上都是0。它的意思是，该位置在转换后代码的第0列，对应sources属性中第0个文件，属于转换前代码的第0行第0列，对应names属性中的第0个变量。

## VLQ编码

最后，谈谈如何用[VLQ编码](https://en.wikipedia.org/wiki/Variable-length_quantity)表示数值。

这种编码最早用于MIDI文件，后来被多种格式采用。它的特点就是可以非常精简地表示很大的数值。

VLQ编码是变长的。如果（整）数值在-15到+15之间（含两个端点），用一个字符表示；超出这个范围，就需要用多个字符表示。它规定，每个字符使用6个两进制位，正好可以借用[Base 64](https://en.wikipedia.org/wiki/Base_64)编码的字符表。

![img](https://s2.loli.net/2023/01/13/KF86cf5qdJxjC3Q.png)

在这6个位中，左边的第一位（最高位）表示是否"连续"（continuation）。如果是1，代表这６个位后面的6个位也属于同一个数；如果是0，表示该数值到这6个位结束。

>　Continuation
>　|　　　　　Sign
>　|　　　　　|
>　V　　　　　V
>　１０１０１１

这6个位中的右边最后一位（最低位）的含义，取决于这6个位是否是某个数值的VLQ编码的第一个字符。如果是的，这个位代表"符号"（sign），0为正，1为负（Source map的符号固定为0）；如果不是，这个位没有特殊含义，被算作数值的一部分。

## VLQ编码：实例

下面看一个例子，如何对数值16进行VLQ编码。

>　第一步，将16改写成二进制形式10000。
>
>　第二步，在最右边补充符号位。因为16大于0，所以符号位为0，整个数变成100000。
>
>　第三步，从右边的最低位开始，将整个数每隔5位，进行分段，即变成1和00000两段。如果最高位所在的段不足5位，则前面补0，因此两段变成00001和00000。
>
>　第四步，将两段的顺序倒过来，即00000和00001。
>
>　第五步，在每一段的最前面添加一个"连续位"，除了最后一段为0，其他都为1，即变成100000和000001。
>
>　第六步，将每一段转成Base 64编码。

查表可知，100000为g，000001为B。因此，数值16的VLQ编码为gB。上面的过程，看上去好像很复杂，做起来其实很简单，具体的实现请看官方的[base64-vlq.js](https://github.com/mozilla/source-map/blob/master/lib/source-map/base64-vlq.js)文件，里面有详细的注释。

转换VLQ编码 https://www.murzwin.com/base64vlq.html
