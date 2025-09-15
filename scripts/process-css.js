#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

console.log('🔄 Processing CSS files...');

// 查找所有CSS文件
const cssFiles = glob.sync('**/*.css', { cwd: distDir });
console.log(`📁 Found ${cssFiles.length} CSS files:`, cssFiles);

if (cssFiles.length === 0) {
  console.log('❌ No CSS files found to process');
  process.exit(0);
}

let combinedCSS = '';
let totalSizeBefore = 0;
let totalSizeAfter = 0;

// 处理每个CSS文件
cssFiles.forEach(file => {
  const filePath = path.join(distDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const sizeBefore = content.length;
  totalSizeBefore += sizeBefore;
  
  console.log(`📝 Processing: ${file} (${sizeBefore} bytes)`);
  
  // 移除 Tailwind CSS 注释（支持多行）
  const beforeRemoval = content.length;
  content = content.replace(/\/\*!\s*tailwindcss[\s\S]*?\*\//gi, '');
  const afterTailwindRemoval = content.length;
  
  // 移除其他注释（可选）
  content = content.replace(/\/\*[\s\S]*?\*\//g, '');
  const afterAllRemoval = content.length;
  
  console.log(`  ✅ Removed Tailwind comment: ${beforeRemoval - afterTailwindRemoval} bytes`);
  console.log(`  ✅ Removed other comments: ${afterTailwindRemoval - afterAllRemoval} bytes`);
  
  combinedCSS += content + '\n';
  totalSizeAfter += content.length;
  
  // 删除原文件（除非是目标文件）
  if (file !== 'css/style.css') {
    fs.unlinkSync(filePath);
    console.log(`  🗑️  Deleted: ${file}`);
  }
});

// 确保CSS目录存在
const cssDir = path.join(distDir, 'css');
if (!fs.existsSync(cssDir)) {
  fs.mkdirSync(cssDir, { recursive: true });
}

// 写入合并后的CSS文件
const outputPath = path.join(cssDir, 'style.css');
fs.writeFileSync(outputPath, combinedCSS.trim());

console.log(`\n✨ CSS processing complete!`);
console.log(`📊 Total size: ${totalSizeBefore} → ${totalSizeAfter} bytes`);
console.log(`💾 Saved: ${totalSizeBefore - totalSizeAfter} bytes (${((totalSizeBefore - totalSizeAfter) / totalSizeBefore * 100).toFixed(1)}%)`);
console.log(`📄 Output: css/style.css`);
