# Memorial — 我的第一个项目

记录并展示我独立完成的第一个项目，一个基于 Vue 2 + Element UI 的项目集管理后台。

## 技术栈

| 技术 | 说明 |
|------|------|
| Vue 2 | 前端框架 |
| Vue Router | 路由管理 |
| Element UI | UI 组件库 |
| Vue CLI 5 | 项目脚手架 |

## 功能

- **登录 / 注册** — 毛玻璃暗色风格登录页，字母跳动艺术字 Logo
- **首页概览** — 项目总数、留言数、访客数统计卡片
- **项目管理** — 增删改查项目条目，含名称/简介/技术栈/链接/完成时间
- **留言管理** — 审核通过 / 删除访客留言
- **系统设置** — 站点标题、描述、分页、留言开关等

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run serve

# 构建生产版本
npm run build
```

## 默认账号

| 账号 | 密码 |
|------|------|
| admin | admin |

## 项目结构

```
src/
├── App.vue                    # 根组件
├── main.js                    # 入口，注册 Vue Router / Element UI
├── assets/
│   └── images/                # 静态图片资源
├── components/
│   ├── PageLogin.vue          # 登录页
│   └── PageHome.vue           # 管理后台主页
└── router/
    └── router.js              # 路由配置
```

## License

MIT
