---
title: "X11 预瞄信息展示应用"
date: 2026-08-26T09:00:00.000Z
authors:
  - bowen
tags:
  - 个人项目
  - 全栈开发
categories: 项目实践
---
# X11 预瞄信息展示应用

实时对接车辆 CarProperty 信号，展示预瞄路面特征、垂向加速度等底盘数据。支持 Web 开发预览与 Android（SS3/SS4 平台）原生部署。

## 技术栈

| 层 | 技术 |
|----|------|
| 前端框架 | Vue 3.4 + TypeScript + Vite |
| UI | Quasar 2.17 |
| 图表 | ECharts 5.5 + vue-echarts |
| 3D 场景 | Three.js 0.183 |
| 状态管理 | Pinia |
| Android 桥接 | Capacitor 6.1 |
| 监控 | Sentry（Vue + Android 双端） |

## 路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/domain-control/preview-info` | PreviewInfo | 预瞄信息主页面（默认） |
| `/hu-cps-tool` | HUCpsTool | HU CPS 调试工具 |
| `/car-tests/ss3/car-plugin-test` | CarPluginTest | SS3 CarPlugin 测试 |
| `/car-tests/ss3/vehicle-property-test` | VehiclePropertyTest | SS3 VehicleProperty 测试 |
| `/car-tests/ss4/car-property-client-test` | CarPropertyClientTest | SS4 CarPropertyClient 测试 |
| `/car-tests/ss4/car-diag-test` | CarDiagTest | SS4 诊断测试 |
| `/car-tests/ss4/vehicle-property-mapper-test` | VehiclePropertyMapperTest | SS4 属性映射测试 |
| `/car-tests/ss4/signal-explorer` | SignalExplorer | 信号探索器（默认） |
| `/car-tests/vbs/vbs-test` | VBSTest | VBS 测试 |

## 常用命令

```bash
# Web 开发
npm run dev            # 启动开发服务器（localhost:3012）
npm run build          # 生产构建 + 打包 dist.zip
npm run lint           # TypeScript + ESLint 检查（0 warnings）

# Android 调试运行（USB，需先启动 npm run dev）
npm run runAndroid         # SS4，USB 连接 localhost
npm run runAndroidWIFI     # SS4，WiFi 模式
npm run runAndroid:ss3     # 切换 SS3 后运行
npm run runAndroid:ss4     # 切换 SS4 后运行

# Android 打包
npm run buildAndroid       # Release APK（自动从 .env.production 注入 Sentry token）
npm run buildAndroid:debug # Debug APK
npm run buildAndroid:ss3   # 切换 SS3 后打包
npm run buildAndroid:ss4   # 切换 SS4 后打包

# 平台切换（单独使用）
npm run switch:ss3     # 切换到 SS3（8155）平台
npm run switch:ss4     # 切换到 SS4（8295）平台

# Capacitor
npm run sync           # 同步 web 资产到 Android
npm run openAndroid    # 在 Android Studio 中打开
```

## 环境变量

敏感配置统一放在 **`.env.production`**（已 gitignore，不入库），模板如下：

```bash
# 应用配置
VITE_SENTRY_DSN=<your-dsn>
VITE_AUTH_ENV=prod                  # ontest | prod
VITE_NODE_ENV=production
VITE_APP_PLATFORM=ss4               # ss3 | ss4（由 switch 脚本自动更新）
VITE_BLOB_HANDLE_UPLOAD_URL=<url>
VITE_FUXI_DATA_API=<url>

# Sentry — Web/Vite 构建（sentryVitePlugin）
SENTRY_VUE_AUTH_TOKEN=<token>
SENTRY_VUE_ORG=<org>
SENTRY_VUE_PROJECT=<project>

# Sentry — Android Gradle（由 scripts/build-android.js 注入）
SENTRY_ANDROID_AUTH_TOKEN=<token>
SENTRY_ANDROID_ORG=<org>
SENTRY_ANDROID_PROJECT=<project>
```

CI/CD 直接设置对应环境变量即可，无需 `.env.production` 文件。

## ADB 调试

```bash
npm run adb:logcat          # 实时查看应用日志（USB）
npm run adb:logcat:ss4      # SS4 模拟器日志（localhost:5559）
npm run adb:init:ss4        # 初始化 SS4 ADB 转发（5559→5557）
npm run adb:stop            # 强制停止应用进程
npm run adb:list            # 列出已安装的 fuxi 包
```

## Android 构建说明

- APK 输出：`android/app/build/outputs/apk/`
- Release 命名：`x11previewinfo-{version}-{date}-{gitHash}-{flavor}-release.apk`
- Debug 命名：`app-s-debug.apk`
- 仅支持 `arm64-v8a`，minSdkVersion 24
- Sentry token 通过 `scripts/build-android.js` 从 `.env.production` 读取后注入 Gradle 进程

## Sentry 监控

| 端 | 项目 | 入口 |
|----|------|------|
| Web (Vue) | `vue-x11-preview-info` | [Sentry Dashboard](https://bowen01.sentry.io/) |
| Android | `android-x11-preview-info` | 同上 |

## 参考文档

- [Android Car API 使用说明](https://li.feishu.cn/docx/GCOSd3gdQoe7ryx3s1mcdiVXndd)
