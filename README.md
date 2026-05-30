<div align="center">

<img src="public/favicon.ico" width="80" />

# Memorial

**我的第一个项目 · 管理后台**

[![Vue](https://img.shields.io/badge/Vue-2.6-4fc08d?logo=vuedotjs&logoColor=fff)](https://vuejs.org)
[![Element UI](https://img.shields.io/badge/Element_UI-2.15-409eff?logo=element&logoColor=fff)](https://element.eleme.io)
[![Vue Router](https://img.shields.io/badge/Vue_Router-3.6-4fc08d?logo=vuedotjs&logoColor=fff)](https://router.vuejs.org)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

</div>

## ✨ 功能

- 📊 **首页概览** — 项目总数 / 留言数 / 访客数 统计卡片
- 📁 **项目管理** — 添加、编辑、删除项目，填写名称、简介、技术栈、链接、完成时间
- 💬 **留言管理** — 审核通过或删除访客留言，待审核数量实时标注
- ⚙️ **系统设置** — 站点标题、描述、分页大小、留言开关、审核开关

## 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/Mnckacpncom/Memorial.git

# 安装依赖
npm install

# 启动开发服务器
npm run serve

# 构建生产版本
npm run build
```

## 🔑 默认账号

| 账号 | 密码 |
|------|------|
| admin | admin |

## 📁 项目结构

```
src/
├── App.vue                      # 根组件
├── main.js                      # 入口，注册路由与 Element UI
├── assets/images/               # 静态图片
├── components/
│   ├── PageLogin.vue            # 登录页
│   └── PageHome.vue             # 管理后台主页
└── router/
    └── router.js                # 路由配置
```

## 📸 预览

> 登录页 — 毛玻璃暗色风格，艺术字 Logo，流光按钮

> 管理后台 — 侧边栏导航，数据表格 CRUD

## 📄 License

MIT © Mnckacpncom
