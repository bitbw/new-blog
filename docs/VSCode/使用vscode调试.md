---
title: 使用vscode调试代码
date: 2021-03-09 10:27:53
tags:
  - vscode
categories: 工具使用
cnblogs:
  postid: "15393033"
hash: 3941b452d96d24365f30e489c0ee06a748bace977e7357b30286cfc56471bf9a
---

## 使用 vscode 直接调试 js 代码

### 步骤

- 将当前标签页设置为需要调试的 js
- 将需要打断点的地方标上小红点
- 左侧工具栏点击小虫子（Run and Debug）
- 点击运行和调试
- 选择 nodejs 作为调试工具
- 开始调试

![image-20210309103224511](https://bitbw.top/public/img/my_gallery/image-20210309103224511.png)

如果只调试 js 代码的话，选择 nodejs 即可

![image-20210309103344902](https://bitbw.top/public/img/my_gallery/image-20210309103344902.png)

### 调试界面

![image-20210309103733550](https://bitbw.top/public/img/my_gallery/image-20210309103733550.png)

### 总结

使用 vscode 调试非常方便，比直接在浏览器中调式体验更好，可以边调试边改代码，很爽的体验；

## launch 和 tasks 的使用

### launch 的使用

待完成

### tasks（任务）的使用

官网：https://code.visualstudio.com/docs/editor/tasks#_variable-substitution

### 预定义变量

官网：https://code.visualstudio.com/docs/editor/variables-reference#_predefined-variables

知乎：https://zhuanlan.zhihu.com/p/92175757

### tasks.json

> 具体的配置文件

```json
{
    // See https://go.microsoft.com/fwlink/?LinkId=733558
    // for the documentation about the tasks.json format
    "version": "2.0.0",
    "options": {
        "cwd": "${fileDirname}" // 定义执行环境
    },
    "tasks": [
        {
            "label": "build",
            "type": "shell",
            "command": "ruler  -p  ${fileBasename}",
            "problemMatcher": {
                "fileLocation": [
                    "relative",
                    "${fileDirname}"
                ],
                "pattern": {
                    // 提示文本进行分组 下面是具体的提示文本
                    // s920.rule:652:1: warning 规则Server,"软件预装","os"已在647行定义
                    "regexp": "^(.*):(\\d+):(\\d+):\\s+(warning|error)\\s+(.*)$",
                    "file": 1,			// 文件名所在组
                    "line": 2,			// 代码所在行
                    "column": 3,		// 代码所在列
                    "severity": 4,		// warning 还是 error
                    "message": 5		// 提示文本
                }
            },
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "shared",
                "showReuseMessage": false,
                "clear": true
            },
            "group": "build"
        },
    	{
            ...
        }
    ]
}
```

## 注意事项

使用 launch 时.vscode 目录一定要在所打开文件夹的根节点下

否则点击运行启动调试则只能调试当天打开的 tab 标签页

![image-20210723134611394](https://bitbw.top/public/img/my_gallery/vscode%E8%B0%83%E8%AF%95%E6%B3%A8%E6%84%8F01.png)
