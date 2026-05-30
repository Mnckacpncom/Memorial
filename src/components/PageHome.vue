<script>
export default {
    name: "PageHome",
    data() {
        return {
            // 当前选中的菜单
            activeMenu: "dashboard",

            // ===== 概览统计 =====
            stats: {
                projectCount: 5,
                messageCount: 12,
                visitorCount: 256
            },

            // ===== 项目管理 =====
            projects: [
                { id: 1, name: "MyBlog", desc: "基于 Vue 的个人博客系统", tech: "Vue 2, Element UI, Express", link: "https://github.com/user/myblog", date: "2023-06", published: true },
                { id: 2, name: "Todo App", desc: "全栈待办事项应用，支持拖拽排序", tech: "React, Node.js, MongoDB", link: "https://github.com/user/todo-app", date: "2023-09", published: true },
                { id: 3, name: "Weather CLI", desc: "终端命令行天气预报工具", tech: "Python, OpenWeather API", link: "https://github.com/user/weather-cli", date: "2024-01", published: true },
                { id: 4, name: "ChatRoom", desc: "WebSocket 实时聊天室", tech: "Socket.io, Vanilla JS", link: "https://github.com/user/chatroom", date: "2024-03", published: false },
                { id: 5, name: "Memorial Site", desc: "第一个项目纪念网站", tech: "Vue 2, Element UI, Vue Router", link: "https://github.com/user/memorial", date: "2024-08", published: true },
            ],
            projectFormVisible: false,
            isEditingProject: false,
            projectForm: {
                id: null,
                name: "",
                desc: "",
                tech: "",
                link: "",
                date: "",
                published: true
            },
            projectRules: {
                name: { required: true, message: '请输入项目名称', trigger: 'blur' },
                date: { required: true, message: '请选择完成日期', trigger: 'blur' }
            },

            // ===== 留言管理 =====
            messages: [
                { id: 1, author: "小明", content: "博客写得不错，学到了很多！", date: "2024-09-01", status: "published" },
                { id: 2, author: "张三", content: "天气 CLI 工具很实用，能加个城市搜索吗？", date: "2024-08-30", status: "published" },
                { id: 3, author: "访客", content: "这个站点设计很简洁，喜欢。", date: "2024-09-03", status: "pending" },
            ],

            // ===== 系统设置 =====
            settings: {
                siteTitle: "我的第一个项目",
                siteDescription: "记录我独立完成的第一个项目",
                pageSize: 10,
                allowGuestMessages: true,
                messageReview: true
            }
        }
    },
    computed: {
        pendingMessageCount() {
            return this.messages.filter(m => m.status === "pending").length
        }
    },
    methods: {
        // ===== 退出登录 =====
        handleLogout() {
            this.$confirm('确认退出登录？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message.success('已退出登录')
                this.$router.push('/')
            }).catch(() => {})
        },

        // ===== 项目管理 =====
        handleAddProject() {
            this.isEditingProject = false
            this.projectForm = { id: null, name: "", desc: "", tech: "", link: "", date: "", published: true }
            this.projectFormVisible = true
        },
        handleEditProject(row) {
            this.isEditingProject = true
            this.projectForm = { ...row }
            this.projectFormVisible = true
        },
        handleSaveProject() {
            this.$refs.projectForm.validate((valid) => {
                if (!valid) return
                if (this.isEditingProject) {
                    const idx = this.projects.findIndex(p => p.id === this.projectForm.id)
                    if (idx !== -1) this.projects.splice(idx, 1, { ...this.projectForm })
                    this.$message.success('项目已更新')
                } else {
                    this.projectForm.id = Date.now()
                    this.projects.push({ ...this.projectForm })
                    this.$message.success('项目已添加')
                }
                this.projectFormVisible = false
            })
        },
        handleDeleteProject(row) {
            this.$confirm(`确认删除项目「${row.name}」？`, '警告', {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'error'
            }).then(() => {
                this.projects = this.projects.filter(p => p.id !== row.id)
                this.$message.success('已删除')
            }).catch(() => {})
        },

        // ===== 留言管理 =====
        handleApproveMessage(row) {
            row.status = "published"
            this.$message.success('留言已发布')
        },
        handleDeleteMessage(row) {
            this.$confirm('确认删除该留言？', '警告', {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'error'
            }).then(() => {
                this.messages = this.messages.filter(m => m.id !== row.id)
                this.$message.success('已删除')
            }).catch(() => {})
        },

        // ===== 系统设置 =====
        handleSaveSettings() {
            this.$message.success('设置已保存')
        }
    }
}
</script>

<template>
<el-container style="min-height: 100vh;">
    <!-- ===== 侧边栏 ===== -->
    <el-aside width="220px" class="app-aside">
        <div class="aside-header">
            <span class="aside-title">我的第一个项目</span>
        </div>
        <el-menu
            :default-active="activeMenu"
            background-color="#304156"
            text-color="#bfcbd9"
            active-text-color="#409eff"
            @select="(key) => activeMenu = key"
        >
            <el-menu-item index="dashboard">
                <i class="el-icon-s-data"></i>
                <span slot="title">首页概览</span>
            </el-menu-item>
            <el-menu-item index="projects">
                <i class="el-icon-collection-tag"></i>
                <span slot="title">项目管理</span>
            </el-menu-item>
            <el-menu-item index="messages">
                <i class="el-icon-chat-dot-round"></i>
                <span slot="title">
                    留言管理
                    <el-tag size="mini" type="danger" v-if="pendingMessageCount">{{ pendingMessageCount }}</el-tag>
                </span>
            </el-menu-item>
            <el-menu-item index="settings">
                <i class="el-icon-setting"></i>
                <span slot="title">系统设置</span>
            </el-menu-item>
        </el-menu>
    </el-aside>

    <!-- ===== 右侧主区域 ===== -->
    <el-container direction="vertical">
        <!-- 顶栏 -->
        <el-header class="app-header" height="60px">
            <span class="header-breadcrumb">
                {{ activeMenu === 'dashboard' ? '首页概览' : activeMenu === 'projects' ? '项目管理' : activeMenu === 'messages' ? '留言管理' : '系统设置' }}
            </span>
            <div class="header-right">
                <el-dropdown trigger="click" @command="handleLogout">
                    <span class="user-info">
                        <i class="el-icon-user"></i> 管理员
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </el-header>

        <!-- 内容区 -->
        <el-main class="app-main">

            <!-- ===== 首页概览 ===== -->
            <div v-if="activeMenu === 'dashboard'">
                <h2 class="page-title">首页概览</h2>
                <el-row :gutter="20">
                    <el-col :xs="24" :sm="8">
                        <el-card shadow="never" class="stats-card">
                            <div class="stats-value">{{ stats.projectCount }}</div>
                            <div class="stats-label">项目总数</div>
                        </el-card>
                    </el-col>
                    <el-col :xs="24" :sm="8">
                        <el-card shadow="never" class="stats-card">
                            <div class="stats-value">{{ stats.messageCount }}</div>
                            <div class="stats-label">留言总数</div>
                        </el-card>
                    </el-col>
                    <el-col :xs="24" :sm="8">
                        <el-card shadow="never" class="stats-card">
                            <div class="stats-value">{{ stats.visitorCount }}</div>
                            <div class="stats-label">访客数</div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>

            <!-- ===== 项目管理 ===== -->
            <div v-if="activeMenu === 'projects'">
                <div class="page-header">
                    <h2 class="page-title">项目管理</h2>
                    <el-button type="primary" icon="el-icon-plus" @click="handleAddProject">添加项目</el-button>
                </div>

                <el-table :data="projects" stripe style="width: 100%">
                    <el-table-column prop="id" label="ID" width="60"></el-table-column>
                    <el-table-column prop="name" label="项目名称" min-width="120"></el-table-column>
                    <el-table-column prop="desc" label="简介" min-width="200"></el-table-column>
                    <el-table-column prop="tech" label="技术栈" min-width="180"></el-table-column>
                    <el-table-column prop="date" label="完成时间" width="110"></el-table-column>
                    <el-table-column label="发布状态" width="100">
                        <template slot-scope="{ row }">
                            <el-tag :type="row.published ? 'success' : 'info'" size="mini">
                                {{ row.published ? '已发布' : '草稿' }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="160">
                        <template slot-scope="{ row }">
                            <el-button size="mini" type="primary" plain @click="handleEditProject(row)">编辑</el-button>
                            <el-button size="mini" type="danger" plain @click="handleDeleteProject(row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <!-- 项目表单对话框 -->
                <el-dialog
                    :title="isEditingProject ? '编辑项目' : '添加项目'"
                    :visible.sync="projectFormVisible"
                    width="550px"
                >
                    <el-form
                        ref="projectForm"
                        :model="projectForm"
                        :rules="projectRules"
                        label-width="100px"
                        size="small"
                    >
                        <el-form-item label="项目名称" prop="name">
                            <el-input v-model="projectForm.name" placeholder="请输入项目名称"></el-input>
                        </el-form-item>
                        <el-form-item label="项目简介" prop="desc">
                            <el-input
                                type="textarea"
                                v-model="projectForm.desc"
                                :rows="3"
                                placeholder="请简要描述项目"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="技术栈" prop="tech">
                            <el-input v-model="projectForm.tech" placeholder="如 Vue, Node.js, Python"></el-input>
                        </el-form-item>
                        <el-form-item label="项目链接" prop="link">
                            <el-input v-model="projectForm.link" placeholder="https://github.com/..."></el-input>
                        </el-form-item>
                        <el-form-item label="完成时间" prop="date">
                            <el-date-picker
                                v-model="projectForm.date"
                                type="month"
                                placeholder="选择月份"
                                value-format="yyyy-MM"
                                style="width: 100%"
                            ></el-date-picker>
                        </el-form-item>
                        <el-form-item label="发布状态">
                            <el-switch v-model="projectForm.published" active-text="发布" inactive-text="草稿"></el-switch>
                        </el-form-item>
                    </el-form>
                    <span slot="footer">
                        <el-button @click="projectFormVisible = false" size="small">取消</el-button>
                        <el-button type="primary" @click="handleSaveProject" size="small">保存</el-button>
                    </span>
                </el-dialog>
            </div>

            <!-- ===== 留言管理 ===== -->
            <div v-if="activeMenu === 'messages'">
                <h2 class="page-title">留言管理</h2>

                <el-table :data="messages" stripe style="width: 100%">
                    <el-table-column prop="author" label="留言者" width="120"></el-table-column>
                    <el-table-column prop="content" label="内容" min-width="240"></el-table-column>
                    <el-table-column prop="date" label="日期" width="120"></el-table-column>
                    <el-table-column label="状态" width="100">
                        <template slot-scope="{ row }">
                            <el-tag :type="row.status === 'published' ? 'success' : 'warning'" size="mini">
                                {{ row.status === 'published' ? '已发布' : '待审核' }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="160">
                        <template slot-scope="{ row }">
                            <el-button
                                size="mini"
                                type="success"
                                plain
                                v-if="row.status === 'pending'"
                                @click="handleApproveMessage(row)"
                            >审核通过</el-button>
                            <el-button size="mini" type="danger" plain @click="handleDeleteMessage(row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!-- ===== 系统设置 ===== -->
            <div v-if="activeMenu === 'settings'">
                <h2 class="page-title">系统设置</h2>
                <el-card shadow="never" class="settings-card">
                    <el-form :model="settings" label-width="150px" size="small">
                        <el-form-item label="站点标题">
                            <el-input v-model="settings.siteTitle"></el-input>
                        </el-form-item>
                        <el-form-item label="站点描述">
                            <el-input type="textarea" v-model="settings.siteDescription" :rows="3"></el-input>
                        </el-form-item>
                        <el-form-item label="每页显示数量">
                            <el-input-number v-model="settings.pageSize" :min="5" :max="50"></el-input-number>
                        </el-form-item>
                        <el-form-item label="允许访客留言">
                            <el-switch v-model="settings.allowGuestMessages"></el-switch>
                        </el-form-item>
                        <el-form-item label="留言需审核">
                            <el-switch v-model="settings.messageReview"></el-switch>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="handleSaveSettings">保存设置</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </div>

        </el-main>
    </el-container>
</el-container>
</template>

<style scoped>
/* ===== 侧边栏 ===== */
.app-aside {
    background-color: #304156;
    overflow: hidden;
}

.aside-header {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid rgba(255,255,255,0.1);
}

.aside-title {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    letter-spacing: 1px;
}

.el-menu {
    border-right: none;
}

/* ===== 顶栏 ===== */
.app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    border-bottom: 1px solid #e4e7ed;
    padding: 0 24px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.header-breadcrumb {
    font-size: 15px;
    color: #303133;
    font-weight: 500;
}

.user-info {
    cursor: pointer;
    color: #606266;
    font-size: 14px;
}

/* ===== 内容区 ===== */
.app-main {
    background: #f0f2f5;
    min-height: calc(100vh - 60px);
    padding: 20px;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.page-title {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 16px 0;
}

/* 概览卡片 */
.stats-card {
    text-align: center;
    margin-bottom: 16px;
}

.stats-value {
    font-size: 36px;
    font-weight: 700;
    color: #409eff;
}

.stats-label {
    font-size: 14px;
    color: #909399;
    margin-top: 6px;
}

/* 设置卡片 */
.settings-card {
    max-width: 600px;
}
</style>
