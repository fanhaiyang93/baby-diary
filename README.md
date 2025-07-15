# 宝宝成长日记 🍼

一个温馨的个人网站，用于记录怀孕期间的美好时光和宝宝的成长历程。

## 📖 项目简介

这是一个基于Jekyll构建的静态网站，专门为准父母设计，用来记录和分享怀孕期间的点点滴滴。网站包含产检记录、时间轴、照片相册、日记日志等功能，让这段特殊的时光得到完美的保存。

## ✨ 主要功能

### 🏠 首页
- 温馨的欢迎界面
- 孕期进度展示
- 快速功能导航
- 最新动态预览
- 温馨提示信息

### 📅 产检日历
- 产检时间轴记录
- 产检结果统计
- 体重和血压趋势图
- 产检提醒功能
- 医生建议记录

### ⏰ 时间轴
- 怀孕重要里程碑
- 时间线可视化展示
- 事件分类筛选
- 图片和文字记录
- 进度追踪

### 📸 照片相册
- 孕期照片管理
- 相册分类整理
- 照片标签系统
- 批量上传功能
- 照片分享下载

### 📝 日记日志
- 每日心情记录
- 富文本编辑器
- 日记分类管理
- 搜索和筛选
- 导出打印功能

### 👫 关于我们
- 夫妻双方介绍
- 爱情故事分享
- 怀孕历程回顾
- 联系方式展示

### 📞 联系我们
- 多种联系方式
- 在线留言表单
- 常见问题解答
- 社交媒体链接

## 🛠️ 技术栈

- **框架**: Jekyll 4.3.0
- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **样式**: 响应式设计，移动端优化
- **图标**: Emoji + 自定义图标
- **部署**: GitHub Pages
- **版本控制**: Git

## 📁 项目结构

```
baby-diary/
├── _layouts/           # 页面布局模板
│   ├── default.html   # 默认布局
│   ├── page.html      # 页面布局
│   └── post.html      # 文章布局
├── _includes/          # 可重用组件
├── _sass/             # Sass样式文件
├── assets/            # 静态资源
│   ├── css/          # 样式文件
│   ├── js/           # JavaScript文件
│   └── images/       # 图片资源
├── _posts/            # 博客文章
├── _checkups/         # 产检记录
├── _milestones/       # 里程碑事件
├── _photos/           # 照片集合
├── _diary/            # 日记集合
├── pages/             # 静态页面
├── _config.yml        # Jekyll配置文件
├── Gemfile           # Ruby依赖管理
├── index.html        # 首页
└── README.md         # 项目说明
```

## 🚀 快速开始

### 环境要求

- Ruby 2.7.0 或更高版本
- Jekyll 4.3.0
- Bundler

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/your-username/baby-diary.git
cd baby-diary
   ```

2. **安装依赖**
   ```bash
   bundle install
   ```

3. **本地运行**
   ```bash
   bundle exec jekyll serve
   ```

4. **访问网站**
   打开浏览器访问 `http://localhost:4000`

### 配置说明

编辑 `_config.yml` 文件，修改以下配置：

```yaml
# 基本信息
title: "你的网站标题"
description: "网站描述"
url: "你的网站URL"

# 作者信息
author:
  name: "你的姓名"
  email: "你的邮箱"

# 怀孕信息
pregnancy:
  start_date: "2024-01-01"  # 怀孕开始日期
  due_date: "2024-10-01"    # 预产期
```

## 📝 使用指南

### 添加产检记录

在 `_checkups` 目录下创建新的Markdown文件：

```markdown
---
layout: checkup
title: "第一次产检"
date: 2024-01-15
week: 8
doctor: "张医生"
location: "市妇幼保健院"
---

产检内容和结果...
```

### 添加时间轴事件

在 `_milestones` 目录下创建事件文件：

```markdown
---
layout: milestone
title: "确认怀孕"
date: 2024-01-01
category: "重要时刻"
icon: "🎉"
---

事件描述...
```

### 添加日记

在 `_diary` 目录下创建日记文件：

```markdown
---
layout: post
title: "今天的心情"
date: 2024-01-15
category: "日常"
mood: "开心"
tags: ["孕期", "心情"]
---

日记内容...
```

## 🎨 自定义样式

### 修改主题色彩

编辑 `_config.yml` 中的主题设置：

```yaml
theme_settings:
  primary_color: "#ff69b4"     # 主色调
  secondary_color: "#ff1493"   # 辅助色
  accent_color: "#ffd700"      # 强调色
```

### 自定义CSS

在 `assets/css/main.css` 中添加自定义样式。

## 📱 响应式设计

网站采用移动优先的响应式设计，在各种设备上都能完美显示：

- 📱 手机端：优化的触摸交互
- 📟 平板端：适配的布局调整
- 💻 桌面端：完整的功能体验

## 🔧 高级功能

### 搜索功能

网站内置搜索功能，支持：
- 全文搜索
- 标签筛选
- 日期范围
- 分类过滤

### 分享功能

支持多种分享方式：
- 社交媒体分享
- 链接复制
- 二维码生成
- 邮件发送

### 打印功能

优化的打印样式，支持：
- 页面打印
- PDF导出
- 批量打印

## 🚀 部署指南

### GitHub Pages部署

1. 将代码推送到GitHub仓库
2. 在仓库设置中启用GitHub Pages
3. 选择源分支（通常是main或gh-pages）
4. 访问 `https://your-username.github.io/baby-diary`

### 自定义域名

1. 在仓库根目录创建 `CNAME` 文件
2. 文件内容为你的域名，如：`baby.example.com`
3. 在域名DNS设置中添加CNAME记录指向GitHub Pages

## 🔒 隐私保护

- 所有个人信息都存储在你自己的仓库中
- 可以设置仓库为私有
- 支持密码保护功能
- 遵循数据保护最佳实践

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进这个项目！

### 提交Issue

- 详细描述问题或建议
- 提供复现步骤
- 附上相关截图

### 提交代码

1. Fork项目
2. 创建特性分支
3. 提交更改
4. 发起Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户！

## 📞 联系我们

如果你有任何问题或建议，欢迎联系：

- 📧 邮箱：baby.journal@example.com
- 💬 微信：baby_journal_2024
- 📱 电话：138-0000-0000

---

❤️ 用爱记录，用心分享。祝愿每一个小生命都能健康快乐地成长！ ❤️