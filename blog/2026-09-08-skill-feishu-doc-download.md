---
title: "飞书 Playwright + Doc Parser 文档下载"
date: 2026-09-08T09:00:00.000Z
authors:
  - bowen
tags:
  - 自动化
  - 工具开发
  - AI
categories: 自动化工具
---
# 飞书 Playwright + Doc Parser 文档下载

## 必需前置条件

本技能是 **Playwright MCP + Doc Parser MCP** 的组合实现，二者缺一不可：

- **Playwright MCP**：复用已登录的飞书浏览器会话，读取 Wiki 目录树、节点层级和 Wiki token。
- **Doc Parser MCP**：解析飞书文档正文、下载 Markdown 及图片。批量下载阶段必须调用其 `submit_and_download_with_images` 能力。

使用前必须先安装并配置 Doc Parser MCP。安装参考：
<https://li.feishu.cn/wiki/HoSbwwOt7iLGlZkPGKQcsTNin0f>

如果 Doc Parser MCP 未安装、未配置或不可用，应先停止下载并提示用户完成安装；不要改用 `lark-cli`、飞书 OpenAPI、手工复制或其他解析方式替代。
## 适用范围

使用本技能把飞书 Wiki 下的全部或指定文档下载到本地，并保留知识库原有层级。目录读取必须通过 Playwright MCP 完成，文档解析和下载必须通过 Doc Parser MCP 完成。

## 工作流程

1. 复用 Playwright MCP 中已经登录飞书的浏览器会话。不要随意新建未登录浏览器；如果页面跳到登录页，先重新连接已登录会话。
2. 打开用户提供的 Wiki 地址，等待左侧目录树完成渲染。只处理用户指定 Wiki 子树，不要把其他空间或搜索结果混入任务。
3. 从 DOM 收集目录节点的标题、层级位置和 Wiki token。优先使用以下选择器：
   - 节点：`div.workspace-tree-view-node`
   - 标题：`.workspace-tree-view-node-content`
   - 层级：`data-node-pos`
   - 标识：`data-node-uid` 中的 `wikiToken`
4. 只展开目标节点的后代。记录每个节点的原始 `pos`、标题、token 和父子关系；不要只依赖当前可见文本，因为折叠节点可能尚未出现在 DOM 中。
5. 根据 `data-node-pos` 生成本地目录。常见位置如 `2,0,0,0` 应从索引 3 开始映射，前面的 Wiki 根节点索引不应创建成本地目录。每篇文档使用独立目录，Markdown 和图片保存在该目录内。
6. 先安全删除本次目标输出目录，再开始全量刷新。确认解析后的绝对路径位于用户指定根目录内，禁止删除其他路径。
7. 对每个节点调用 Doc Parser 的 `submit_and_download_with_images`：
   - `resourceUri`：`https://<飞书域名>/wiki/<wikiToken>`
   - `outputDir`：该节点对应的本地目录
   - `pollInterval`：通常为 5 秒
   - `timeout`：按文档大小设置，至少覆盖正常解析和图片下载时间
8. Doc Parser 通常会在 `outputDir` 下创建 `docs-*` 临时目录。任务成功后，将临时目录中的最终内容移动到节点目录的预期位置，并删除临时目录；失败时保留错误信息，不把临时目录当作最终结果。
9. 所有节点完成后执行结果校验，汇总成功、失败、重复名称、缺少 Markdown、图片数量和残留临时目录。

## 目录映射规则

- 使用 `pos` 的路径索引建立父子关系，而不是按遍历顺序猜测目录。
- 同一父节点下出现同名文档时，按稳定顺序命名为 `标题`、`标题 (2)`、`标题 (3)`；后缀只作用于真正同名的兄弟节点。
- 不能因为递归遍历了很多子节点，就把父目录错误命名为 `标题 (10)`。
- 不能把不同节点合并到同一个目录，也不能静默覆盖同名文档。
- Windows 文件夹名中的非法字符统一替换为 `_`，同时保留原始标题用于日志和校验。
- 每个文档目录至少应包含一个 Markdown 文件；图片应保留为相对路径，避免 Markdown 中出现失效的临时绝对路径。

## Playwright 读取示例

```javascript
const nodes = await page.locator('div.workspace-tree-view-node').evaluateAll(items =>
  items.map(node => ({
    pos: node.dataset.nodePos || '',
    uid: node.dataset.nodeUid || '',
    title: node.querySelector('.workspace-tree-view-node-content')?.textContent.trim() || ''
  }))
);

const tokenFromUid = uid => uid.match(/wikiToken=([^&]+)/)?.[1] || '';
```

实际执行时应先确认目录已展开、节点数量稳定，再保存 `pos`、标题和 token。若 token 不在 `data-node-uid`，点击对应文档后从当前地址提取 `/wiki/<token>`，仍然只通过 Playwright 完成。

## 失败处理

- 登录失效：停止提交下载任务，重新连接已登录 Playwright 会话后再继续。
- 单篇文档失败：记录 `pos`、标题、token、目标目录和错误，继续处理其他节点，最后集中重试失败项。
- 目录数量异常：重新展开目标子树并重新采集，不要依据不完整列表执行全量删除或下载。
- 出现重复目录或覆盖迹象：停止后续写入，检查同名兄弟的稳定后缀和 `pos` 映射，再从干净目标目录重跑。
- Doc Parser 超时：提高该节点的 `timeout` 后重试；不要把未完成的 `docs-*` 目录标记为成功。

## 完成校验

至少检查以下项目：

- Playwright 采集的文档节点数与成功下载的 Markdown 数量一致，或明确列出失败节点。
- 每个预期节点都有正确的本地目录，目录层级与 `pos` 映射一致。
- 同名文档均有稳定后缀，且没有误覆盖、误合并或父目录异常后缀。
- Markdown 中的图片引用有效，统计图片总数并抽查相对路径。
- 目标根目录下没有残留 `docs-*`、日志、临时下载目录或空的错误目录。

最终报告简要列出输出根目录、节点总数、成功/失败数、Markdown 数、图片数和需要人工处理的节点。


