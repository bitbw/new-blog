---
title: 转从深入到通俗Object.prototype.toString.call()
date: 2021-07-23T13:38:06.000Z
tags:
  - js
categories: js
cnblogs:
  postid: '15393031'
hash: a099e05a4129bd520fb591025449453b8f063520713426009effe5186732ed29
---

原文地址：https://zhuanlan.zhihu.com/p/118793721

没有废话，直入主题。

### 一、Object.prototype.toString() 的调用

对于 `Object.prototype.toString()` 方法，会返回一个形如 `"[object XXX]"` 的字符串。

如果对象的 `toString()` 方法未被重写，就会返回如上面形式的字符串。

```js
({}.toString()); // => "[object Object]"
Math.toString(); // => "[object Math]"
```

但是，大多数对象，`toString()` 方法都是重写了的，这时，需要用 `call()` 或 `Reflect.apply()` 等方法来调用。

```js
var x = {
  toString() {
    return "X";
  },
};

x.toString(); // => "X"

Object.prototype.toString.call(x); // => "[object Object]"

Reflect.apply(Object.prototype.toString, x, []); // => "[object Object]"
```

### 二、`Object.prototype.toString()` 的原理

对于 `Object.prototype.toString.call(arg)`，若参数为 `null` 或 `undefined`，直接返回结果。

```js
Object.prototype.toString.call(null); // => "[object Null]"

Object.prototype.toString.call(undefined); // => "[object Undefined]"
```

若参数不为 `null` 或 `undefined`，则将参数转为对象，再作判断。对于原始类型，转为对象的方法即装箱，此处不赘述。

转为对象后，取得该对象的 `[Symbol.toStringTag]` 属性值（可能会遍历原型链）作为 `tag`，如无该属性，或该属性值不为字符串类型，则依下表取得 `tag`, 然后返回 `"[object " + tag + "]"` 形式的字符串。

```js
// Boolean 类型，tag 为 "Boolean"
Object.prototype.toString.call(true); // => "[object Boolean]"

// Number 类型，tag 为 "Number"
Object.prototype.toString.call(1); // => "[object Boolean]"

// String 类型，tag 为 "String"
Object.prototype.toString.call(""); // => "[object String]"

// Array 类型，tag 为 "String"
Object.prototype.toString.call([]); // => "[object Array]"

// Arguments 类型，tag 为 "Arguments"
Object.prototype.toString.call(
  (function () {
    return arguments;
  })()
); // => "[object Arguments]"

// Function 类型， tag 为 "Function"
Object.prototype.toString.call(function () {}); // => "[object Function]"

// Error 类型（包含子类型），tag 为 "Error"
Object.prototype.toString.call(new Error()); // => "[object Error]"

// RegExp 类型，tag 为 "RegExp"
Object.prototype.toString.call(/\d+/); // => "[object RegExp]"

// Date 类型，tag 为 "Date"
Object.prototype.toString.call(new Date()); // => "[object Date]"

// 其他类型，tag 为 "Object"
Object.prototype.toString.call(new (class {})()); // => "[object Object]"
```

下面为部署了 `Symbol.toStringTag` 的例子。可以看出，属性值期望是一个字符串，否则会被忽略。

```js
var o1 = { [Symbol.toStringTag]: "A" };
var o2 = { [Symbol.toStringTag]: null };

Object.prototype.toString.call(o1); // => "[object A]"
Object.prototype.toString.call(o2); // => "[object Object]"
```

`Symbol.toStringTag` 也可以部署在原型链上：

```js
class A {}
A.prototype[Symbol.toStringTag] = "A";
Object.prototype.toString.call(new A()); // => "[object A]"
```

新标准引入了 `[Symbol.toStringTag]` 属性，是为了把此方法接口化，用于规范新引入的对象对此方法的调用。但对于“老旧”的对象，就只能直接输出值，以保证兼容性。

### 三、部署了此属性的内置对象

下面，我列出所有部署了此属性的内置对象。

1. **三个容器对象**。这类对象用作命名空间，用于存储同一类方法。

```js
JSON[Symbol.toStringTag]; // => "JSON"

Math[Symbol.toStringTag]; // => "Math"

Atomics[Symbol.toStringTag]; // => "Atomic"
```

这三个对象的 `toString()` 都没有重写，直接调用 `toString()` 方法也可以得到相同的结果。

```js
JSON.toString(); // => "[object JSON]"

Math.toString(); // => "[object Math]"

Atomics.toString(); // => "[object Atomics]"
```

\2. **两个新引入的类型 `BigInt` 和 `Symbol`**。

```js
BigInt.prototype[Symbol.toStringTag]; // => "BigInt"

Symbol.prototype[Symbol.toStringTag]; // => "Symbol"
```

\3. **四个集合（Collection）对象**。

```js
Set.prototype[Symbol.toStringTag]; // => "Set"

Map.prototype[Symbol.toStringTag]; // => "Map"

WeakSet.prototype[Symbol.toStringTag]; // => "WeakSet"

WeakMap.prototype[Symbol.toStringTag]; // => "WeakMap"
```

\4. **`ArrayBuffer` 及其视图对象**。

```js
ArrayBuffer.prototype[Symbol.toStringTag];       // => "ArrayBuffer"

SharedArrayBuffer.prototype[Symbol.toStringTag]; // => "SharedArrayBuffer"

DataView.prototype[Symbol.toStringTag];          // => "DataView"

%TypedArray%.prototype[Symbol.toStringTag];      // 返回各 %TypedArray% 的名称
/**
 * 各 %TypedArray%：
 *   Int8Array;
 *   Uint8Array;
 *   Uint8ClampedArray;
 *   Int16Array;
 *   Uint16Array;
 *   Int32Array;
 *   Uint32Array;
 *   BigInt64Array;
 *   BigUint64Array;
 *   Float32Array;
 *   Float64Array;
 */
```

其中，`%TypedArray%` 比较特殊。`Symbol.toStringTag` 并没有直接部署在各个 `%TypedArray%` 的原型对象上。

而是，各个 `%TypedArray%` 拥有同一个原型对象 `%TypedArray%.prototype`，`Symbol.toStringTag` 属性就部署在这个对象上。而且，该属性为一个只读访问器属性，访问该属性时，会根据 `this` 的类型来判断返回哪一个 `%TypedArray%` 的名称。

```js
var p0 = Int8Array.prototype;
var p1 = Object.getPrototypeOf(Int8Array.prototype);
var p2 = Object.getPrototypeOf(BigUint64Array.prototype);

// 各个 %TypedArray% 具有同一个原型对象 %TypedArray%.prototype
p1 === p2; // => true
p1.constructor.name; // => "TypedArray"

// Symbol.toStringTag 即部署在 %TypedArray%.prototype 上
Object.getOwnPropertySymbols(p0).includes(Symbol.toStringTag); // => false
Object.getOwnPropertySymbols(p1).includes(Symbol.toStringTag); // => true

// 该属性为只读访问器属性
Object.getOwnPropertyDescriptor(p1, Symbol.toStringTag); // => { get: ...,
//      set: undefined,
//      ... }

// 调用该访问器属性时
// 如果 this 不为对象或 TypedArray，返回 undefined
// 否则返回该 TypedArray 的名称
var get = Object.getOwnPropertyDescriptor(p1, Symbol.toStringTag).get;
p1[Symbol.toStringTag]; // => undefined
get.call({}); // => undefined
get.call(null); // => undefined
get.call(new Set()); // => undefined
get.call(new Int8Array()); // => "Int8Array"
get.call(new BigInt64Array()); // => "BigInt64Array"
```

这个设计还是挺精妙的。

\5. **`Iterator` 的一些实现**。新标准实现了 `Iterator` 接口，以下实现也部署了该属性。

```js
%ArrayIteratorPrototype%;         // => "Array Iterator"

%SetIteratorPrototype%;           // => "Set Iterator"

%MapIteratorPrototype%;           // => "Map Iterator"

%StringIteratorPrototype%;        // => "String Iterator"

%RegExpStringIteratorPrototype%;  // => "RegExp String Iterator"
```

例：

```js
[][Symbol.iterator]()[Symbol.toStringTag]; // => "Array Iterator"

new Set().keys()[Symbol.toStringTag]; // => "Set Iterator"
new Set().values()[Symbol.toStringTag]; // => "Set Iterator"
new Set().entries()[Symbol.toStringTag]; // => "Set Iterator"

new Map().keys()[Symbol.toStringTag]; // => "Set Iterator"
new Map().values()[Symbol.toStringTag]; // => "Set Iterator"
new Map().entries()[Symbol.toStringTag]; // => "Set Iterator"

String.prototype[Symbol.iterator]()[Symbol.toStringTag]; // => "String Iterator"

"1a2b3c".matchAll(/\d/)[Symbol.toStringTag]; // => "RegExp String Iterator"
```

\6. **新引入的函数引型及其原型，包含 `async` 和 `generator` 函数以及他们的组合**。

```js
%GeneratorFunction%[Symbol.toStringTag];            // => "GeneratorFunction"

%GeneratorFunction%.prototype[Symbol.toStringTag];  // => "Generator"

%AsyncFunction%[Symbol.toStringTag];                // => "AsyncFunction"

%AsyncGenerator%[Symbol.toStringTag];               // => "AsyncGenerator"

%AsyncGeneratorFunction%[Symbol.toStringTag];       // => "AsyncGeneratorFunction"
```

例：

```js
function* f1() {}

f1[Symbol.toStringTag]; // => "GeneratorFunction"

f1.prototype[Symbol.toStringTag]; // => "Generator"

async function f2() {}

f2[Symbol.toStringTag]; // => "AsyncFunction"

async function* f3() {}

f2[Symbol.toStringTag]; // => "AsyncGeneratorFunction"

f3.prototype[Symbol.toStringTag]; // => "AsyncGenerator"
```

实际上，`Generator Function` 为 `Function` 的子类；`%GeneratorFunction%.prototype` 为 `Iterator` 的子类。

\7. **模块命名空间对象（Module Namespace Object）**。

新引入的模块命名空间对象（Module Namespace Object）也是部署了此属性的。

```js
import * as module from "./export.js";

module[Symbol.toStringTag]; // => "Moduel"
```

\8. 另外，**在不同的实现中，有些第三方对象也部署了此属性**。

比如在浏览器中：

```js
Window.prototype[Symbol.toStringTag]; // => "Window"

HTMLElement.prototype[Symbol.toStringTag]; // => "HTMLElement"

Blob.prototype[Symbol.toStringTag]; // => "Blob"
```

在 Node.js 中：

```js
global[Symbol.toStringTag]; // => "global"
```
