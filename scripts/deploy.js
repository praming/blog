#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 开始部署流程...');

// 检查是否有未提交的更改
function checkGitStatus() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      console.log('⚠️  检测到未提交的更改：');
      console.log(status);
      
      if (!process.argv.includes('--force')) {
        console.log('💡 使用 --force 标志跳过此检查');
        console.log('❌ 部署已取消');
        process.exit(1);
      } else {
        console.log('🚀 使用 --force 标志，继续部署...');
      }
    }
  } catch (error) {
    console.log('❌ Git 状态检查失败:', error.message);
    process.exit(1);
  }
}

// 构建项目
function buildProject() {
  console.log('📦 正在构建项目...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ 构建完成');
  } catch (error) {
    console.log('❌ 构建失败:', error.message);
    process.exit(1);
  }
}

// 检查 dist 目录
function checkDistDirectory() {
  const distPath = './dist';
  if (!fs.existsSync(distPath)) {
    console.log('❌ dist 目录不存在');
    process.exit(1);
  }
  
  const files = fs.readdirSync(distPath);
  if (files.length === 0) {
    console.log('❌ dist 目录为空');
    process.exit(1);
  }
  
  console.log(`📁 dist 目录包含 ${files.length} 个文件/文件夹`);
}

// 部署到远程分支
function deployToRemote(branch = 'gh-pages') {
  console.log(`🌐 正在部署到 ${branch} 分支...`);
  try {
    // 确保 dist 目录已提交
    try {
      execSync('git add dist', { stdio: 'pipe' });
      execSync(`git commit -m "Build: $(date '+%Y-%m-%d %H:%M:%S')"`, { stdio: 'pipe' });
    } catch (error) {
      // 如果没有更改需要提交，这是正常的
      console.log('📝 没有新的构建更改需要提交');
    }
    
    // 使用 subtree 推送
    execSync(`git subtree push --prefix dist origin ${branch}`, { stdio: 'inherit' });
    console.log(`✅ 成功部署到 ${branch} 分支`);
  } catch (error) {
    console.log(`❌ 部署到 ${branch} 失败:`, error.message);
    console.log('💡 提示：如果是首次部署，请先创建远程分支');
    process.exit(1);
  }
}

// 主函数
function main() {
  const args = process.argv.slice(2);
  const branch = args.find(arg => arg.startsWith('--branch='))?.split('=')[1] || 'gh-pages';
  const skipCheck = args.includes('--skip-check');
  
  if (!skipCheck) {
    checkGitStatus();
  }
  
  buildProject();
  checkDistDirectory();
  deployToRemote(branch);
  
  console.log('🎉 部署完成！');
  console.log(`📖 查看部署内容: git log ${branch} --oneline`);
}

main();