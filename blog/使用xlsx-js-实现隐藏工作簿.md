---
title: 使用xlsx.js 实现隐藏工作簿
date: 2020-12-13 17:15:41
tags:
  - js
  - XLSX
  - 插件
categories: js插件
cnblogs:
  postid: "15393034"
hash: 9b511f3e37f1fedda5a38b2a66fe5fc2938ad32046f9bf01440307e6525e96fb
---

[SheetJS js-xlsx](http://sheetjs.com/) 中文文档： https://github.com/rockboom/SheetJS-docs-zh-CN

下面是对工作簿能见度的描述文档

## 数据表能见度

Excel 支持将表格隐藏在更低的标签栏。表格数据存储文件内，但是 UI 不容易让它可以使用。标准的隐藏表格会被显示在"Unhide"菜单内。Excel 也有"very hidden"表格，这些表格不能被显示在菜单内。只可以通过 Vb 编辑器访问。

能见度的设置被存储在表格属性数组的`Hidden`属性当中。

| Value | Definition  |
| ----- | ----------- |
| 0     | Visible     |
| 1     | Hidden      |
| 2     | Very Hidden |

更多详情请查看https://rawgit.com/SheetJS/test_files/master/sheet_visibility.xlsx：

```
> wb.Workbook.Sheets.map(function(x) { return [x.name, x.Hidden] })
[ [ 'Visible', 0 ], [ 'Hidden', 1 ], [ 'VeryHidden', 2 ] ]
```

非 Excel 格式不支持"Very Hidden"状态。测试一个数据比哦啊是否可见的最好方式是检查是否`Hidden`属性为逻辑 truth：

```
> wb.Workbook.Sheets.map(function(x) { return [x.name, !x.Hidden] })
[ [ 'Visible', true ], [ 'Hidden', false ], [ 'VeryHidden', false ] ]
```

文档上对工作簿隐藏有说明，但是没有具体的隐藏方法，尝试直接修改工作簿的`Hidden`属性，没有任何效果， 但是皇天不负有心人， 通过查看 [源码](https://github.com/SheetJS/sheetjs/blob/master/xlsx.js) 发现了实现工作簿隐藏的方法

## XLSX.utils.book_set_sheet_visibility 方法

下面是源码中方法的定义

```js
/* set sheet visibility (visible/hidden/very hidden) */
utils.book_set_sheet_visibility = function (wb, sh, vis) {
  get_default(wb, "Workbook", {});
  get_default(wb.Workbook, "Sheets", []);

  var idx = wb_sheet_idx(wb, sh);
  // $FlowIgnore
  get_default(wb.Workbook.Sheets, idx, {});

  switch (vis) {
    case 0:
    case 1:
    case 2:
      break;
    default:
      throw new Error("Bad sheet visibility setting " + vis);
  }
  // $FlowIgnore
  wb.Workbook.Sheets[idx].Hidden = vis;
};
```

方法分别传入三个参数：

- 工作表对象，
- 工作簿在工作簿数组中的下标，
- 需要设置的`Hidden`属性的值 （0，1，2）

工作表对象生成方法见文档,下面用`workbook`表示，工作簿在工作簿数组中的下标，可以通过 workbook.SheetNames 找到对应的下标

## 具体实现：

```js
  // 隐藏采购员表   因为整个xlsx的使用是以class实现的这里截取隐藏工作表的方法
  hideBuyerSheet(){
    let indexs = [];
    for (const [i,name] of this.workbook.SheetNames.entries()) {
      if(/采购员/.test(name)){ //找到所有带采购员名称的表的下标
        indexs.push(i);
      }
    }
    for (const i of indexs) {
       // 将对应下标的工作簿隐藏
      XLSX.utils.book_set_sheet_visibility(this.workbook, i, 1);
    }
  }
```
