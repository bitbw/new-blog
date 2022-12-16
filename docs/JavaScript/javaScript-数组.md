---
title: javaScript-数组
date: 2016-6-25 23:10:55
tags: 
 - js
categories: js
cnblogs:
  postid: "15392429"
hash: d5a1334cf1622bc13060d3a80bbc45ed2fc8fc2ec4605534133497270cb7540b
---

## 介绍

- 数组是一个有**顺序**、**有长度**的数据集合；
- 数组：类型 Object；
- 特点：
  - 把数据放在一起；
  - 有先后位置上的顺序；
  - 有数据的长度；

> 注意：数组的 typeof 结果是 object

## 声明

```js
// 5个人的成绩为： 91，88，72，45，63
// 先声明一个数组，字面量的形式
var arr = [];
var a = "null";

// 输出 []  这是一个没有数据在里面的数组，称为空数组
console.log(arr, typeof arr);
```

## 存值

- 数组中的数据使用**索引**管理。
- 索引：**序号、顺序、排位、位置、下标**
- **索引从 0 开始**

```js
//把成绩存储到数组中
arr[0] = 91;
arr[1] = 88;
arr[2] = 72;
arr[3] = 45;
arr[4] = 63;
console.log(arr); // 输出 [91,88,72,45,63] 就是一个数据集合
```

- 把 `数组[索引]`格式当成一个变量使用就行，

```js
// 初始化赋值完成后，也可以再次改变值，把前面的值覆盖掉；
arr[0] = 100;
```

- 如果一开始就知道数组了，可以直接使用一个简单的语法存储数据

```js
var arr = [91, 88, 72, 45, 63];
console.log(arr); // 输出的结果是一样的
```

- 上面每个位置上存的都是数字类型，可以为其他类型；

## 取值

- 把数据取出来，得知道你要取哪个位置上的数据把。
- 数据取值同样使用**索引**取。

```javascript
// 拿到索引为0，顺序上第一个位置上的数据；
// 把 数组[索引] 格式当成一个变量使用就行；
console.log(arr[0]);

// 数组求和：班里的成绩总和
var sum = arr[0] + arr[1] + arr[2] + arr[3] + arr[4];
console.log(sum); // 输出370
```

## 遍历

- 求成绩总和：一个一个地把数组里面的数组取出来了，从索引 0 到最后一个索引，
- 索引从 0 开始到结束的过程，**有重复的思想，需要用到循环；**

```js
// 最初的写法
var sum = arr[0] + arr[1] + arr[2] + arr[3] + arr[4];

// 循环 这个从0~最后一个索引，有重复的思想在里面，使用循环。
var sum = 0;
for (var i = 0; i <= 4; i++) {
  sum += arr[i];
}
console.log(sum); // 输出 370，和我们一个一个相加是一样的
```

- 使用**循环来遍历**数组，当数组中的数据比较多的时候，会比较方便。**一般是使用 for 循环；**

## 数组长度

### 语法

- 存取数据：涉及到就是数组的**顺序**问题，通过索引去存取；
- 数组长度：数组中一共存放了多少个数据；

```javascript
console.log(arr.length); // 数组.length 就是数组的长度
```

- 如果数组的长度是 5，最后一个元素的**索引**就是 4；
- **我们发现最大索引总是比长度少 1 ，所以遍历还可以这么写**

```js
for (var i = 0; i <= arr.length - 1; i++) {
  console.log(arr[i]);
}

// 简化一下
for (var i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}
```

### 案例：求数组中所有数字的总和的平均值

- 分析：
  - 总和：循环遍历，加在一个变量上得到；
  - 均值：总和 / 个数；（arr.length）

```js
// 还可以更简单
var sum = 0;
for (var i = 0; i < arr.length; i++) {
  sum += arr[i];
}
console.log(sum);

// 求平均分
// 平均分= 总分 / 数组的长度
var avg = sum / arr.length;
```

### 案例：求数组中的最大值

- 分析：生活中，一堆人最高的（人很多，多到你一下看不出来）；
  - 最大值：最起码得两个数比较下，得到最大值；
  - 假设：其中随便一个是最大值 MAX，每个元素和 max 比较，
    - 若有比 MAX 大的，那该元素代替 MAX；
    - 若都没有 MAX 大，恭喜，你一开始就猜对了；

```js
var max = arr[0];
for (var i = 0; i < arr.length; i++) {
  if (max < arr[i]) {
    max = arr[i];
  }
}
```

- 需求：求数组中的最大值的索引

```js
// 分析：找打最大值的时候，记录下最大值的下标就行了。
var max_index = 0;
var max = arr[max_index];
for (var i = 0; i < arr.length; i++) {
  if (max < arr[i]) {
    max = arr[i];
    max_index = i;
  }
}
```

### 清空数组

```js
arr.length = 0;
```

## 数组的构造函数

- 数组在 JS 中还可以使用另一种方式创建，这个方式我们称为 ： 构造函数
- 构造函数：能构造一个你需要的东西（对象）；

```javascript
// 使用 构造函数 创建数组
var arr = new Array();
// 存储数据
arr[0] = 10;
arr[1] = 20;
console.log(arr);

var arr = new Array(10, 20);
console.log(arr);
```

- 注意：一个数据，不要使用这个方式存储数据；它会认为你想要设置数组的长度，而不是要把数据存储在数组中。

```javascript
var arr = new Array(10);
console.log(arr); // 输出 [empty × 10]
```

## JS 实现数组去重（重复的元素只保留一个）

**优化遍历数组法（推荐）**

实现思路：双层循环，外循环表示从 0 到 arr.length，内循环表示从 i+1 到 arr.length

将没重复的右边值放入新数组。（检测到有重复值时终止当前循环同时进入外层循环的下一轮判断）

```js
function unique4(arr) {
  var hash = [];
  for (var i = 0; i < arr.length; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        ++i;
      }
    }
    hash.push(arr[i]);
  }
  return hash;
}
```
