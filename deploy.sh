#!/bin/bash

# Zach Zhang Portfolio - GitHub Pages 部署脚本
# 使用方法: ./deploy.sh

echo "🚀 开始部署 Zach Zhang 个人作品集到 GitHub Pages..."

# 检查是否在正确的目录
if [ ! -f "index.html" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 检查Git是否已初始化
if [ ! -d ".git" ]; then
    echo "📁 初始化Git仓库..."
    git init
fi

# 添加所有文件
echo "📦 添加文件到Git..."
git add .

# 提交更改
echo "💾 提交更改..."
git commit -m "Deploy portfolio website to GitHub Pages"

# 检查是否已设置远程仓库
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 请先设置远程仓库:"
    echo "git remote add origin https://github.com/zachzhang0928/zachzhang.git"
    echo "然后运行: git push -u origin main"
    exit 1
fi

# 推送到GitHub
echo "⬆️ 推送到GitHub..."
git push origin main

echo "✅ 部署完成!"
echo ""
echo "📋 接下来的步骤:"
echo "1. 访问 https://github.com/zachzhang0928/zachzhang"
echo "2. 进入 Settings > Pages"
echo "3. Source选择 'Deploy from a branch'"
echo "4. Branch选择 'main', Folder选择 '/'"
echo "5. 点击 Save"
echo ""
echo "🌐 网站将在几分钟后可通过以下地址访问:"
echo "https://zachzhang0928.github.io/zachzhang/"
echo ""
echo "📝 详细部署指南请查看 DEPLOYMENT_GUIDE.md" 