---
title: Iterator和Generator
date: 2021-03-25 16:27:30
tags:
  - es6
  - js
categories: js
cnblogs:
  postid: "15392426"
hash: 8f292c7468d917791fce308c1a0eb01f7d4417b9dce5884680198cdc74ee12d6
---

Iterator 和 Generator

## Iterator（迭代器）

详细文档：[ECMAScript 6 入门-Iterator 和 for...of 循环](https://es6.ruanyifeng.com/#docs/iterator)

### Iterator（迭代器）的概念

Iterator 即遍历器对象

Generator 函数调用后可以返回一个遍历器对象 Iterator

所有可以使用 for of 遍历的对象内部都实现时了 Iterator 接口 比如：

通过`Arrary.prototype[Symbol.iterator]()`可以返回 Iterator

```js
{// Arrary 内部的遍历器对象
    __proto__: Array Iterator{
        next: ƒ next()			// 调用 next 方法将 指针指向下一个元素
        Symbol(Symbol.toStringTag): "Array Iterator"
        __proto__: Object
    }
}
```

当然也可直接实现一个遍历器对象

```js
var it = makeIterator(["a", "b"]);

it.next(); // { value: "a", done: false }
it.next(); // { value: "b", done: false }
it.next(); // { value: undefined, done: true }

function makeIterator(array) {
  var nextIndex = 0;
  return {
    next: function () {
      return nextIndex < array.length
        ? { value: array[nextIndex++], done: false }
        : { value: undefined, done: true };
    },
  };
}
```

调用 next 方法， 返回`{ value: xxx, done: boolean }`,通过判断 done 是否为 true，来判断遍历是否结束

### 调用 Iterator 接口的场合

有一些场合会默认调用 Iterator 接口（即`Symbol.iterator`方法），除了下文会介绍的`for...of`循环，还有几个别的场合。

**（1）解构赋值**

对数组和 Set 结构进行解构赋值时，会默认调用`Symbol.iterator`方法。

```javascript
let set = new Set().add("a").add("b").add("c");

let [x, y] = set;
// x='a'; y='b'

let [first, ...rest] = set;
// first='a'; rest=['b','c'];
```

**（2）扩展运算符**

扩展运算符（...）也会调用默认的 Iterator 接口。

```javascript
// 例一
var str = "hello";
[...str]; //  ['h','e','l','l','o']

// 例二
let arr = ["b", "c"];
["a", ...arr, "d"];
// ['a', 'b', 'c', 'd']
```

上面代码的扩展运算符内部就调用 Iterator 接口。

实际上，这提供了一种简便机制，可以将任何部署了 Iterator 接口的数据结构，转为数组。也就是说，只要某个数据结构部署了 Iterator 接口，就可以对它使用扩展运算符，将其转为数组。

```javascript
let arr = [...iterable];
```

**（3）yield\***

`yield*`后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口。

```javascript
let generator = function* () {
  yield 1;
  yield* [2, 3, 4];
  yield 5;
};

var iterator = generator();

iterator.next(); // { value: 1, done: false }
iterator.next(); // { value: 2, done: false }
iterator.next(); // { value: 3, done: false }
iterator.next(); // { value: 4, done: false }
iterator.next(); // { value: 5, done: false }
iterator.next(); // { value: undefined, done: true }
```

**（4）其他场合**

由于数组的遍历会调用遍历器接口，所以任何接受数组作为参数的场合，其实都调用了遍历器接口。下面是一些例子。

- for...of
- Array.from()
- Map(), Set(), WeakMap(), WeakSet()（比如`new Map([['a',1],['b',2]])`）
- Promise.all()
- Promise.race()

## Generator（生成器）

详细文档：[ECMAScript 6 入门-Generator 函数的语法](https://es6.ruanyifeng.com/#docs/generator)

建议看：JavaScript 高级程序设计（第 4 版）中关于生成器的描述

### 基本概念

Generator 函数 是生成器函数，Generator 函数 返回 Generator（生成器）

Generator 是一个状态机，封装了多个内部状态（本人的理解：是一个可以控制内部执行步骤的 函数）

Generator 生成器 内部实现了 Iterator （迭代器）接口，因此具有 next() 方法。调用这个方法会让生

成器开始或恢复执行

### 控制内部执行步骤

- 调用 generatorFn 生成器函数的时候并不会执行内部代码

- generator 调用 next 方法， 开始执行 generatorFn 内部代码

- 遇到 yield 关键字将停止执行代码，并将 yield 后面的值返回

- 再次调用 next 方法 将从上一个 yield 所在行开始执行

- 如果 next 中有参数将传递给开始执行所在行的 yield，如果是首次调用 next 将没有 yield 可以供其赋值
- 遇到 return 关键字将返回 { value: return 后面的值, done: true }
- 如果函数内没有 return 也没有 yield 的了 将返回 { value: undefined, done: true }

#### 正常执行顺序

```js
function* generatorFn() {
  console.log("0->yield1");
  yield "yield1"; // 停止 返回 yield1
  console.log("yield1->yield2");
  yield "yield2"; // 停止 返回 yield2
  console.log("yield2->end");
}

const generator = generatorFn();
console.log("next1", generator.next());
// 0->yield1
// next1 { value: 'yield1', done: false }
console.log("next2", generator.next());
// yield1->yield2
// next2 { value: 'yield2', done: false }
console.log("next3", generator.next());
// yield2->end
// next3 { value: undefined, done: true }
```

#### next 传参

```js
function* generatorFn(params) {
  console.log(params);
  console.log("yield1", yield "yield1"); // 遇到 yield ，yield所在行的代码都不会执行，但是 yield 后边的参数会返回
  console.log("yield2", yield "yield2"); // 不会执行console.log，下次调用next时才会执行console.log以及后面的代码
  console.log("end");
}

const generator = generatorFn("foo");

// ***第一次的bar并不会赋值给yield1关键字 因为这一次调用是为了开始执行生成器函数，第二次调用yield1的值变成baz***
console.log("next1", generator.next("bar"));
// foo
// next1 { value: 'yield1', done: false }
console.log("next2", generator.next("baz"));
// yield1 baz
// next2 { value: 'yield2', done: false }
console.log("next3", generator.next("qux"));
// yield2 qux
// end
// next3 { value: undefined, done: true }
```

#### 带 return 的

```js
function* helloWorldGenerator() {
  yield "hello";
  yield "world";
  return "ending";
}

var hw = helloWorldGenerator();

hw.next();
// { value: 'hello', done: false }

hw.next();
// { value: 'world', done: false }

hw.next();
// { value: 'ending', done: true }

hw.next();
// { value: undefined, done: true }
```
