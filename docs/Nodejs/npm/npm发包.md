---
title: npm发包
date: 2022-01-05 10:02:57
tags:
  - npm
  - Nodejs
categories: Nodejs
hash: 88f8a0930cda4b0172abbccf36529c3e0660472e8f190c4d87f6b86bc1aff064
cnblogs:
  postid: "15765984"
---

## 创建一个 npm 账号

[创建一个 npm 账号](https://docs.npmjs.com/creating-a-new-npm-user-account)

### 本地添加账号

```bash
$ npm adduser
npm notice Log in on https://registry.npmjs.org/
Username: username
Password:xxx
Email: (this IS public) xxx@xxx.com
npm notice Please check your email for a one-time password (OTP)
Enter one-time password from your authenticator app: xxxxx
Logged in as bitbw on https://registry.npmjs.org/.
```

### 问题

如果提示`[FORBIDDEN] Public registration is not allowed`
问题的原因是你的NPM使用了镜像地址.
解决方法：先不用镜像地址

## 创建和发布作用域公共包

### 创建作用域公共包

> 注意：在发布用户范围的 npm 包之前，您必须注册一个 npm 用户帐户。
> 此外，要发布组织范围的包，您必须创建一个 npm 用户帐户，然后创建一个 npm 组织

1.为您的包创建一个目录：

```bash
    mkdir my-test-package
```

2.在包根目录中，运行 npm init 命令并将范围传递给 scope 标志：
对于组织范围的包，替换 my-org 为您组织的名称：

```bash
  npm init --scope=@my-org
```

对于用户范围的包，替换 my-username 为您的用户名：

```bash
  npm init --scope=@my-username
```

3.提示以生成 package.json 文件。

### 查看包裹内容以获取敏感或不必要的信息

将敏感信息发布到注册表可能会损害您的用户、损害您的开发基础设施、修复成本高昂，并使您面临法律诉讼的风险。我们强烈建议在将包发布到注册表之前删除敏感信息，例如私钥、密码、个人身份信息(PII) 和信用卡数据。

对于不太敏感的信息，例如测试数据，请使用`.npmignore` 或`.gitignore` 文件来防止发布到注册表

### 测试你的包裹

为了减少发布错误的机会，我们建议在将包发布到 npm 注册表之前对其进行测试。要测试您的包，`npm install` 请使用包目录的完整路径运行：

```bash
  npm install
```

### 发布范围内的公共包

默认情况下，范围包以私有可见性发布。要发布具有公共可见性的范围包，请使用`npm publish --access public`. 1.要将范围内的公共包发布到 npm 注册表，请运行：

```bash
npm publish --access public
```

```log
$ npm publish --access public
npm notice
npm notice 📦  @bitbw/my-test-package01@1.0.0
npm notice === Tarball Contents ===
npm notice 43B  README.md
npm notice 241B index.js
npm notice 238B package.json
npm notice === Tarball Details ===
npm notice name:          @bitbw/my-test-package01
npm notice version:       1.0.0
npm notice filename:      @bitbw/my-test-package01-1.0.0.tgz
npm notice package size:  466 B
npm notice unpacked size: 522 B
npm notice shasum:        656cc61ee5de87d80dfc0a699b710e2163493f4f
npm notice integrity:     sha512-bHtVFf7U3J+EL[...]AznC2Mfpz7Lvg==
npm notice total files:   3
npm notice
+ @bitbw/my-test-package01@1.0.0
```

2.要查看您的公共包页面，请访问https://npmjs.com/package/*package-name ，将 package-name\*替换为您的包名称。公共包会 public 在 npm 网站上的包名称下方注明。
