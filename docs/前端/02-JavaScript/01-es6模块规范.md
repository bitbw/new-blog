---
title: es6 模块规范
date: 2019-11-30T18:13:47.000Z
tags:
  - es6
  - js
categories: js
cnblogs:
  postid: '15392420'
hash: 65a8219cfa25d6d88fb2a05a87887ae0970af512a8686686f160bf929c9ce55f
---

### 导出 export

如果模块只有一个成员，建议 `export default`

```javascript
export default 数字|字符串|数组|对象|函数。。。任何数据
```

> 注意：
>
> 1.export default 只能有一次，重复会报错
>
> 2.使用时不要在后面做声明 var 、 let 、const 、直接写需要导出的对象或其他， 也可以先声明变量或常量， 再直接导出

如果一个模块有多个成员

```javascript
export default {
  成员1: 值,
  成员2: 值2,
  成员3...
}
```

> 如果成员之间没有依赖关系，不是用于某个数据的完整整体，不推荐，你可能只使用其中某个成员，而必须加载整体数据对象
>
> 除非这个对象是一个完整的整体，例如 Vue 组件的实例选项对象，这样是可以的

<!-- more -->

ECMAScript 6 提供了一种更优化的方案，当多个成员没有具体的依赖关系的时候，我们推荐使用 `export` 语法进行导出，因为它支持**按需加载**，就是说你用什么就只加载什么，其它多余的都不要，这样有利于程序的执行效率。

```javascript
export const a = 1;
export const b = 2;
```

也可以集中按需导出多个成员

```javascript
const a = 1;
const b = 2;
const c = 3;

// 语法就是这样，后面的成员也不是对象的简写方式， {} 中的成员必须当前模块能够访问的成员名称
export {
  // 不是 a: a 的简写，必须 a
  // a 必须是当前模块中的某个成员
  a,
  b,
  c,
};

// 以上写法等价于
// export const a = 1
// export const b = 2
// export const c = 3
```

有时候模块中有很多成员的时候，我们会 `export default` 和 `export` 一起使用。

我们把最常用的使用 `export default` 导出，把不太常用的使用 `export` 导出（用于按需加载）。

```javascript
export const a = 1;
export const b = 2;

export default function (x, y) {
  return x + y;
}
```

### 导入 import

加载 `export default` 成员

```javascript
import xxx from "模块路径";
```

按需加载 `export` 成员

```javascript
import { 成员1 as 别名, 成员2... } from '模块路径'
```

混着加载 `export default` 和 `export` 成员

```javascript
import xxx, { 成员1, 成员2... } from '模块路径'
```

一次性加载所有成员

```javascript
import * as xxx from "模块路径";
```

> 包括 `export default` 和 `export` 所有成员
>
> `export default` 就是一个名字叫 `default` 的成员，知道即可，不推荐这样来使用 `xxx.default`

下面是一个导出的例子：

```js
export default 123;

// export default 只能有1次，多次就报错，语法不允许
// export default 'hello'

// 如果你想导出多个成员，可以放到1个对象中
// export default {
//   a: 1,
//   b: 2
// }

// 大多数情况下我们其实只需要使用到对象中某几个成员，而不是所有
// ECMAScript 6 为了优化这一点，增加了：按需加载和导出功能
// 使用谁，加载谁，更有利于性能优化，打包优化
// 按需导出可以导出任意个成员
// 注意：export 成员必须有名字
export const a = 1;
export const b = "hello";
export const c = [1, 2, 3];

// 也不能这么写
// const d = 789
// export d

// export const d = 789
// export function hello () {
//   console.log('hello')
// }

// 建议写法：
// 我们一般会把最主要的那个成员作为 export  default 导出
// 如果有其它的成员，作为 export 成员按需导出
// 没有主要的那就不用设置了，
```

### 模块数据结构

使用 import \* as xx form "xxx" 可以获取 模块的结构

```js
{
  default: {	  // export default 导出的数据
    name: "default"
  },
  module1: {	// 单独 export 导出的数据
    name: "module1"
  },
  module2: {	// 多个 export 都再这一层
    name: "module2"
  }
}
```

### 简便写法

#### 导入多个 导出多个

<a name="project1">案例 1.1</a>

module1.js

```js
const module1 = {
  name: "module1",
};
const module3 = {
  name: "module3",
};
export default module1;
export { module1 }; // 多个导出模块也可以这样写 export { module1 };
export { module3 };
```

module2.js

```js
const module2 = {
  name: "module2",
};
export default module2;
export { module2 };
```

index.js

```js
export * from "./module1"; //会将 module1 内部使用 export 导出的模块都导出
export * from "./module2";
```

main.js

```js
import * as modules from './index.js'
console.log("modules", modules)
// 下面是 modules 数据结构  因为都是使用 export 导出 所以没有 default
{
  "module1": {
    "name": "module1"
  },
  "module3": {
    "name": "module3"
  },
  "module2": {
    "name": "module2"
  }
}
```

#### 导入默认模块 并导出为默认模块

```js
export { default } from "./dialog.vue"; // 将默认模块 导出为默认模块
```

### 常用写法

#### 组件的导出

index.js

```js
import VBtn from "./VBtn"; // 将index.js作为导出的中转将VBtn.vue导出

export { VBtn };
export default VBtn;
```

### 注意事项：

#### 多次导出一个模块 只执行一次

module1.js

```js
const module1 = {
  name: "module1",
  id: Date.now() + Math.random() * 100,
};
export default module1;
export { module1 };
```

多个模块导入一起导入

> tip:本例中虽然是两个 js 但打包后会合并到一个页面中执行，如果路由发生跳转则相当于重新编译所以导入模块也将重置

index.js

```js
import * as modules from './module1.js'
{
  "name": "module1",
  "id": 1615195779568.6755
}
```

main.js

```js
import * as modules from './module1.js'
{
  "name": "module1",
  "id": 1615195779568.6755
}
```

下面的 id 都是 1615195779568.6755

#### export 导出重名模块 只会存在一个

将 [案例 1.1](#project1) 修改一下

```js
const module1 = {
  name: "module1",
};
const module2 = {
  //module2.js 导出 和 module1.js 的导出 都有 module2
  name: "module3",
};
export default module1;
export { module1 };
export { module2 };
```

main.js

```js
import * as modules from './index.js'
console.log("modules", modules)  // 有两个重名模块 只会留在上面那个导出的模块
{
  "module1": {
    "name": "module1"
  },
  "module2": {
    "name": "module3"
  }
}
```

如果修改一下 index.js

```js
export * from "./module2";  // 最终导出的 module2 将是 module2.js 中的
export * from "./module1";
{
  "module1": {
    "name": "module1"
  },
  "module2": {
    "name": "module2"
  }
}

```

#### 直接 import 某个 js 相当于直接执行这个 js 文件

> 如果不需要模块导出, 直接执行这个 js 可以 improt xx.js

module.js

```js
console.log("模块执行了");

const add = (...args) => {
  const sum = args.reduce((sum, item) => (sum += item), 0);
  console.log("sum", sum);
};

add(123123, 2351235);
```

index.js

```js
import "./module3.mjs";
// 模块执行了
// sum 2474358
```

### ES6 模块与 CommonJS 模块的差异

讨论 Node.js 加载 ES6 模块之前，必须了解 ES6 模块与 CommonJS 模块完全不同。

它们有三个重大差异。

- CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
- CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
- CommonJS 模块的`require()`是同步加载模块，ES6 模块的`import`命令是异步加载，有一个独立的模块依赖的解析阶段。

第二个差异是因为 CommonJS 加载的是一个对象（即`module.exports`属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。

详细分析见阮一峰 es6 入门：https://es6.ruanyifeng.com/#docs/module-loader

#### CommonJS 模块加载 ES6 模块

CommonJS 的`require()`命令不能加载 ES6 模块，会报错，只能使用`import()`这个方法加载。

```js
(async () => {
  await import("./my-app.mjs");
})();
```

#### ES6 模块加载 CommonJS 模块

ES6 模块的`import`命令可以加载 CommonJS 模块，但是只能整体加载，不能只加载单一的输出项

```js
// 正确
import packageMain from "commonjs-package";
// 报错
import { method } from "commonjs-package";
```
