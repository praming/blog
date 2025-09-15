# 部署指南

本项目提供了多种将 `dist` 文件夹内容推送到远程仓库的方法。

## 🚀 快速开始

### 方法 1：使用 npm 脚本（推荐）

```bash
# 构建并部署到 gh-pages 分支
npm run deploy

# 强制部署（跳过确认）
npm run deploy:force

# 仅推送 dist 内容（需要先手动构建）
npm run deploy:subtree
```

### 方法 2：使用 GitHub Actions（自动化）

1. 推送代码到 `main` 分支
2. GitHub Actions 会自动构建并部署到 GitHub Pages
3. 无需手动操作

```bash
git add .
git commit -m "Update site"
git push origin main
```

### 方法 3：手动使用 Git Subtree

```bash
# 构建项目
npm run build

# 提交 dist 目录
git add dist
git commit -m "Update build"

# 推送 dist 内容到 gh-pages 分支
git subtree push --prefix dist origin gh-pages
```

## 📋 部署选项

### 自定义分支名称

```bash
# 部署到自定义分支
node scripts/deploy.js --branch=custom-branch

# 跳过 Git 状态检查
node scripts/deploy.js --skip-check

# 强制部署
node scripts/deploy.js --force
```

## 🛠️ 故障排除

### 首次部署

如果是首次部署，可能需要创建远程分支：

```bash
# 创建并推送空的 gh-pages 分支
git checkout --orphan gh-pages
git rm -rf .
git commit --allow-empty -m "Initial gh-pages commit"
git push origin gh-pages
git checkout main
```

### 强制推送

如果遇到推送冲突：

```bash
# 强制推送（谨慎使用）
git push origin `git subtree split --prefix dist main`:gh-pages --force
```

### GitHub Pages 设置

1. 进入 GitHub 仓库的 Settings
2. 找到 Pages 部分
3. 选择 "Deploy from a branch"
4. 选择 `gh-pages` 分支作为源
5. 点击 Save

## 📁 文件结构

```
├── dist/                 # 构建输出（将被部署）
├── scripts/
│   ├── deploy.js        # 智能部署脚本
│   └── process-css.js   # CSS 处理脚本
├── .github/
│   └── workflows/
│       └── deploy.yml   # GitHub Actions 工作流
└── package.json         # 包含部署脚本
```

## 🔧 配置说明

- `dist/` 目录已从 `.gitignore` 中移除，允许提交构建文件
- CSS 文件会自动合并并移除 Tailwind 注释
- 支持自动化和手动部署两种方式

## 💡 最佳实践

1. **开发时**：使用 `npm run dev` 进行本地开发
2. **构建测试**：使用 `npm run build` 测试构建
3. **部署**：使用 `npm run deploy` 或推送到 `main` 分支触发自动部署
4. **紧急修复**：使用 `npm run deploy:force` 强制部署