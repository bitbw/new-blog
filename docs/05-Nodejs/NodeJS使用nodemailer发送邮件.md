---
title: nodejs使用nodemailer发送邮件
date: 2022-07-14T10:45:24.000Z
tags:
  - Nodejs
  - nodemailer
categories: Nodejs
hash: b93cc032e92ef00d62cb7647646c58249a2945e6140a4f202ebf7cd9cd313851
cnblogs:
  postid: '17041102'
---

[nodemailer 官网](https://nodemailer.com/)
[nodemailer 使用案例](https://github.com/nodemailer/nodemailer/tree/master/examples)

## 使用案例

[官方案例](https://github.com/nodemailer/nodemailer/blob/master/examples/sendmail.js)
email.js

```js
/*
 * @Description: 使用邮箱给对方发送邮件
 * @Autor: Bowen
 * @Date: 2022-03-08 11:14:05
 * @LastEditors: Bowen
 * @LastEditTime: 2022-06-30 09:28:02
 */
import nodemailer from "nodemailer";
// 成功开启POP3/SMTP服务，在第三方客户端登录时，登录密码输入以下授权密码
const auth = "XXXXXXXXXXX";
 async function sendEmail(options = {}) {
  // 结构参数
  const {
    to = "note@example.com", // list of receivers
    subject = "subject", // Subject line
    text = "text", // plain text body
    html = "<h1> sendMail success </h1>", // html body
    attachments = [], // 附件
  } = options;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.163.com", // 163 提供的 host
    port: 465,            // 163 提供的 port
    secure: true, // true for 465, false for other ports
    auth: {
      user: "xxxx@163.com", // generated ethereal user  //发送方邮箱
      pass: auth, // generated ethereal password //发送方邮箱的授权码,一般去邮箱设置里面找，应该可以找到
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "xxxx@163.com", // sender address //发送方邮箱
    to,
    subject,
    text,
    html,
    attachments,
  });
  // console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  return info;
}

sendEmail()

```
