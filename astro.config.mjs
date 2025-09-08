// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    vite: {
        // 加载 tailwindcss
        plugins: [tailwindcss()],
    },
    build: {
      rollupOptions: {
        output: {
          // 自定义CSS文件输出路径和名称
          assetFileNames: (assetInfo) => {
            if (assetInfo.name.endsWith('.css')) {
              // 将CSS文件输出到dist/css目录，格式为[name].[hash].[ext]
              return 'css/style.[ext]';
            }
            // 其他资源（如图片、字体）按需配置
            if (['png', 'jpg', 'svg'].includes(assetInfo.name.split('.').pop())) {
              return 'images/[name].[ext]';
            }
            // 默认输出到assets目录
            return 'assets/[name].[ext]';
          },
            // 可选：配置JS入口文件和分包路径
            //   entryFileNames: 'js/[name].[hash].js',
            //   chunkFileNames: 'js/[name].[hash].js',
        },
      },
    },
  },
});