---
title: 常用AI辅助编程VSCode插件
date: 2023-6-1T18:13:47.000Z
tags:
  - AI
  - ChatGPT
  - VSCode
categories: AI
---

## VSCode 插件

### github Copilot

开发和编写文档的神器 挺贵的 可以尝试使用淘宝上的30块设置学生包，但有被封号的风险
可以动态代码提示 根据注释生成代码
<https://github.com/features/copilot/>

### GitHub Copilot Labs

[参考文档](https://juejin.cn/post/7205755166892113981)

github Copilot 的功能增强版 配合 github Copilot使用就无敌了 主要功能如下

- explain 解释代码
- langeuage translation 语言翻译
- readable 使代码变得容易度
- add types 添加 ts 类型
- fix bug
- debug  加日志
- clean 清理日志
- list steps  列出步骤和和注释
- make robust 使代码更健壮
- chunk 代码分块
- document 生成注释
- custom 自定义刷子（想要干什么直接说就行）
- test generation 生成测试代码

缺点：不能设置语言 默认英文 （可以修改prompt为中文 让其返回中文 但是没法保存 每次都要改比较麻烦 ）

<https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-labs>

### Code GPT

目前是 gpt 中下载量最大的插件
需要 openai 的 api key 建议使用新注册的账号可以免费使用几个月（只有5美元的额度 后期不够需要自己充值）
功能可以在vscode 内问 chatgpt

- `CodeGPT Chat`：使用扩展栏中的图标打开聊天界面
- `Get Code`：创建一个要求特定代码的评论，CodeGPT 将打开一个带有代码的新编辑器（您无需编写代码语言。CodeGPT 会自动检测）。
- `Ask CodeGPT`: CodeGPT 将打开一个新的编辑器并回答问题。
- `Ask CodeGPT - code selected`：选择代码并提出问题，CodeGPT 将打开一个新的编辑器并回答问题。 （这个功能没有了）
- `Compile & Run CodeGPT`: CodeGPT 将编译并运行您选择的代码。
- `Ask StackOverflow`：使用 Stackoverflow API 和 Code GPT 搜索问题将显示最佳人类答案，然后是 AI 答案。
- `Explain CodeGPT`：CodeGPT 将打开聊天部分并解释所选代码。
- `Refactor CodeGPT`：CodeGPT 将打开聊天部分并重构所选代码。
- `Document CodeGPT`：CodeGPT 将打开聊天部分并记录所选代码。
- `Find Problems CodeGPT`：CodeGPT 将打开聊天部分并查找所选代码中的任何问题。
- `Unit Test CodeGPT`：CodeGPT 将打开聊天部分并创建所选代码的单元测试。

基本上 就是内置 的 chatgpt 但是 有一些辅助功能比较好用 ，相当于可以少打一些提问的词语
例如： Explain CodeGPT 解释代码 Refactor CodeGPT 重构代码 Document CodeGPT 记录代码 Find Problems CodeGPT 查找问题 Unit Test CodeGPT 创建单元测试 Get Code  根据注释生成代码

但辅助编码这方面不如 GitHub Copilot Labs 好用
优点是可以设置中文

<https://marketplace.visualstudio.com/items?itemName=DanielSanMedium.dscodegpt>
