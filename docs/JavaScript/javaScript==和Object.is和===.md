---
title: javaScript Object.is和==和===
date: 2016-9-0 21:25:48
tags: 
 - js
categories: js
---

## 相等运算符 ( ==)

 == 相等运算符在判断相等前对两边的变量（如果它们不是同一类型）进行强制转换

1. 如果操作数具有相同的类型，则按如下方式进行比较：
   - 对象：`true`仅当两个操作数都引用同一个对象时才返回。
   - 字符串：`true`仅当两个操作数具有相同顺序的相同字符时才返回。
   - 数字：`true`仅当两个操作数具有相同值时才返回。`+0`并被`-0`视为相同的值。如果任一操作数是`NaN`，则返回`false`；所以，`NaN`永远不等于`NaN`。
   - 布尔值：`true`仅当操作数为 both`true`或 both时才返回`false`。
   - BigInt：`true`仅当两个操作数具有相同值时才返回。
   - 符号：`true`仅当两个操作数引用相同的符号时才返回。
2. 如果其中一个操作数是`null`or `undefined`，则另一个也必须是`null`or`undefined`才能返回`true`。否则返回`false`。
3. 如果其中一个操作数是对象而另一个是基元，则按该顺序使用对象的[`@@toPrimitive()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive)（带有`"default"`提示）[`valueOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf)、、和[`toString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)方法将对象转换为基元。（这个原语转换和[另外](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Addition)使用的一样。）
4. 在这一步，两个操作数都被转换为原语（String、Number、Boolean、Symbol 和 BigInt 之一）。其余的转换是逐案完成的。
   - 如果它们属于同一类型，请使用步骤 1 进行比较。
   - 如果其中一个操作数是 Symbol 而另一个不是，则返回`false`。
   - 如果其中一个操作数是布尔值，而另一个不是，则将布尔值转换为数字：`true`转换为 1，然后`false`转换为 0。然后再次松散地比较两个操作数。
   - 数字转字符串：使用与构造函数相同的算法将字符串转换为数字[`Number()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/Number)。将导致转换失败`NaN`，这将保证相等`false`。
   - Number to BigInt：比较它们的数值。如果数字是 ±Infinity 或`NaN`，则返回`false`。
   - String to BigInt：使用与构造函数相同的算法将字符串转换为 BigInt [`BigInt()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt/BigInt)。如果转换失败，则返回`false`。

松散相等是*对称*的：对于and的任何值`A == B`总是具有相同的语义（应用转换的顺序除外）。`B == A``A``B`

### 总结

- 类型相同 对象和符号比地址 其他都比值 ,数字比较特殊 +0 和 -0 相等 ，NaN 和 NaN 永远不相等
- 类型不同 都尝试转化为数字类型在比较(如果一次无法转化到位就两次)，object 会依次调用 valueOf()  toString() 获取值， 但是有两种特殊情况
  - String to BigInt 字符串转换为 BigInt , Number to BigInt 直接比较 ,数字是 ±Infinity 或`NaN`，则返回`false`
  - 其中一个操作数是 Symbol 而另一个不是，则返回`false`

## 严格相等运算符 (===)

严格相等运算符 ( `===`) 检查它的两个操作数是否相等，返回一个布尔结果。与[相等](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality)运算符不同，严格相等运算符始终认为不同类型的操作数是不同的。

- 如果操作数的类型不同，则返回`false`。
- 如果两个操作数都是对象，`true`则仅当它们引用同一个对象时才返回。
- 如果两个操作数都是`null`或两个操作数都是`undefined`，则返回`true`。
- 如果任一操作数是`NaN`，则返回`false`。
- 否则，比较两个操作数的值：
  - 数字必须具有相同的数值。`+0`并且`-0` 被认为是相同的值。
  - 字符串必须以相同的顺序具有相同的字符。
  - 布尔值必须是两者`true`或两者`false`。

[此运算符与等式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality) ( ) 运算符 之间最显着的区别在于`==`，如果操作数属于不同类型，则 `==`运算符会在比较之前尝试将它们转换为相同类型。


## Object.is()

`Object.is()` 方法判断两个值是否为[同一个值](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Equality_comparisons_and_sameness)，如果满足以下任意条件则两个值相等：

- 都是 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)
- 都是 [`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/null)
- 都是 `true` 或都是 `false`
- 都是相同长度、相同字符、按相同顺序排列的字符串
- 都是相同对象（意味着都是同一个对象的值引用）
- 都是数字且
  - 都是 `+0`
  - 都是 `-0`
  - 都是 [`NaN`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN)
  - 都是同一个值，非零且都不是 [`NaN`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN)

`Object.is()` 与 [`==`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators#相等运算符) 不同。`==` 运算符在判断相等前对两边的变量（如果它们不是同一类型）进行强制转换（这种行为将 `"" == false` 判断为 `true`），而 `Object.is` 不会强制转换两边的值。

`Object.is()` 与 [`===`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators#全等运算符) 也不相同。差别是它们对待有符号的零和 NaN 不同，例如，`===` 运算符（也包括 `==` 运算符）将数字 `-0` 和 `+0` 视为相等，而将 [`Number.NaN`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/NaN) 与 [`NaN`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN) 视为不相等。

### 总结

`Object.is()` 在 undefined 与 null 与 Object 和 基本数据类型的处理上与 `===` 操作符一致，不会强制类型转化

特殊点

- +0 和 -0 不等
- NaN 和 NaN 相等
