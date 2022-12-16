---
title: electron-builder添加自定义安装卸载界面
date: 2021-04-12 11:52:18
tags:
  - Electron
  - electron-builder
  - nsis
categories: Electron
cnblogs:
  postid: "15392415"
hash: 7574148bdb9f1ddc93017a90745d1057411c415fc66d109680a09d32adf91115
---

electron-builder 官方文档 ：https://www.electron.build/configuration/nsis#NsisOptions-script

添加自定义安装卸载界面需要在 builderOptions 中添加 include 脚本

## 添加 include 脚本

> nsis 脚本 在 node_modules\app-builder-lib\templates\nsis 中被引入，所以这里写的脚本都会进到最终 nsis 的脚本中
>
> nsis 脚本官方文档 ：https://nsis.sourceforge.io/Docs

### 1.在 build\nsis 添加 uninstaller.nsh

我在做用户卸载界面所以叫 uninstaller ， 这个可以随意叫

```nsis
!include nsDialogs.nsh

XPStyle on
# 此卸载脚本在原有基础上添加指定义卸载页面 用于显示提示用户删除用户数据
Var /GLOBAL Dialog_1
; Var /GLOBAL HLine
Var /GLOBAL VLine
; Var /GLOBAL Text_1
Var /GLOBAL Label_1
Var /GLOBAL Label_2
Var /GLOBAL CheckBox_1
Var /GLOBAL Checkbox_State

# 创建自定义卸载页面
UninstPage custom un.nsDialogsPage un.nsDialogsPageLeave
Function un.nsDialogsPage
	nsDialogs::Create 1018
	Pop $Dialog_1
	${If} $Dialog_1 == error
		Abort
	${EndIf}
	${NSD_CreateVLine} 0 30u 100% 12u ""
	Pop $VLine
	${NSD_CreateLabel} 0 10u 100% 12u "卸载提示：是否本地删除用户数据？"
	Pop $Label_1
	${NSD_CreateLabel} 10u 30u 100% 12u "保留用户数据可在重新安装后找回以往配置方案"
	Pop $Label_2
	${NSD_CreateCheckbox} 0 50u 100% 10u "&确认删除本地用户数据"
	Pop $CheckBox_1
	nsDialogs::Show
FunctionEnd
Function un.nsDialogsPageLeave
${NSD_GetState} $CheckBox_1 $Checkbox_State
	 ; MessageBox MB_OK "You checked:$\n$\n   CheckBox_1 $CheckBox_1 $\n$\n  Checkbox_State $Checkbox_State   $\n$\n  BST_CHECKED ${BST_CHECKED} $\n$\n BST_UNCHECKED ${BST_UNCHECKED}"  #MessageBox用于调试
FunctionEnd

Section
SectionEnd


!macro customUnInstall
; 卸载过程执行
    ${ifNot} ${isUpdated}
      # 提示窗
        ${If} $Checkbox_State == ${BST_CHECKED}
          # 如果勾选删除固定文件夹（测试版）
          MessageBox MB_OKCANCEL "是否确认删除用户数据?" IDOK label_ok  IDCANCEL  label_cancel
          label_ok:
              # 删除固定文件夹
              RMDir /r $PROFILE\iConfig_TEST
              Goto end
          label_cancel:
              Goto end
          end:
        ${EndIf}
    ${endIf}
!macroend
```

> 关于自定义页面的官方文档：https://nsis.sourceforge.io/Docs/Modern%20UI%202/Readme.html

参考这段

```nsis
Custom pages
If you want add your custom pages to your installer, you can insert your own page commands between the page macros.

!insertmacro MUI_PAGE_WELCOME
Page custom FunctionName ;Custom page
!insertmacro MUI_PAGE_COMPONENTS

;Uninstaller
!insertmacro MUI_UNPAGE_CONFIRM
UninstPage custom un.FunctionName ;Custom page
!insertmacro MUI_UNPAGE_INSTFILES
Use the MUI_HEADER_TEXT macro to set the text on the page header in a page function:

LangString PAGE_TITLE ${LANG_ENGLISH} "Title"
LangString PAGE_SUBTITLE ${LANG_ENGLISH} "Subtitle"

Function CustomPageFunction
  !insertmacro MUI_HEADER_TEXT $(PAGE_TITLE) $(PAGE_SUBTITLE)
  nsDialogs::...
  ...
FunctionEnd
```

> 使用 nsDialogs 创建自定义界面， nsDialogs 的详细文档：https://nsis.sourceforge.io/Docs/nsDialogs/Readme.html

### 2.修改 builderOptions 配置

我用的 vue-electron 所以在 vue.config.js 中配置

```js
 builderOptions: {
		...
        nsis: {
          ...
          warningsAsErrors: false ,// nsis警告变错误（防止警告变成报错无法打包）
          include: 'build/nsis/uninstaller.nsh', // NSIS包含定制安装程序脚本的路径

        }
      }
```

## 注意事项

如果 include 像我一样添加的是卸载页面，会报错：warning 6020: Uninstaller script code found but WriteUninstaller never used - no uninstaller will be

虽然只是警告 但是 编译时默认使用/WX (将警告视为错误 `warningsAsErrors`为`true`（默认） )，导致打包中断。

因为一直没有找到对应 WriteUninstaller 应该写在哪，而且改 node_modules 中的源码也不太好,干脆不让警告视为错误，

修改 warningsAsErrors = false

## 预定义宏

关于 include 脚本 还可以添加预定好的宏 ,下面是例子 可以自己在中添加需要执行的代码

```nsis
; include 脚本 用于在安装和卸载的各个阶段做一些事情
; ${BUILD_RESOURCES_DIR} 默认为项目目录下的 build 目录
; ==============================================================================
; !macro preInit
; ; 安装时最早执行0
;   ; This macro is inserted at the beginning of the NSIS .OnInit callback
;   MessageBox MB_OK  "${BUILD_RESOURCES_DIR}/preInit" IDOK
; !macroend
; ==============================================================================
; !macro customInit
; ; 安装时其次执行1
;   MessageBox MB_OK  "${BUILD_RESOURCES_DIR}/customInit" IDOK
; !macroend
; ==============================================================================
; # 卸载
; !macro customHeader
; ; 安装时其次执行3
      ; MessageBox MB_OK  "${BUILD_RESOURCES_DIR}/customHeader" IDOK
; !macroend
; ==============================================================================
; !macro customInstall
; ; 安装时其次执行4
;   MessageBox MB_OK  "${BUILD_RESOURCES_DIR}/customInstall" IDOK
; !macroend
; ==============================================================================
; !macro customUnInit
;; 卸载页面出现前执行
;     # 提示窗
        ;  MessageBox MB_OKCANCEL "是否删除用户数据?" IDOK label_ok  IDCANCEL  label_cancel
        ;  label_ok:
        ;     # 删除固定文件夹
        ;      RMDir /r $PROFILE\iConfig_TEST
        ;      Goto end
        ;  label_cancel:
        ;      Goto end
        ;  end:
; !macroend
; ==============================================================================
;  !macro customUnInstall
;  ; 卸载过程执行
;      ${ifNot} ${isUpdated}
;         # 提示窗
;          MessageBox MB_OKCANCEL "是否删除用户数据?" IDOK label_ok  IDCANCEL  label_cancel
;          label_ok:
;             # 删除固定文件夹
;              RMDir /r $PROFILE\iConfig_TEST
;              Goto end
;          label_cancel:
;              Goto end
;          end:
;      ${endIf}
;  !macroend
; ==============================================================================
; !macro customInstallMode
;    ; 安装和卸载时都执行用于设定安装用户
;   # set  $isForceMachineInstall (给机器的每个用户都安装) or $isForceCurrentInstall (给当前用户安装)
;   # to enforce one or the other modes.
;     ; StrCpy $isForceMachineInstall "1"
;     MessageBox MB_OK  "${BUILD_RESOURCES_DIR}/customInstallMode" IDOK
; !macroend
; ==============================================================================
; !macro customRemoveFiles
; ; 当删除文件时执行（重新安装和卸载都执行）
;     ; Section  /o "是否删除用户数据"
;     ; MessageBox MB_OK  "${BUILD_RESOURCES_DIR}/NSISDemo" IDOK
;     ; SectionEnd
;     MessageBox MB_OK  "${BUILD_RESOURCES_DIR}/customRemoveFiles" IDOK
;   # set $isForceMachineInstall or $isForceCurrentInstall
;   # to enforce one or the other modes.
; !macroend
; ==============================================================================

```

如果要做卸载后表单选项 也可以用以上界面 添加对应的表单控件在 dialog 中，和发送地址即可
