---
title: XLSX.js的使用
date: 2020-07-30 09:20:05
tags:
  - XLSX
  - js
categories: 插件
cnblogs:
  postid: "15393029"
hash: a8bd6f6276eefa8d084d8dd0032b8b90e07475492905c6333f5f1346551b2f13
---

[SheetJS js-xlsx](http://sheetjs.com/) 中文文档： <https://github.com/rockboom/SheetJS-docs-zh-CN>

## 使用步骤

```js
  // 从头开始创建工作簿
  var wb = XLSX.utils.book_new();
  /**
   * 创建工作表
   * aoa_to_sheet    二维数组
   * json_to_sheet   对象数组
   * table_to_sheet  tableDOM
   */
  let ws= XLSX.utils.json_to_sheet(json);
  // 把工作表添加到工作簿中
  XLSX.utils.book_append_sheet(wb, ws, "sheet");
  // 写入 （node）
  XLSX.writeFile(wb, path.resolve(__dirname, "./test.xlsx"), {
    type: "buffer",
    Props: { Author: "author" },
  });

```

## merges 的使用

```js
........
// 设置单元格合并
data["!merges"] = [{
    s: {//s为开始
        c: 1,//开始列
        r: 0//可以看成开始行,实际是取值范围
    },
    e: {//e结束
        c: 4,//结束列
        r: 0//结束行
    }
}];
........
```
