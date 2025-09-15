// astro.config.mjs
import { defineConfig } from 'astro/config';  // 导入Astro配置函数
import tailwindcss from '@tailwindcss/vite';  // 导入 tailwindcss 插件
import sitemap from '@astrojs/sitemap'; // 导入站点地图生成插件
import path from 'path';  // 导入路径处理模块
import { fileURLToPath } from 'url';  // 导入文件URL到路径转换模块
import SITE_INFO from './src/config'; // 导入网站配置信息
const __dirname = path.dirname(fileURLToPath(import.meta.url)); // 获取当前文件路径

// 定义并导出Astro配置
export default defineConfig({
  site: SITE_INFO.Site, // 设置网站URL
  compressHTML: true, // 禁用HTML压缩
  integrations: [
    sitemap({ // 站点地图配置项
		changefreq: 'weekly', priority: 0.7, lastmod: new Date(), // 设置站点地图更新频率、优先级和最后修改时间
		serialize: (item) => ({ ...item, url: item.url.endsWith('/') ? item.url.slice(0, -1) : item.url }) // 处理URL末尾的斜杠
    }),
  ],
  vite: {
    plugins: [tailwindcss()], // 加载 tailwindcss
    resolve: {
      alias: {  // 别名路径配置
        '@': path.resolve(__dirname, './src')
      }
    },
    build: {  // 构建配置
      minify: true, // 启用CSS压缩
      cssCodeSplit: false, // 禁用CSS代码分割，将所有CSS合并
      rollupOptions: {
        output: {  // 输出配置
          // CSS文件统一输出为style.css
          assetFileNames: (assetInfo) => {
            if (assetInfo.name.endsWith('.css')) {
              return 'css/style.css';
            }
            // 其他资源（如图片、字体）按需配置
            if (['png', 'jpg', 'webp', 'svg'].includes(assetInfo.name.split('.').pop())) {
              return 'images/[name].[ext]';
            }
            // 默认输出到assets目录
            return 'assets/[name].[ext]';
          },
        },
      },
    },
  },
});