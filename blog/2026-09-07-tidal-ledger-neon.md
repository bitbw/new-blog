---
title: "潮汐账本（Neon 版本）"
date: 2026-09-07T09:00:00.000Z
authors:
  - bowen
tags:
  - 个人项目
  - 全栈开发
categories: 项目实践
---
# 潮汐账本（Neon 版本）

基于 Neon 官方 Vercel Marketplace 模板迁移的个人记账 Web 应用。

技术组合：**Next.js 16 + Vercel + Neon Postgres + Drizzle ORM + Better Auth**。项目保留原有的移动端优先账本界面、可用的金额键盘、账单本地解析和导入预览；认证与数据访问已替换为 Better Auth 会话和服务端 Neon API，不依赖 Supabase。

## 当前功能

- 响应式首页、账户、计划和报表界面；
- 支出 / 收入 / 转账记账面板，数字、小数点、退格、清空与保存可用；
- Better Auth 邮箱 + 密码注册、登录与会话；
- 首次访问账本 API 时自动建立“日常账本”、微信/支付宝/现金账户和基础分类；
- 手动记账通过 `POST /api/ledger` 写入 Neon；首页从 `GET /api/ledger` 读取真实流水、收入、支出、结余和最近流水；
- 微信/支付宝 CSV、XLSX、ZIP 文件在浏览器本地解析并预览，原始文件默认不上传；
- Drizzle migration 已生成，包含 Better Auth 的用户/会话表和账本领域表。

## 目录说明

```text
src/lib/auth/                  Better Auth 配置与生成的认证 schema
src/lib/db/                    Neon + Drizzle 数据库连接
src/features/ledger/schema.ts  账本、账户、分类、流水、预算、导入批次表
src/features/ledger/server.ts  默认账本初始化与服务端数据库操作
src/app/api/ledger/            受 Better Auth 会话保护的账本 API
src/features/importers/        微信/支付宝/通用账单本地解析
drizzle/                       由 Drizzle Kit 生成、需要应用到 Neon 的 migration
```

## Neon 初始化

1. 在 Neon 创建一个项目，并创建 `development` 分支；
2. 从 Neon 的 Connection Details 获取 pooled `DATABASE_URL`；
3. 复制 `.env.example` 为 `.env.local`，并填写：

```env
DATABASE_URL="postgresql://..."
BETTER_AUTH_SECRET="至少 32 个随机字符"
BETTER_AUTH_BASE_URL="http://localhost:5001"
```

PowerShell 生成本地开发密钥：

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

4. 安装依赖并应用 migration：

```powershell
npm install
npm run db:migrate
npm run dev
```

5. 打开 `http://localhost:5001`，先创建账号，再登录并记录第一笔账。

## Vercel 部署

在 Vercel 项目中安装 Neon Integration 并连接 Neon 的 **production/main** 分支。然后在 Vercel 的 Production、Preview、Development 环境中配置：

```env
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_BASE_URL=
```

Production 的 `BETTER_AUTH_BASE_URL` 必须是实际线上地址，例如：

```env
BETTER_AUTH_BASE_URL="https://你的实际域名"
```

每个 Neon 分支使用独立连接串。推荐：

```text
main          正式数据
development   本地开发
preview-*     功能 / Vercel Preview 验证
```

## 数据库变更工作流

不要手工修改已经应用到 Neon 的 `drizzle/*.sql` 文件。后续改数据结构时：

```text
修改 Drizzle schema
→ npm run db:generate
→ 审查 drizzle/ 下新生成的 SQL
→ 先在 Neon development 分支执行 npm run db:migrate
→ 验证后再应用到 main
```

## 下一阶段

- 让月历和趋势图完全按真实 Neon 流水聚合；
- 补齐分类管理和预算管理；
- 将账单导入确认结果批量写入 `transactions`，并实现交易号去重、批次撤销；
- 为 Preview 部署自动创建/绑定 Neon 分支。
