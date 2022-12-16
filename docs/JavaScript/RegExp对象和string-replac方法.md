---
title: RegExp对象和string.replac方法
date: 2018-12-04 17:19:26
tags: 
 - js
categories: js
cnblogs:
  postid: "15392988"
hash: 5ad4bd8eab7290004d0c9497deaa6cb9248270d12b6908da60ec8f60c31d3986
---

## RegExp 对象

RegExp 对象表示正则表达式，它是对字符串执行模式匹配的强大工具。

### 创建 RegExp 对象的语法

```js
new RegExp(pattern, attributes);
```

### 参数

参数 _pattern_ 是一个字符串，指定了正则表达式的模式或其他正则表达式。

参数 _attributes_ 是一个可选的字符串，包含属性 "g"、"i" 和 "m"，分别用于指定全局匹配、区分大小写的匹配和多行匹配。ECMAScript 标准化之前，不支持 m 属性。如果 _pattern_ 是正则表达式，而不是字符串，则必须省略该参数。

### 示例

```js
new RegExp("hello", "ig"); //全局匹配不区分大小写的hello字符串
```

### 返回值

一个新的 RegExp 对象，具有指定的模式和标志。如果参数 _pattern_ 是正则表达式而不是字符串，那么 RegExp() 构造函数将用与指定的 RegExp 相同的模式和标志创建一个新的 RegExp 对象。

如果不用 new 运算符，而将 RegExp() 作为函数调用，那么它的行为与用 new 运算符调用时一样，只是当 _pattern_ 是正则表达式时，它只返回 _pattern_，而不再创建一个新的 RegExp 对象。

### 抛出

SyntaxError - 如果 _pattern_ 不是合法的正则表达式，或 _attributes_ 含有 "g"、"i" 和 "m" 之外的字符，抛出该异常。

TypeError - 如果 _pattern_ 是 RegExp 对象，但没有省略 _attributes_ 参数，抛出该异常。

### 支持正则表达式的 String 对象的方法

|  [search](https://www.w3school.com.cn/jsref/jsref_search.asp)  |   检索与正则表达式相匹配的值。   |
| :------------------------------------------------------------: | :------------------------------: |
|   [match](https://www.w3school.com.cn/jsref/jsref_match.asp)   | 找到一个或多个正则表达式的匹配。 |
| [replace](https://www.w3school.com.cn/jsref/jsref_replace.asp) |   替换与正则表达式匹配的子串。   |
|   [split](https://www.w3school.com.cn/jsref/jsref_split.asp)   |    把字符串分割为字符串数组。    |

## String.replace() 方法

### 定义和用法

replace() 方法用于在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串。

### 语法

```js
stringObject.replace(regexp / substr, replacement);
```

| 参数          | 描述                                                                                                                                             |
| :------------ | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| regexp/substr | 必需。规定子字符串或要替换的模式的 RegExp 对象。请注意，如果该值是一个字符串，则将它作为要检索的直接量文本模式，而不是首先被转换为 RegExp 对象。 |
| replacement   | 必需。一个字符串值。规定了替换文本或生成替换文本的函数。                                                                                         |

### 返回值

一个新的字符串，是用 _replacement_ 替换了 regexp 的第一次匹配或所有匹配之后得到的。

### 说明

字符串 stringObject 的 replace() 方法执行的是查找并替换的操作。它将在 stringObject 中查找与 regexp 相匹配的子字符串，然后用 _replacement_ 来替换这些子串。如果 regexp 具有全局标志 g，那么 replace() 方法将替换所有匹配的子串。否则，它只替换第一个匹配子串。

_replacement_ 可以是字符串，也可以是函数。如果它是字符串，那么每个匹配都将由字符串替换。但是 replacement 中的 \$ 字符具有特定的含义。如下表所示，它说明从模式匹配得到的字符串将用于替换。

**注意：**ECMAScript v3 规定，replace() 方法的参数 replacement 可以是函数而不是字符串。在这种情况下，每个匹配都调用该函数，它返回的字符串将作为替换文本使用。该函数的第一个参数是匹配模式的字符串。接下来的参数是与模式中的子表达式匹配的字符串，可以有 0 个或多个这样的参数。接下来的参数是一个整数，声明了匹配在 stringObject 中出现的位置。最后一个参数是 stringObject 本身。

| 字符                   | 替换文本                                            |
| :--------------------- | :-------------------------------------------------- |
| `$1`、 `$2`、...、\$99 | 与 regexp 中的第 1 到第 99 个子表达式相匹配的文本。 |
| \$&                    | 与 regexp 相匹配的子串。                            |
| \$`                    | 位于匹配子串左侧的文本。                            |
| \$'                    | 位于匹配子串右侧的文本。                            |
| \$\$                   | 直接量符号。                                        |

### 实例

#### 例子 1

在本例中，我们将使用 "W3School" 替换字符串中的 "Microsoft"：

```js
<script type="text/javascript">
  var str="Visit Microsoft!" document.write(str.replace(/Microsoft/,
  "W3School"))
</script>
```

输出：

```js
Visit W3School!
```

#### 例子 2

在本例中，我们将执行一次全局替换，每当 "Microsoft" 被找到，它就被替换为 "W3School"：

```js
<script type="text/javascript">
  var str="Welcome to Microsoft! " str=str + "We are proud to announce that
  Microsoft has " str=str + "one of the largest Web Developers sites in the
  world." document.write(str.replace(/Microsoft/g, "W3School"))
</script>
```

输出：

```js
Welcome to W3School! We are proud to announce that W3School
has one of the largest Web Developers sites in the world.
```

#### 例子 3

您可以使用本例提供的代码来确保匹配字符串大写字符的正确：

```js
text = "javascript Tutorial";
text.replace(/javascript/i, "JavaScript");
```

#### 例子 4

在本例中，我们将把 "Doe, John" 转换为 "John Doe" 的形式：

```js
name = "Doe, John";
name.replace(/(\w+)\s*, \s*(\w+)/, "$2 $1");
```

#### 例子 5

在本例中，我们将把所有的花引号替换为直引号：

```js
name = '"a", "b"';
name.replace(/"([^"]*)"/g, "'$1'");
```

#### 例子 6

在本例中，我们将把字符串中所有单词的首字母都转换为大写：

```js
name = "aaa bbb ccc";
uw = name.replace(/\b\w+\b/g, function (word) {
  return word.substring(0, 1).toUpperCase() + word.substring(1);
});
```
