---
title: antd-design常见问题汇总
date: 2021-11-12T20:42:35.000Z
tags:
  - antd-design
  - antd
categories: React

---


## RangePicker 组件赋值时提示 date.locale is not a function

经过断点发现  date 是 `undefinde` ,经过排查后发现 在 form.setFieldsValue(date) 中包含了 RangePicker 的字段的赋值 ，RangePicker 需要传一个 day.js 的数组，否者就会报错这个错误`date.locale is not a function`,
