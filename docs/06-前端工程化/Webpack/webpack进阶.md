---
title: webpack进阶
date: 2021-05-02T16:24:55.000Z
tags:
  - Webpack
  - Webpack-cli
categories: Webpack
hash: a08bd3cd2983ed3307ede1defc6c1e8479df029cc3b5f1506f34b1d31cf31041
cnblogs:
  postid: '17041148'
---



## loader

loader 用于转换某些类型的模块
loader 用于对某些导入的资源进行特定处理 例如 css image...

### 原理

 loader本质上是一个函数

### 手写一个 babelLoader

webpack.config.js

```js
const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babelLoader', // 自定义的 babelLoader
        options: {
          presets: [
            '@babel/preset-env'
          ]
        }
      }
    ]
  },
  // 配置 loader 路径解析规则  babelLoader 先去  node_modules 中找找不到再去 "./loaders" 下找
  resolveLoader: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'loaders')
    ]
  }
}
```

babelLoader.js

```js
const { getOptions } = require('loader-utils');
const { validate } = require('schema-utils');
const babel = require('@babel/core');
const util = require('util');

const babelSchema = require('./babelSchema.json');

// babel.transform用来编译代码的方法 是一个普通异步方法
// util.promisify将普通异步方法转化成基于promise的异步方法
const transform = util.promisify(babel.transform);

module.exports = function (content, map, meta) {
  
  // 获取loader的options配置
  const options = getOptions(this) || {};

  // 校验babel的options的配置
  validate(babelSchema, options, {
    name: 'Babel Loader' // 报错的提示名称
  });

  // 创建异步 callback 将内容传给下一个 loader
  const callback = this.async();

  // 使用babel编译代码
  transform(content, options)
    .then(({code, map}) => callback(null, code, map, meta))
    .catch((e) => callback(e))

}
```

babelSchema.json  验证规则

```json
{
  // 需要验证的参数的类型
  "type": "object",
  "properties": {
    // 参数名称
    "presets": {
      // 参数类型
      "type": "array" 
    }
  },
  // 是否允许添加新的属性
  "addtionalProperties": true
}
```

## Plugins

Plugin  插件可以用于执行范围更广的任务。包括：打包优化，资源管理，注入环境变量。

### 原理

 Plugin 实例 插件是一个具有 apply 方法的 JavaScript 对象。apply 方法会被 webpack compiler 调用，并且在 整个 编译生命周期都可以访问 compiler 对象。

ConsoleLogOnBuildWebpackPlugin.js

```js
const pluginName = 'ConsoleLogOnBuildWebpackPlugin';

class ConsoleLogOnBuildWebpackPlugin {
  apply(compiler) {
    compiler.hooks.run.tap(pluginName, (compilation) => {
      console.log('webpack 构建正在启动！');
    });
  }
}

module.exports = ConsoleLogOnBuildWebpackPlugin;
```

### compiler 钩子

Compiler 可以看做是 运行时的webpack对象
Compiler.hooks 上有 webpack 运行时生命周期的各个 hook， 这些 hook（extends）自 Tapable 类

#### Tapable 使用

```js
// tabpable 提供一系列创建钩子和调用钩子的方法  （发布者订阅者模式）
const tapable = require('tapable');

const {
  // 同步执行 串行
  SyncHook,
  // 同步执行 串行 遇到返回值 退出执行
  SyncBailHook,
  // 异步并行 并行行1个钩子出错 不影响其他钩子触发
  AsyncParallelHook,
  // 异步串行 串行1个钩子出错 后面的钩子就不再触发
  AsyncSeriesHook,
} = tapable;

class HookTest {
  constructor() {
    this.hooks = {
      // hooks 的容器
      go: new SyncHook(['arg1', 'arg2']), // 参数数组的长度 是 回调函数的所能接受参数的长度
      asyncGo: new AsyncParallelHook(['arg1']),
    };
  }

  //  向容器里添加对应的钩子函数 （添加订阅者）
  tap() {
    // tap  在 go （SyncHook）容器（相当于一个map） 添加键值--- key -> synchook1, value -> 回调函数
    this.hooks.go.tap('synchook1', (...args) => {
      console.log('synchook1 触发了 args:', args);
      return 123;
    });
    this.hooks.go.tap('synchook2', (...args) => {
      console.log('synchook2 触发了 args:', args);
    });
    // tapAsync 添加一个异步执行的函数  函数内部接受一个 callback , callback 调用代表 函数执行完毕
    this.hooks.asyncGo.tapAsync('asynchook1', (...args) => {
      let callback = args[args.length - 1];
      setTimeout(() => {
        console.log('asynchook1 回调异步 触发了 arg1:', args[0]);
        // 异步函数执行完毕 callback 第一参数 是错误
        callback(null, 'asynchook1');
      }, 3000);
    });
    // tapPromise 添加一个异步执行的函数 函数返回一个 promise
    this.hooks.asyncGo.tapPromise('asynchook2', (arg1) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('asynchook2  Promise 异步 触发了 arg1:', arg1);
          // 异步函数执行完毕
          resolve('asynchook2');
        }, 1000);
      });
    });
  }
  //   触发所有钩子中的函数 （发布订阅）
  call() {
    this.hooks.go.call('这是同步钩子调用的参数');
    // 最后一个传入的参数 就是回调函数 callback
    // 当所有 钩子都执行完了,(或有一个出错误时) 就会触发这个 函数
    this.hooks.asyncGo.callAsync('这是异步钩子调用的参数', function (err, res) {
      // 代表所有leave容器中的函数触发完了，才触发
      console.log('异步钩子 end~~~');
    });
  }
}

const test = new HookTest();

test.tap();
test.call();
```

### Compilation

[Compilation](https://webpack.docschina.org/api/compilation-hooks/)
compilation 由 Compiler 创建, 包含所有模块和对应依赖 , 同样也有各个生命周期的 hook 同 compiler.hooks

### 手写一个 CopyWebpackPlugin

CopyWebpackPlugin.js

```js
const { validate } = require('schema-utils');
const schema = require('./schema').CopyWebpackPlugin;
const globby = require('globby');
const path = require('path');
const { readFile } = require('fs').promises;
const { RawSource } = require('webpack').sources;

class CopyWebpackPlugin {
  constructor(options) {
    this.options = options;
    validate(schema, options);
    this.compiler = null;
    this.compilation = null;
  }

  apply(compiler) {
    // compiler  初始化 compilation
    this.compiler = compiler;
    compiler.hooks.thisCompilation.tap('CopyWebpackPlugin', (compilation) => {
      this.compilation = compilation;
      // 为 compilation 创建额外 asset
      compilation.hooks.additionalAssets.tapPromise(
        'CopyWebpackPlugin',
        this.hanleCopy.bind(this),
      );
    });
  }
  async hanleCopy() {
    let { from, ignore, to = '.' } = this.options;
    const context = this.compiler.options.context; // process.cwd()
    // 判断是 from 否为绝对路径
    from = path.isAbsolute(from) ? from : path.resolve(process.cwd(), from);
    // window 下有路径问题
    from = from.replace(/\\/g, '/');
    // 1. 获取 from 文件列表
    let files = await globby(from, {
      ignore,
    });
    for (const file of files) {
      // 2. 读取文件
      let filename = path.join(to, path.basename(file));
      let buf = await readFile(file);
      // 3. 写入文件
      let source = new RawSource(buf);
      this.compilation.emitAsset(filename, source);
    }
  }
}

module.exports = CopyWebpackPlugin;

```

webpack.config.js

```js
const CopyWebpackPlugin = require('../plugins/CopyWebpackPlugin');
module.exports = {
  mode: 'development', // production
  plugins: [
    new CopyWebpackPlugin({
      to: '.',
      from: 'public',
      ignore: ['*/index.html'],
    }),
  ],
};

```

schema

```js
module.exports = {
  CopyWebpackPlugin: {
    type: 'object', // options 类型
    properties: {
      to: {
        type: 'string',
      },
      from: {
        type: 'string',
      },
      ignore: {
        type: 'array',
      },
    },
    additionalProperties: false, // 可以添加更多key
  },
};

```

## 手写简易版 webpack

### 参考

- [mini webpack](https://github.com/ronami/minipack) 将多个文件打包到一个文件中
