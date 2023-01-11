---
title: 代码编辑器插件 codemirror 和 monaco-editor 的使用
date: 2022-09-06T13:45:56.000Z
tags:
  - monaco-editor
  - codemirror
categories: js插件
hash: ca7077b708df562e6656ef6412cec263f2e0eba97c68a26b42567155bfea7187
cnblogs:
  postid: '17041162'
---

## codemirror

[codemirror 官方文档](https://codemirror.net/5/index.html)
[vue-codemirror 官方文档](https://v1.github.surmon.me/vue-codemirror/)
[vue-codemirror 官方 examples](https://github.com/surmon-china/surmon-china.github.io/tree/vue2/projects/vue-codemirror/examples)
因为是本项目是 vue2 所以先记录 vue2 中的使用

### 安装

4.0.6 配合 vue2

```sh
npm install vue-codemirror@4.0.6 
```
<!-- more -->
### 使用

```vue
<template>
  <div class="codemirror">
    <codemirror v-model="code" :options="cmOption" />
  </div>
</template>

<script>
import dedent from "dedent";
import { codemirror } from "vue-codemirror";
// base style
import "codemirror/lib/codemirror.css";
// language
import "codemirror/mode/vue/vue.js";
// theme css
import "codemirror/theme/base16-dark.css";

export default {
  name: "codemirror-example-vue",
  title: "Mode: text/x-vue & Theme: base16-dark",
  components: {
    codemirror,
  },
  data() {
    return {
      code: dedent`
          <template>
            <h1>Hello World!</h1>
            <codemirror v-model="code" :options="cmOption" />
          </template>

          <script>
            // import 'some-codemirror-resource'
            export default {
              data() {
                return {
                  code: 'const A = 10',
                  cmOption: {
                    tabSize: 4,
                    styleActiveLine: true,
                    lineNumbers: true,
                    line: true,
                    foldGutter: true,
                    styleSelectedText: true,
                    mode: 'text/javascript',
                    keyMap: "sublime",
                    matchBrackets: true,
                    showCursorWhenSelecting: true,
                    theme: "monokai",
                    extraKeys: { "Ctrl": "autocomplete" },
                    hintOptions:{
                      completeSingle: false
                    }
                  }
                }
              }
            }
          ${"<\\/script>"}

          <style lang="scss">
            @import './sass/mixins';
            @import './sass/variables';
            main {
              position: relative;
            }
          </style>
        `,
      cmOption: {
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        mode: "text/x-vue",
        lineWrapping: true,
        theme: "base16-dark",
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.codemirror {
  width: 100%;
  height: 100vh;
  ::v-deep {
    .CodeMirror {
      height: 100vh;
    }
  }
}
</style>

```

> 注意 没有如果默认安装 `dedent` 还需要安装一下 `dedent`

## Monaco Editor

[github地址](https://github.com/microsoft/monaco-editor)
[Monaco Editor 官网](https://microsoft.github.io/monaco-editor/)

Monaco Editor 就是 网页版的 vscode 所以编辑功能更强大, 但相对体积也更大

### 安装

```sh
npm install monaco-editor
```

### 使用

[Monaco Editor 所以使用示例](https://github.com/microsoft/monaco-editor/tree/main/samples)

使用方式有很多种 因为是 vue 项目所以直接使用[集成 ESM](https://github.com/microsoft/monaco-editor/blob/main/docs/integrate-esm.md)方式

```vue
<template>
  <div class="monaco-editor">
    <div id="container" style="height: 100%"></div>
  </div>
</template>

<script>
import * as monaco from "monaco-editor";
let monacoInstance;
export default {
  name: "MonacoEditor",
  mounted() {
    monacoInstance = monaco.editor.create(
      document.getElementById("container"),
      {
        value: "function hello() {\n\talert('Hello world!');\n}",
        language: "javascript",
        theme: "vs-dark",
      }
    );
  },
  destroyed() {
    monacoInstance.dispose();
  },
};
</script>

<style lang="scss" scoped>
.monaco-editor {
  width: 100%;
  height: 100vh;
}
</style>
```

vue.config.js

```js
const { defineConfig } = require("@vue/cli-service");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [new MonacoWebpackPlugin()],
  },
});

```
