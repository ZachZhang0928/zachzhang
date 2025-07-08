# GitHub Pages 部署指南

## 🎯 部署目标
- **仓库名称**: `zachzhang`
- **最终网址**: `https://zachzhang0928.github.io/zachzhang/`
- **用途**: Google实习申请的个人作品集

## ✅ 部署前检查清单

### 1. 文件结构检查 ✅
```
Zach-website/
├── index.html          # 主页 ✅
├── about.html          # 关于页面 ✅
├── projects.html       # 项目页面 ✅
├── blog.html           # 博客页面 ✅
├── ncsu-optimization.html      # 项目详情页 ✅
├── recommendation-engine.html  # 项目详情页 ✅
├── ai-code-assistant.html      # 项目详情页 ✅
├── ai-chat-system.html         # 项目详情页 ✅
├── style.css           # 样式文件 ✅
├── main.js             # JavaScript文件 ✅
├── README.md           # 项目说明 ✅
└── DEPLOYMENT_GUIDE.md # 部署指南 ✅
```

### 2. 路径检查 ✅
- ✅ 所有HTML文件都使用相对路径
- ✅ CSS文件引用: `href="style.css"`
- ✅ JS文件引用: `src="main.js"`
- ✅ 导航链接都是相对路径: `href="index.html"`
- ✅ 没有本地路径（127.0.0.1或localhost）
- ✅ 外部资源使用HTTPS链接

### 3. 功能检查 ✅
- ✅ 主题切换功能
- ✅ 头像上传和本地存储
- ✅ 响应式设计
- ✅ 面包屑导航
- ✅ 项目卡片交互

## 🚀 GitHub Pages 部署步骤

### 步骤1: 创建GitHub仓库

1. 登录GitHub账户
2. 点击右上角 "+" 号，选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `zachzhang`
   - **Description**: `Personal portfolio website for Google internship application`
   - **Visibility**: `Public` (GitHub Pages需要公开仓库)
   - **不要**勾选 "Add a README file" (我们已有)
4. 点击 "Create repository"

### 步骤2: 上传网站文件

#### 方法A: 使用Git命令行
```bash
# 在本地项目目录执行
git init
git add .
git commit -m "Initial commit: Personal portfolio website"
git branch -M main
git remote add origin https://github.com/zachzhang0928/zachzhang.git
git push -u origin main
```

#### 方法B: 使用GitHub网页上传
1. 在新建的仓库页面，点击 "uploading an existing file"
2. 拖拽所有网站文件到上传区域
3. 添加提交信息: "Initial commit: Personal portfolio website"
4. 点击 "Commit changes"

### 步骤3: 启用GitHub Pages

1. 进入仓库页面
2. 点击 "Settings" 标签
3. 在左侧菜单找到 "Pages"
4. 在 "Source" 部分：
   - 选择 "Deploy from a branch"
   - Branch选择 "main"
   - Folder选择 "/ (root)"
5. 点击 "Save"

### 步骤4: 配置自定义域名（可选）

1. 在Pages设置页面
2. 在 "Custom domain" 部分输入域名
3. 点击 "Save"
4. 添加CNAME记录到DNS设置

### 步骤5: 验证部署

1. 等待几分钟让GitHub Pages构建完成
2. 访问 `https://zachzhang0928.github.io/zachzhang/`
3. 检查所有页面是否正常加载
4. 测试所有功能：
   - 导航链接
   - 主题切换
   - 头像上传
   - 项目详情页
   - 响应式设计

## 🔧 故障排除

### 常见问题及解决方案

#### 1. 页面显示404错误
- 确保 `index.html` 在根目录
- 检查文件名大小写是否正确
- 等待GitHub Pages构建完成（通常需要5-10分钟）

#### 2. 样式或脚本不加载
- 检查文件路径是否正确
- 确保所有文件都已上传
- 检查浏览器控制台是否有错误

#### 3. 图片不显示
- 确保图片文件已上传
- 检查图片路径是否正确
- 使用相对路径而非绝对路径

#### 4. 功能不正常
- 检查浏览器是否支持JavaScript
- 查看浏览器控制台错误信息
- 确保所有依赖文件都已上传

## 📝 部署后检查清单

### 功能测试
- [ ] 主页正常加载
- [ ] 导航菜单工作正常
- [ ] 主题切换功能正常
- [ ] 头像上传功能正常
- [ ] 项目页面正常显示
- [ ] 项目详情页正常加载
- [ ] 关于页面正常显示
- [ ] 博客页面正常显示
- [ ] 响应式设计正常
- [ ] 外部链接正常打开

### 性能检查
- [ ] 页面加载速度正常
- [ ] 图片加载正常
- [ ] 字体加载正常
- [ ] 动画效果流畅

### SEO检查
- [ ] 页面标题正确
- [ ] Meta描述正确
- [ ] 链接结构合理
- [ ] 移动端友好

## 🎉 部署完成

部署成功后，你的网站将可以通过以下地址访问：
- **主网址**: `https://zachzhang0928.github.io/zachzhang/`
- **备用网址**: `https://zachzhang0928.github.io/zachzhang/index.html`

## 📞 技术支持

如果遇到问题，可以：
1. 检查GitHub Pages的构建日志
2. 查看浏览器开发者工具的控制台
3. 参考GitHub Pages官方文档
4. 检查本部署指南的故障排除部分

---

**重要提醒**: 这个网站是为Google实习申请准备的，请确保所有内容都是最新的，并且展示了你的最佳技能和项目。 