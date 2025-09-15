//  开发环境下 HTML 美化-中间件
// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';

// HTML 美化函数
function prettifyHtml(html: string): string {
  // 移除多余的空格和换行
  let formatted = html
    .replace(/>\s+</g, '><')
    .replace(/\s+/g, ' ')
    .trim();
  
  // 添加合适的换行和缩进
  const result: string[] = [];
  let indent = 0;
  let inTag = false;
  let i = 0;
  
  while (i < formatted.length) {
    const char = formatted[i];
    
    if (char === '<') {
      if (!inTag) {
        // 开始标签
        if (formatted[i + 1] === '/') {
          // 结束标签，减少缩进
          indent = Math.max(0, indent - 1);
          result.push('\n' + '  '.repeat(indent));
        } else if (result.length > 0) {
          // 开始标签
          result.push('\n' + '  '.repeat(indent));
        }
        inTag = true;
      }
      result.push(char);
    } else if (char === '>') {
      result.push(char);
      if (inTag) {
        inTag = false;
        // 如果不是自闭合标签或结束标签，增加缩进
        const tagContent = formatted.substring(formatted.lastIndexOf('<', i), i + 1);
        if (!tagContent.includes('/>') && !tagContent.startsWith('</')) {
          // 检查是否是单行标签（如 <title>, <meta> 等）
          const tagName = tagContent.match(/<(\w+)/)?.[1]?.toLowerCase();
          const inlineTags = ['title', 'meta', 'link', 'script', 'style'];
          if (!inlineTags.includes(tagName || '')) {
            indent++;
          }
        }
      }
    } else {
      result.push(char);
    }
    
    i++;
  }
  
  return result.join('');
}

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  
  // 只在开发环境处理 HTML 响应
  if (
    import.meta.env.DEV && 
    response.headers.get('content-type')?.includes('text/html')
  ) {
    const html = await response.text();
    const prettifiedHtml = prettifyHtml(html);
    
    return new Response(prettifiedHtml, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    });
  }
  
  return response;
});