---
title: sqlite的常见问题汇总
date: 2021-04-22 17:30:03
tags:
  - SQL
  - sqlite
categories: SQL
cnblogs:
  postid: "15392989"
hash: 0044e77eefa4545239465b0a1b81cd142c083c19dc03b6253be24666ad4cd156
---

## sqlite 常用文档

[sqlite文档](https://www.sqlite.org/docs.html)
[SQLCipher 文档](https://www.zetetic.net/sqlcipher/sqlcipher-api/#sqlcipher-api)
[SQLCipher 文档2](https://github.com/sqlcipher/sqlcipher)
[node-sqlcipher 文档](https://github.com/journeyapps/node-sqlcipher)
[node-sqlite3r 文档](https://github.com/TryGhost/node-sqlite3)

## 关于执行 sql 时单双引号的问题

执行多个插入信息时发现到某条会出现报错：

```bash
 Error: SQLITE_ERROR: near "s": syntax error
```

js 代码

```js
sql = `INSERT INTO 't_def_component_independentService' 
      (PNCode, FCCode, nameCHN, nameENG, descriptionCHN, descriptionENG, specialTips, picture, icon, type, subType, serverModel, serverName, serverPN, serverCategory, AnnounceDate, GeneralAvailableDate, WDAnnounceDate, WithdrawDate, comment, CfgRule, disable, priority, inventory, inventoryClean, version, status) VALUES ('${PNCode}', '${FCCode}', '${nameCHN}', '${nameENG}','${descriptionCHN}' ,'${descriptionENG}', '${specialTips}', '', '', 'SERVICE_COMPONENT', 'SERVICE', 'SERV-IPS', 'SERVICE', 'FUM-SERVICE-0000', 'IPS service product', '2020/4/30', '2020/7/10', '2050/1/1', '2050/1/1', NULL, NULL, '0', '0', '100', '1', '1', '0');`;
```

生成的 sql

```sql
INSERT INTO 't_def_component_independentService'       (PNCode, FCCode, nameCHN, nameENG, descriptionCHN, descriptionENG, specialTips, picture, icon, type, subType, serverModel, serverName, serverPN, serverCategory, AnnounceDate, GeneralAvailableDate, WDAnnounceDate, WithdrawDate, comment, CfgRule, disable, priority, inventory, inventoryClean, version, status)       VALUES ('FUB-SERVICE-SLA1', 'SLA1', '人员SLA服务(3/6h到场) （年）', '中文。。。' , '... user's site according to Party A's requirements and actual situation
1) In 22 cities including Beijing, Shanghai, Guangzhou, Shenyang, Harbin, Xi'an, ....;', '价格计算方式为"服务器硬件价格*系数"', '', '', 'SERVICE_COMPONENT', 'SERVICE', 'SERV-IPS', 'SERVICE', 'FUM-SERVICE-0000', 'IPS service product', '2020/4/30', '2020/7/10', '2050/1/1', '2050/1/1', NULL, NULL, '0', '0', '100', '1', '1', '0');

```

可以直接发现 有段描述

`'... user's site according to Party A's requirements and actual situation

1. In 22 cities including Beijing, Shanghai, Guangzhou, Shenyang, Harbin, Xi'an, ....;'`

因为是英文 所以内容中出现了`'`单引号 导致语句被截断，造成 sql 语句错误

### 解决

改 js 代码中字符串的拼接 ，将容易出现单引号的字段内容用双引号包住

```js
"${descriptionENG}";
//修改为
"${descriptionENG}";
```

## sqlite 数据库读取不正确问题

### 问题

直接替换数据库文件后发生数据库读取不正确的问题

### 原因

db连接对象( new sqlite3.Database(dbPath)) 读取一个表后， 当这个表结构改变 （直接替换文件），再读取这个表就会导致数据库读取不正确

### 解决

替换数据库文件后，需要重新创建db连接对象 new sqlite3.Database(dbPath);

## 使用 sqlcipher 对 sqlite 数据库加密解密

sqlcipher 数据库解密

使用 sqlcipher.exe 可以在输入密码后，查看加密数据库的内容。

使用sqlcipher windows 命令工具

注意 使用的工具也分版本，要与加密数据库的版本对应起来，否则查看不到表

下载地址：
解密时要用与加密时相同的版本
<https://github.com/sqlcipher/sqlcipher/releases>
<https://github.com/CovenantEyes/sqlcipher-windows/releases>

加密后使用命令行还是可以查看滴

创建加密数据库

```sh
$ sqlcipher encrypted.db
SQLCipher version 3.8.4.3 2014-04-03 16:53:12
Enter ".help" for instructions
Enter SQL statements terminated with a ";"
sqlite> PRAGMA key = 'thisiskey';
sqlite> create table encrypted (id integer, name text);
sqlite> .schema
CREATE TABLE encrypted (id integer, name text);
sqlite> .q
```

打开加密数据库

```sh
  $ sqlcipher encrypted.db
  SQLCipher version 3.8.4.3 2014-04-03 16:53:12
  Enter ".help" for instructions
  Enter SQL statements terminated with a ";"
  sqlite> PRAGMA key = 'thisiskey';
  sqlite> .schema
  CREATE TABLE encrypted (id integer, name text);
```

修改数据库密码

sqlite> PRAGMA rekey = 'newkey';

### 加密已有的数据库

```sh
$ sqlcipher banklist.sqlite3
SQLCipher version 3.8.4.3 2014-04-03 16:53:12
Enter ".help" for instructions
Enter SQL statements terminated with a ";"
sqlite> ATTACH DATABASE 'encrypted.db' AS encrypted KEY 'thisiskey';
sqlite> SELECT sqlcipher_export('encrypted');
sqlite> DETACH DATABASE encrypted;
```

### 解密数据库（生成无密码的数据库： plaintext.db）

```sh
$ sqlcipher-shell32 encrypted.db

sqlite> PRAGMA key = 'thisiskey';
sqlite> ATTACH DATABASE 'plaintext.db' AS plaintext KEY '';
sqlite> SELECT sqlcipher_export('plaintext');
sqlite> DETACH DATABASE plaintext;
```

## sqlite3数据库备份、导出方法汇总

[sqlite3数据库备份、导出方法汇总](https://blog.csdn.net/u010168781/article/details/103311340)
