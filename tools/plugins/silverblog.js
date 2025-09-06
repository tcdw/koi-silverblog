import * as path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * @param {string} host
 * @returns {import("vite").PluginOption}
 */
export default function SilverBlog(host) {
  return {
    name: "silverblog",
    enforce: "post",
    apply: "serve",
    // HMR
    async handleHotUpdate({ file, server }) {
      // 获取基于项目根目录下的相对路径
      const relativePath = path.relative(fileURLToPath(new URL("../..", import.meta.url)), file);
      // HTML 文件、include 目录下的所有文件
      const needRefresh = relativePath.endsWith(".html") || relativePath.startsWith(`include${path.sep}`);
      if (!needRefresh) {
        return;
      }
      // 向服务端发出重置缓存指令
      await fetch(`${host}/cache/`, {
        method: "delete",
      });
      // 向 Vite 开发环境发出刷新指令
      server.hot.send({
        type: "full-reload",
        path: "*",
      });
    },
  };
}
