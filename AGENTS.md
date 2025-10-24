# Koi 模板代理指南

本项目是 SilverBlog 的「Koi」主题模板，使用 SolidJS + Vite 提供互动组件，并配合 Tailwind CSS 4 与 SilverBlog 服务端模板语法输出站点页面。本文档面向需要在该仓库中协作的智能体或自动化脚本，帮助快速理解结构、约定与常见任务。

## 快速定位

- **运行环境**：Node.js 22+（使用 pnpm 10.x 管理依赖），浏览器端采用 ES 模块与 Web Worker。
- **入口**：`src/main.ts` 导入导航、搜索、归档、评论等挂件；在 `include/*.html` 中由 SilverBlog 注入到页面。
- **构建产物**：`pnpm build` 产出到 `public/dist/`，并通过 `tools/scripts/post-build.js` 写入 `public/dist/vite-assets.json`，供模板在生产模式下加载。
- **开发模式**：`develop.json` 提供 SilverBlog 服务端与 Vite HMR 地址；`tools/plugins/silverblog.js` 在变更 HTML/include 时会请求后端清缓存并触发整页刷新。
- **部署**：`sync.sh` 先构建再使用 `rsync` 同步到远端服务器，最后调用 SilverBlog 缓存刷新接口。

## 目录速览

| 路径                                   | 说明                                                                         |
| -------------------------------------- | ---------------------------------------------------------------------------- |
| `index.html`, `page.html`, `post.html` | SilverBlog 页面模板，使用 Jinja 风格语法渲染动态数据。                       |
| `include/`                             | 公共片段（头部、导航、页脚），被主页面 `include` 引入。                      |
| `src/parts/`                           | 直接运行在浏览器的挂件入口（导航滚动交互、搜索对话框、归档页面、评论组件）。 |
| `src/components/`                      | SolidJS 组件，包括评论系统与全文搜索对话框。                                 |
| `src/utils/`                           | 评论树构建、格式化、IndexedDB 搜索缓存等工具函数。                           |
| `public/custom/`                       | 站点静态资源扩展目录，开发时会通过 `publicDir` 暴露。                        |
| `public/dist/`                         | 构建输出；`.vite/manifest.json` 与 `vite-assets.json` 驻留于此。             |
| `tools/`                               | 自定义 Vite 插件、构建后处理脚本。                                           |

## 核心模块与交互

- **导航 (`src/parts/nav-menu.ts`)**
  - 使用 `createEffectObject` 监听代理对象变化，驱动移动端菜单动画（汉堡按钮、下拉菜单高度）。
  - 监听页面滚动，依据 `header` 高度切换导航栏样式，并控制滚动提示显隐。
- **全文搜索 (`src/components/SearchBox.tsx`, `src/utils/search.ts`)**
  - SearchBox 使用 @kobalte/dialog 构建对话框，输入时 300ms 防抖调用 `searchKeyword`。
  - 搜索数据通过 Web Worker (`/public/dist/vendors/sql.js/*`) 与 `sql.js` 在浏览器侧执行；IndexedDB 缓存版本号由 `/search/modify.json` 校验。
  - 生产环境确保 `public/dist` 内复制了 worker 和 wasm 文件（由 `vite-plugin-static-copy` 完成）。
- **归档页面 (`src/components/Archive.tsx`)**
  - 首次加载会调用 `/control/list/post` 获取所有文章元数据，按年份分组渲染。
  - 仅在页面 `data-current="archive"` 时懒加载挂载。
- **评论系统 (`src/components/comment/*`)**
  - SolidJS 实现的 Pomment 组件，依赖 `src/api/comment.ts` 的两个接口：`/plugin/pomment/public/posts/byUrl` 和 `/plugin/pomment/public/posts/add`。
  - `buildPostTree` 将扁平评论转换为父子树；`storage.ts` 负责用户信息记忆。
  - 在页面底部通过 `src/parts/comment.ts` 动态渲染，`url` 由当前文章 `dataset.current` 推算。
- **页面模板与样式**
  - Tailwind CSS 4 配置在 `src/main.css`，自定义主题变量、友链样式等。
  - 非首页页脚会按需加载 Highlight.js（`include/footer.html`），请保持 `prose` 结构以保障代码高亮。

## 与 SilverBlog 的集成要点

- 模板可使用 `System.*`、`Template.*` 等变量；浏览器脚本依赖 `body[data-current]`、各种 `id="koi-*"` 节点，请在 HTML 模板修改时保持这些挂载点一致。
- `SilverBlog` Vite 插件在开发模式下监听 HTML/include 文件，变更后调用 `{host}/cache/` 清理服务端缓存并触发 Vite 全量刷新，修改模板时无需手动处理缓存。
- `extra.json` 声明了银博客需要的附加配置，如构建产物清单、开发代理配置；生产/开发模式在 `include/common-head.html` 中以 `System.DevMode` 分支加载对应资源。

## 开发与质量规范

- **依赖管理**：使用 `pnpm install` 安装；如需增加依赖请同步更新 `package.json` 与锁文件。
- **脚本**：`pnpm dev`（开发）、`pnpm build`（生产构建）、`pnpm preview`、`pnpm lint`、`pnpm lint:fix`、`pnpm prettier:fix`。
- **TypeScript**：`tsconfig.json` 启用 strict/noUnused 系列检查；必要时用类型守卫而非 `any`。
- **ESLint & Prettier**：`eslint.config.ts` 已集成 solid 插件与 prettier 检查；提交前应确保通过 lint。
- **CSS / Tailwind**：优先使用 Tailwind 语法；`@apply` 仅在现有示例场景（友链、代码等）使用。
- **日志**：浏览器脚本会在非生产环境输出调试日志；不要将敏感信息添加到日志中。

## 常见工作流（供代理参考）

1. **修改模板结构**：同步更新 `include/` 或根模板的 DOM 结构，并检查对应 `src/parts/*.ts` 是否仍能找到目标节点。变更大纲后运行 `pnpm dev` 手动验证。
2. **调整样式**：优先在 `src/main.css` 或 Tailwind 类上修改；若涉及动态类名，请确认 Purge 策略（Tailwind 4 默认按 class 使用跟踪）能覆盖。
3. **扩展评论 / 搜索功能**：在 `src/components/comment/` 或 `src/utils/search.ts` 迭代时，确保接口契约与 SilverBlog 后端一致，并更新 `types/` 下的类型定义。
4. **引入新静态资源**：放置在 `public/custom/` 或通过 Vite 处理；若需在生产模式加载，记得更新 `post-build` 流程或模板引用。
5. **部署验证**：本地执行 `pnpm build && pnpm run postbuild`，确认 `public/dist/vite-assets.json` 更新；如使用 `sync.sh`，确保有远程权限。

## 已知注意事项

- 浏览器端搜索依赖 `/public/dist/vendors/sql.js/worker.sql-wasm.js` 路径，如果调整输出目录须同步更新 `src/utils/search.ts` 创建 Worker 的路径。
- 归档页面假设接口返回 Unix 时间戳（秒），排序逻辑基于此；如更改服务端返回格式需修改相应处理代码。
- 评论 `url` 参数目前硬编码为 `https://www.tcdw.net/post/{slug}/`，在用于其他站点时需要同步调整。
- `public/dist` 中的构建文件目前被纳入仓库，便于 SilverBlog 模板直接使用；若改为忽略，请确保生产环境有构建步骤。
- 高亮脚本来源于 CDN（11.9.0），如需要离线部署需改为本地托管并更新模板引用。

## 参考资料

- SilverBlog 官方文档（模板变量、部署流程）
- SolidJS 指南：https://www.solidjs.com/guides
- Tailwind CSS v4 设计稿：https://tailwindcss.com/docs
- Pomment 项目与 API 说明：https://github.com/pomment/pomment

如需进一步自动化操作或决策，请在执行变更前确认与上述约定一致，避免破坏 SilverBlog 模板挂载点及浏览器端交互逻辑。
