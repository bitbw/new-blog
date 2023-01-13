---
title: JavaScript的执行上下文，理解JavaScript的作用域链，JavaScript中的this
date: 2020-01-15T10:00:59.000Z
tags:
  - js
categories: js
cnblogs:
  postid: '15393046'
hash: 8f218602f08e2ca9b215bc7776fc2b5095f66e32200d18e9f2fbcbe1530837bd
---

> 学习了一篇 js 偏底层基础 的文章：JavaScript 的执行上下文 Execution context
>
> 我将三篇文章放在一起 最后加了一些自己的总结 和 函数表达式的理解
>
> 原文地址：
>
> [JavaScript 的执行上下文](https://www.cnblogs.com/wilber2013/p/4909430.html#_nav_0)
>
> [理解 JavaScript 的作用域链](https://www.cnblogs.com/wilber2013/p/4909459.html)
>
> [JavaScript 中的 this](https://www.cnblogs.com/wilber2013/p/4909505.html#_nav_3)

# JavaScript 的执行上下文

在 JavaScript 的运行过程中，经常会遇到一些"奇怪"的行为，不理解为什么 JavaScript 会这么工作。

这时候可能就需要了解一下 JavaScript 执行过程中的相关内容了。

## 执行上下文

在 JavaScript 中有三种代码运行环境：

- Global Code
  - JavaScript 代码开始运行的默认环境
- Function Code
  - 代码进入一个 JavaScript 函数
- Eval Code
  - 使用 eval()执行代码

为了表示不同的运行环境，JavaScript 中有一个**执行上下文（Execution context，EC）**的概念。也就是说，当 JavaScript 代码执行的时候，会进入不同的执行上下文，这些执行上下文就构成了一个**执行上下文栈（Execution context stack，ECS）**。

例如对如下面的 JavaScript 代码：

```
var a = "global var";

function foo(){
    console.log(a);
}

function outerFunc(){
    var b = "var in outerFunc";
    console.log(b);

    function innerFunc(){
        var c = "var in innerFunc";
        console.log(c);
        foo();
    }

    innerFunc();
}


outerFunc()
```

代码首先进入 Global Execution Context，然后依次进入 outerFunc，innerFunc 和 foo 的执行上下文，执行上下文栈就可以表示为：

![img](https://s2.loli.net/2023/01/13/x8ESa2bl3QDycL1.png)

当 JavaScript 代码执行的时候，第一个进入的总是默认的 Global Execution Context，所以说它总是在 ECS 的最底部。

对于每个 Execution Context 都有三个重要的属性，变量对象（Variable object，VO），作用域链（Scope chain）和 this。这三个属性跟代码运行的行为有很重要的关系，下面会一一介绍。

当然，除了这三个属性之外，根据实现的需要，Execution Context 还可以有一些附加属性。

![img](https://s2.loli.net/2023/01/13/pYxDIs58lHcJzO7.png)

## VO 和 AO

从上面看到，在 Execution Context 中，会保存变量对象（Variable object，VO），下面就看看变量对象是什么。

### 变量对象（Variable object）

变量对象是与执行上下文相关的数据作用域。它是一个与上下文相关的特殊对象，其中存储了在上下文中定义的变量和函数声明。也就是说，一般 VO 中会包含以下信息：

- 变量 (var, Variable Declaration);
- 函数声明 (Function Declaration, FD);
- 函数的形参

当 JavaScript 代码运行中，如果试图寻找一个变量的时候，就会首先查找 VO。对于前面例子中的代码，Global Execution Context 中的 VO 就可以表示如下：

![img](https://s2.loli.net/2023/01/13/Aq9PveDLEjmzxMN.png)

**注意，**假如上面的例子代码中有下面两个语句，Global VO 仍将不变。

```
(function bar(){}) // function expression, FE
baz = "property of global object"
```

也就是说，对于 VO，是有下面两种特殊情况的：

- 函数表达式（与函数声明相对）不包含在 VO 之中
- 没有使用 var 声明的变量（这种变量是，"全局"的声明方式，只是给 Global 添加了一个属性，并不在 VO 中）

### 活动对象（Activation object）

只有全局上下文的变量对象允许通过 VO 的属性名称间接访问；在函数执行上下文中，VO 是不能直接访问的，此时由激活对象(Activation Object,缩写为 AO)扮演 VO 的角色。激活对象 是在进入函数上下文时刻被创建的，它通过函数的 arguments 属性初始化。

Arguments Objects 是函数上下文里的激活对象 AO 中的内部对象，它包括下列属性：

1. callee：指向当前函数的引用
2. length： 真正传递的参数的个数
3. properties-indexes：就是函数的参数值(按参数列表从左到右排列)

对于 VO 和 AO 的关系可以理解为，VO 在不同的 Execution Context 中会有不同的表现：当在 Global Execution Context 中，可以直接使用 VO；但是，在函数 Execution Context 中，AO 就会被创建。

![img](https://images2015.cnblogs.com/blog/593627/201510/593627-20151025201155177-724394618.png)

当上面的例子开始执行 outerFunc 的时候，就会有一个 outerFunc 的 AO 被创建：

![img](https://s2.loli.net/2023/01/13/3iIzJmXVdKgDeq4.png)

通过上面的介绍，我们现在了解了 VO 和 AO 是什么，以及他们之间的关系了。下面就需要看看 JavaScript 解释器是怎么执行一段代码，以及设置 VO 和 AO 了。

## 细看 Execution Context

当一段 JavaScript 代码执行的时候，JavaScript 解释器会创建 Execution Context，其实这里会有两个阶段：

- 创建阶段（当函数被调用，但是开始执行函数内部代码之前）
  - 创建 Scope chain
  - 创建 VO/AO（variables, functions and arguments）
  - 设置 this 的值
- 激活/代码执行阶段
  - 设置变量的值、函数的引用，然后解释/执行代码

这里想要详细介绍一下"创建 VO/AO"中的一些细节，因为这些内容将直接影响代码运行的行为。

对于"创建 VO/AO"这一步，JavaScript 解释器主要做了下面的事情：

- 根据函数的参数，创建并初始化 arguments object
- 扫描函数内部代码，查找函数声明（Function declaration）
  - 对于所有找到的函数声明，将函数名和函数引用存入 VO/AO 中
  - **如果 VO/AO 中已经有同名的函数，那么就进行覆盖**
- 扫描函数内部代码，查找变量声明（Variable declaration）
  - 对于所有找到的变量声明，将变量名存入 VO/AO 中，并初始化为"undefined"
  - 如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性

看下面的例子：

```
function foo(i) {
    var a = 'hello';
    var b = function privateB() {

    };
    function c() {

    }
}

foo(22);
```

对于上面的代码，在"创建阶段"，可以得到下面的 Execution Context object：

```
fooExecutionContext = {
    scopeChain: { ... },
    variableObject: {
        arguments: {
            0: 22,
            length: 1
        },
        i: 22,
        c: pointer to function c()
        a: undefined,
        b: undefined
    },
    this: { ... }
}
```

在"激活/代码执行阶段"，Execution Context object 就被更新为：

```
fooExecutionContext = {
    scopeChain: { ... },
    variableObject: {
        arguments: {
            0: 22,
            length: 1
        },
        i: 22,
        c: pointer to function c()
        a: 'hello',
        b: pointer to function privateB()
    },
    this: { ... }
}
```

## 例子分析

前面介绍了 Execution Context，VO/AO 等这么多的理论知识，当然是为了方便我们去分析代码中的一些行为。这里，就通过几个简单的例子，结合上面的概念来分析结果。

### Example 1

首先看第一个例子：

```
(function(){
    console.log(bar);
    console.log(baz);

    var bar = 20;

    function baz(){
        console.log("baz");
    }

})()
```

在 Chrome 中运行代码运行后将输出：

![img](https://images2015.cnblogs.com/blog/593627/201510/593627-20151025201157161-1227329780.png)

代码解释：匿名函数会首先进入"创建结果"，JavaScript 解释器会创建一个"Function Execution Context"，然后创建 Scope chain，VO/AO 和 this。根据前面的介绍，解释器会扫描函数和变量声明，如下的 AO 会被创建：

![img](https://s2.loli.net/2023/01/13/WJOV6it78FUuBvw.png)

所以，对于 bar，我们会得到"undefined"这个输出，表现的行为就是，我们在声明一个变量之前就访问了这个变量。这个就是 JavaScript 中"Hoisting"。

### Example 2

接着上面的例子，进行一些修改：

```
(function(){
    console.log(bar);
    console.log(baz);

    bar = 20;
    console.log(window.bar);
    console.log(bar);

    function baz(){
        console.log("baz");
    }

})()
```

运行这段代码会得到"bar is not defined(…)"错误。当代码执行到"console.log(bar);"的时候，会去 AO 中查找"bar"。但是，根据前面的解释，函数中的"bar"并没有通过 var 关键字声明，所有不会被存放在 AO 中，也就有了这个错误。

注释掉"console.log(bar);"，再次运行代码，可以得到下面结果。"bar"在"激活/代码执行阶段"被创建。

![img](https://images2015.cnblogs.com/blog/593627/201510/593627-20151025201158911-154792588.png)

### Example 3

现在来看最后一个例子：

```
(function(){
    console.log(foo);
    console.log(bar);
    console.log(baz);

    var foo = function(){};

    function bar(){
        console.log("bar");
    }

    var bar = 20;
    console.log(bar);

    function baz(){
        console.log("baz");
    }

})()
```

代码的运行结果为：
<!-- TODO : 图片没找到 -->
<!-- ![img](%E8%BD%AC-JavaScript%E7%9A%84%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87/593627-20151025201159786-722939845.png) -->

代码中，最"奇怪"的地方应该就是"bar"的输出了，第一次是一个函数，第二次是"20"。

其实也很好解释，回到前面对"创建 VO/AO"的介绍，在创建 VO/AO 过程中，解释器会先扫描函数声明，然后"foo: `<function>`"就被保存在了 AO 中；但解释器扫描变量声明的时候，虽然发现"var bar = 20;"，但是因为"foo"在 AO 中已经存在，所以就没有任何操作了。

但是，当代码执行到第二句"console.log(bar);"的时候，"激活/代码执行阶段"已经把 AO 中的"bar"重新设置了。

> 下面是自己理解的 函数内部上下文执行流程图

![JavaScript的执行上下文（函数内部的执行流程Execution Context）](https://s2.loli.net/2023/01/13/EJQujlLwZq8R321.png)

## 总结

本文介绍了 JavaScript 中的执行上下文（Execution Context），以及 VO/AO 等概念，最后通过几个例子展示了这几个概念对我们了解 JavaScript 代码运行的重要性。

通过对 VO/AO 在"创建阶段"的具体细节，如何扫描函数声明和变量声明，就可以对 JavaScript 中的"Hoisting"有清晰的认识。所以说，了解 JavaScript 解释器的行为，以及相关的概念，对理解 JavaScript 代码的行为是很有帮助的。

后面会对 Execution Context 中的 Scope chain 和 this 进行介绍。

# 理解 JavaScript 的作用域链

上一篇文章中介绍了 Execution Context 中的三个重要部分：VO/AO，scope chain 和 this，并详细的介绍了 VO/AO 在 JavaScript 代码执行中的表现。

本文就看看 Execution Context 中的 scope chain。

## 作用域

开始介绍作用域链之前，先看看 JavaScript 中的作用域（scope）。在很多语言中（C++，C#，Java），作用域都是通过代码块（由{}包起来的代码）来决定的，**但是，在 JavaScript 作用域是跟函数相关的，也可以说成是 function-based。**

例如，当 for 循环这个代码块结束后，依然可以访问变量"i"。

```
for(var i = 0; i < 3; i++){
    console.log(i);
}

console.log(i); //3
```

对于作用域，又可以分为全局作用域（Global scope）和局部作用域（Local scpoe）。

**全局作用域**中的对象可以在代码的任何地方访问，一般来说，下面情况的对象会在全局作用域中：

- 最外层函数和在最外层函数外面定义的变量
- 没有通过关键字"var"声明的变量
- 浏览器中，window 对象的属性

**局部作用域**又被称为函数作用域（Function scope），所有的变量和函数只能在作用域内部使用。

```
var foo = 1;
window.bar = 2;

function baz(){
    a = 3;
    var b = 4;
}
// Global scope: foo, bar, baz, a
// Local scope: b
```

## 作用域链

通过前面一篇文章了解到，每一个 Execution Context 中都有一个 VO，用来存放变量，函数和参数等信息。

在 JavaScript 代码运行中，所有用到的变量都需要去当前 AO/VO 中查找，当找不到的时候，就会继续查找上层 Execution Context 中的 AO/VO。这样一级级向上查找的过程，就是所有 Execution Context 中的 AO/VO 组成了一个作用域链。

所以说，**作用域链**与一个执行上下文相关，是内部上下文所有变量对象（包括父变量对象）的列表，用于变量查询。

```
Scope = VO/AO + All Parent VO/AOs
```

看一个例子：

```
var x = 10;

function foo() {
    var y = 20;

    function bar() {
        var z = 30;

        console.log(x + y + z);
    };

    bar()
};

foo();
```

上面代码的输出结果为"60"，函数 bar 可以直接访问"z"，然后通过作用域链访问上层的"x"和"y"。

![img](https://s2.loli.net/2023/01/13/4GWK2pgfCJLjS7U.png)

- 绿色箭头指向 VO/AO
- 蓝色箭头指向 scope chain（VO/AO + All Parent VO/AOs）

再看一个比较典型的例子：

```
var data = [];
for(var i = 0 ; i < 3; i++){
    data[i]=function() {
        console.log(i);
    }
}

data[0]();// 3
data[1]();// 3
data[2]();// 3
```

第一感觉（错觉）这段代码会输出"0，1，2"。但是根据前面的介绍，变量"i"是存放在"Global VO"中的变量，循环结束后"i"的值就被设置为 3，所以代码最后的三次函数调用访问的是相同的"Global VO"中已经被更新的"i"。

## 结合作用域链看闭包

在 JavaScript 中，闭包跟作用域链有紧密的关系。相信大家对下面的闭包例子一定非常熟悉，代码中通过闭包实现了一个简单的计数器。

```
function counter() {
    var x = 0;

    return {
        increase: function increase() { return ++x; },
        decrease: function decrease() { return --x; }
    };
}

var ctor = counter();

console.log(ctor.increase());
console.log(ctor.decrease());
```

下面我们就通过 Execution Context 和 scope chain 来看看在上面闭包代码执行中到底做了哪些事情。

\1. 当代码进入 Global Context 后，会创建 Global VO

![img](https://s2.loli.net/2023/01/13/kG1t9AVEXPhivCg.png)

- 绿色箭头指向 VO/AO
- 蓝色箭头指向 scope chain（VO/AO + All Parent VO/AOs）

\2. 当代码执行到"var cter = counter();"语句的时候，进入 counter Execution Context；根据上一篇文章的介绍，这里会创建 counter AO，并设置 counter Execution Context 的 scope chain

![img](https://s2.loli.net/2023/01/13/ZrsJ4g6pHXG3uBF.png)

\3. 当 counter 函数执行的最后，并退出的时候，Global VO 中的 ctor 就会被设置；这里需要注意的是，虽然 counter Execution Context 退出了执行上下文栈，但是因为 ctor 中的成员仍然引用 counter AO（因为 counter AO 是 increase 和 decrease 函数的 parent scope），所以 counter AO 依然在 Scope 中。

![img](https://s2.loli.net/2023/01/13/mFMpR6gDWoE5a3c.png)

\4. 当执行"ctor.increase()"代码的时候，代码将进入 ctor.increase Execution Context，并为该执行上下文创建 VO/AO，scope chain 和设置 this；这时，ctor.increase AO 将指向 counter AO。

![img](https://s2.loli.net/2023/01/13/53RuG7NtsSfjLZ4.png)

- 绿色箭头指向 VO/AO
- 蓝色箭头指向 scope chain（VO/AO + All Parent VO/AOs）
- 红色箭头指向 this
- 黑色箭头指向 parent VO/AO

相信看到这些，一定会对 JavaScript 闭包有了比较清晰的认识，也了解为什么 counter Execution Context 退出了执行上下文栈，但是 counter AO 没有销毁，可以继续访问。

## 二维作用域链查找

通过上面了解到，作用域链（scope chain）的主要作用就是用来进行变量查找。但是，在 JavaScript 中还有原型链（prototype chain）的概念。

由于作用域链和原型链的相互作用，这样就形成了一个二维的查找。

对于这个二维查找可以总结为：**当代码需要查找一个属性（property）或者描述符（identifier）的时候，首先会通过作用域链（scope chain）来查找相关的对象；一旦对象被找到，就会根据对象的原型链（prototype chain）来查找属性（property）**。

下面通过一个例子来看看这个二维查找：

```
var foo = {}

function baz() {

    Object.prototype.a = 'Set foo.a from prototype';

    return function inner() {
        console.log(foo.a);
    }

}

baz()();
// Set bar.a from prototype
```

对于这个例子，可以通过下图进行解释，代码首先通过作用域链（scope chain）查找"foo"，最终在 Global context 中找到；然后因为"foo"中没有找到属性"a"，将继续沿着原型链（prototype chain）查找属性"a"。

![img](https://s2.loli.net/2023/01/13/VfyoDZcaGinH4dC.png)

- 蓝色箭头表示作用域链查找
- 橘色箭头表示原型链查找

## 总结

本文介绍了 JavaScript 中的作用域以及作用域链，通过作用域链分析了闭包的执行过程，进一步认识了 JavaScript 的闭包。

同时，结合原型链，演示了 JavaScript 中的描述符和属性的查找。

下一篇我们就看看 Execution Context 中的 this 属性。

# JavaScript 中的 this

前面两篇文章介绍了 JavaScript 执行上下文中两个重要属性：VO/AO 和 scope chain。本文就来看看执行上下文中的 this。

首先看看下面两个对 this 的概括：

- **this 是执行上下文（Execution Context）的一个重要属性**，是一个与执行上下文相关的特殊对象。因此，它可以叫作上下文对象（也就是用来指明执行上下文是在哪个上下文中被触发的对象）。
- **this 不是变量对象（Variable Object）的一个属性**，所以跟变量不同，this 从不会参与到标识符解析过程。也就是说，在代码中当访问 this 的时候，它的值是直接从执行上下文中获取的，并不需要任何作用域链查找。this 的值只在进入上下文的时候进行一次确定。

关于 this 最困惑的应该是，同一个函数，当在不同的上下文进行调用的时候，this 的值就可能会不同。也就是说，this 的值是通过函数调用表达式（也就是函数被调用的方式）的 caller 所提供的。

下面就看看在不同场景中，this 的值。

## 全局上下文

在全局上下文（Global Context）中，this 总是 global object，在浏览器中就是 window 对象。

```
console.log(this === window);

this.name = "Will";
this.age = 28;
this.getInfo = function(){
    console.log(this.name + " is " + this.age + " years old");
};
window.getInfo();
// true
// Will is 28 years old
```

## 函数上下文

在一个函数中，this 的情况就比较多了，this 的值直接受函数调用方式的影响。

### Invoke function as Function

当通过正常的方式调用一个函数的时候，this 的值就会被设置为 global object（浏览器中的 window 对象）。

但是，当使用"strict mode"执行下面代码的时候，this 就会被设置为"undefined"。

```
function gFunc(){
    return this;
}

console.log(gFunc());
console.log(this === window.gFunc());
// window
// true
```

### Invoke function as Method

当函数作为一个对象方法来执行的时候，this 的值就是该方法所属的对象。

在下面的例子中，创建了一个 obj 对象，并设置 name 属性的值为"obj"。所以但调用该对象的 func 方法的时候，方法中的 this 就表示 obj 这个对象。

```
var obj = {
    name: "obj",
    func: function () {
        console.log(this + ":" + this.name);
    }
};

obj.func();
// [object Object]:obj
```

为了验证"方法中的 this 代表方法所属的对象"这句话，再看下面一个例子。

在对象 obj 中，创建了一个内嵌对象 nestedObj，当调用内嵌对象的方法的时候，方法中的 this 就代表 nestedObj。

```
var obj = {
    name: "obj",
    nestedObj: {
        name:"nestedObj",
        func: function () {
            console.log(this + ":" + this.name);
        }
    }
}

obj.nestedObj.func();
// [object Object]:nestedObj
```

对于上面例子中的方法，通常称为绑定方法，也就是说这些方法都是个特定的对象关联的。

但是，当我们进行下面操作的时候，temp 将是一个全局作用里面的函数，并没有绑定到 obj 对象上。所以，temp 中的 this 表示的是 window 对象。

```
var name = "Will";
var obj = {
    name: "obj",
    func: function () {
        console.log(this + ":" + this.name);
    }
};

temp = obj.func;
temp();
//  [object Window]:Will
```

### Invoke function as Constructor

在 JavaScript 中，函数可以作为构造器来直接创建对象，在这种情况下，this 就代表了新建的对象。

```
function Staff(name, age){
    this.name = name;
    this.age = age;
    this.getInfo = function(){
        console.log(this.name + " is " + this.age + " years old");
    };
}

var will = new Staff("Will", 28);
will.getInfo();
// Will is 28 years old
```

### Invoke context-less function

对于有些没有上下文的函数，也就是说这些函数没有绑定到特定的对象上，那么这些上下文无关的函数将会被默认的绑定到 global object 上。

在这个例子中，函数 f 和匿名函数表达式在被调用的过程中并没有被关联到任何对象，所以他们的 this 都代表 global object。

```
var context = "global";

var obj = {
    context: "object",
    method: function () {
        console.log(this + ":" +this.context);

        function f() {
            var context = "function";
            console.log(this + ":" +this.context);
        };
        f();

        (function(){
            var context = "function";
            console.log(this + ":" +this.context);
        })();
    }
};

obj.method();
// [object Object]:object
// [object Window]:global
// [object Window]:global
```

## call/apply/bind 改变 this

this 本身是不可变的，但是 JavaScript 中提供了 call/apply/bind 三个函数来在函数调用时设置 this 的值。

这三个函数的原型如下：

- fun.apply(obj1 [, argsArray])
  - Sets obj1 as the value of this inside fun() and calls fun() passing elements of argsArray as its arguments.
- fun.call(obj1 [, arg1 [, arg2 [,arg3 [, ...]]]])
  - Sets obj1 as the value of this inside fun() and calls fun() passing arg1, arg2, arg3, ... as its arguments.
- fun.bind(obj1 [, arg1 [, arg2 [,arg3 [, ...]]]])
  - Returns the reference to the function fun with this inside fun() bound to obj1 and parameters of fun bound to the parameters specified arg1, arg2, arg3, ....

下面看一个简单的例子：

```
function add(numA, numB){
    console.log( this.original + numA + numB);
}

add(1, 2);

var obj = {original: 10};
add.apply(obj, [1, 2]);
add.call(obj, 1, 2);

var f1 = add.bind(obj);
f1(2, 3);

var f2 = add.bind(obj, 2);
f2(3);
// NaN
// 13
// 13
// 15
// 15
```

当直接调用 add 函数的时候，this 将代表 window，当执行"this.original"的时候，由于 window 对象并没有"original"属性，所以会得到"undefined"。

通过 call/apply/bind，达到的效果就是把 add 函数绑定到了 obj 对象上，当调用 add 的时候，this 就代表了 obj 这个对象。

## DOM event handler

当一个函数被当作 event handler 的时候，this 会被设置为触发事件的页面元素（element）。

```
var body = document.getElementsByTagName("body")[0];
body.addEventListener("click", function(){
    console.log(this);
});
// <body>…</body>
```

### In-line event handler

当代码通过 in-line handler 执行的时候，this 同样指向拥有该 handler 的页面元素。

看下面的代码：

```
document.write('<button onclick="console.log(this)">Show this</button>');
// <button onclick="console.log(this)">Show this</button>
document.write('<button onclick="(function(){console.log(this);})()">Show this</button>');
// window
```

在第一行代码中，正如上面 in-line handler 所描述的，this 将指向"button"这个 element。但是，对于第二行代码中的匿名函数，是一个上下文无关（context-less）的函数，所以 this 会被默认的设置为 window。

前面我们已经介绍过了 bind 函数，所以，通过下面的修改就能改变上面例子中第二行代码的行为：

```
document.write('<button onclick="((function(){console.log(this);}).bind(this))()">Show this</button>');
// <button onclick="((function(){console.log(this);}).bind(this))()">Show this</button>
```

## 保存 this

在 JavaScript 代码中，同一个上下文中可能会出现多个 this，为了使用外层的 this，就需要对 this 进行暂存了。

看下面的例子，根据前面的介绍，在 body 元素的 click handler 中，this 肯定是指向 body 这个元素，所以为了使用"greeting"这个方法，就是要对指向 bar 对象的 this 进行暂存，这里用了一个 self 变量。

有了 self，我们就可以在 click handler 中使用 bar 对象的"greeting"方法了。

当阅读一些 JavaScript 库代码的时候，如果遇到类似 self，me，that 的时候，他们可能就是对 this 的暂存。

```
var bar = {
    name: "bar",
    body: document.getElementsByTagName("body")[0],

    greeting: function(){
        console.log("Hi there, I'm " + this + ":" + this.name);
    },

    anotherMethod: function () {
        var self = this;
        this.body.addEventListener("click", function(){
            self.greeting();
        });
    }
};

bar.anotherMethod();
// Hi there, I'm [object Object]:bar
```

同样，对于上面的例子，也可以使用 bind 来设置 this 达到相同的效果。

```
var bar = {
    name: "bar",
    body: document.getElementsByTagName("body")[0],

    greeting: function(){
        console.log("Hi there, I'm " + this + ":" + this.name);
    },

    anotherMethod: function () {
        this.body.addEventListener("click", (function(){
            this.greeting();
        }).bind(this));
    }
};

bar.anotherMethod();
// Hi there, I'm [object Object]:bar
```

## 总结

本文介绍了执行上下文中的 this 属性，this 的值直接影响着代码的运行结果。

在函数调用中，this 是由激活上下文代码的调用者（caller）来提供的，即调用函数的父上下文(parent context )，也就是说 this 取决于调用函数的方式，指向调用时所在函数所绑定的对象。

通过上面的介绍，相信对 this 有了一定的认识。

## 自己的话总体总结

- 执行上下文 Execution context 自己的理解就是作用域对象 ：全局作用域 和 局部作用域

  - 包含的重要属性：
    - 变量对象（Variable object，VO）
    - 作用域链（Scope chain）
    - this
  - 创建阶段（当函数被调用，但是开始执行函数内部代码之前）
    - 创建 Scope chain
    - 创建 VO/AO（variables, functions and arguments）
      - 扫描函数内部代码，查找函数声明（Function declaration）
      - 扫描函数内部代码，查找变量声明（Variable declaration）包含 函数的形参
    - 设置 this 的值
  - 激活/代码执行阶段
    - 设置变量的值、函数的引用，然后解释/执行代码

- 作用域链 scope chain 就是当前作用域的 VO/AO 没有的变量，就向上查找 VO/AO 一直到全局作用域 Global scope 的 VO
- 闭包 是作用域链的应用 ：当有下级作用域使用当前作用域内的变量 ，当前作用域执行结束后变量不会被销毁

- this 是 当前执行上下文被哪个执行上下文调用 谁调用就指向谁
  - 函数直接调用 fn() 指向 全局对象 global 浏览器中是 window
  - 对象调用 obj.fn() 哪个对象调用指向就指向谁
  - dom 事件 onclick = fn 指向对应的 dom
  - 构造函数 new Fn() 指向实例对象
  - call,bind,apply, fn.call(obj) 第一个参数是谁就指向谁

# JavaScript 中的函数表达式
