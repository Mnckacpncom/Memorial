<script>
import config from '../../../public/config/setting.json'

export default {
    name: "PageHome",
    data() {
        return {
            config: config,
            activeMenu: "dashboard",

            stats: {projectCount: 0, messageCount: 0, visitorCount: 0},
            projects: [],
            projectFormVisible: false,
            isEditingProject: false,
            projectForm: {
                id: null,
                company: '',
                personnelName: '',
                personnelType: '',
                workMode: '',
                bankLiaison: '',
                accessCardNumber: '',
                accessCardStatus: '',
                employeeBadgeNumber: '',
                employeeBadgeStatus: '',
                entryRegistrationTime: '',
                exitRegistrationTime: '',
                remarks: '',
            },
            projectRules: {
                name: {required: true, message: '请输入项目名称', trigger: 'blur'},
                date: {required: true, message: '请选择完成日期', trigger: 'blur'}
            },
            messages: [],
            settings: {
                siteTitle: "",
                siteDescription: "",
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
        // ===== 初始化加载数据 =====
        async fetchStats() {
            // const res = await this.$http.get('/stats')
            // this.stats = res.data
        },
        async fetchProjects() {
            const res = await this.$http.get('/registrationForm')
            this.projects = res.data
        },
        async fetchMessages() {
            // const res = await this.$http.get('/messages')
            // this.messages = res.data
        },
        async fetchSettings() {
            // const res = await this.$http.get('/settings')
            // this.settings = res.data
        },

        // ===== 项目管理 =====
        handleAddProject() {
            this.isEditingProject = false
            this.projectForm = {id: null, name: "", desc: "", tech: "", link: "", date: "", published: true}
            this.projectFormVisible = true
        },
        handleEditProject(row) {
            this.isEditingProject = true
            this.projectForm = {...row}
            this.projectFormVisible = true
        },
        async handleSaveProject() {
            this.$refs.projectForm.validate(async (valid) => {
                if (!valid) return
                try {
                    if (this.isEditingProject) {
                        // 更新后端数据
                        const res = await this.$http.put(`/projects/${this.projectForm.id}`, this.projectForm)
                        const idx = this.projects.findIndex(p => p.id === this.projectForm.id)
                        this.projects.splice(idx, 1, res.data)
                        this.$message.success('项目已更新')
                    } else {
                        // 新增
                        const res = await this.$http.post('/projects', this.projectForm)
                        this.projects.push(res.data)
                        this.$message.success('项目已添加')
                    }
                    this.projectFormVisible = false
                } catch (e) {
                    this.$message.error('保存失败')
                }
            })
        },
        async handleDeleteProject(row) {
            this.$confirm(`确认删除项目「${row.name}」？`, '警告', {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'error'
            }).then(async () => {
                await this.$http.delete(`/projects/${row.id}`)
                this.projects = this.projects.filter(p => p.id !== row.id)
                this.$message.success('已删除')
            }).catch(() => {
            })
        },

        // ===== 留言管理 =====
        async handleApproveMessage(row) {
            const res = await this.$http.put(`/messages/${row.id}/approve`)
            row.status = res.data.status
            this.$message.success('留言已发布')
        },
        async handleDeleteMessage(row) {
            this.$confirm('确认删除该留言？', '警告', {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'error'
            }).then(async () => {
                await this.$http.delete(`/messages/${row.id}`)
                this.messages = this.messages.filter(m => m.id !== row.id)
                this.$message.success('已删除')
            }).catch(() => {
            })
        },

        // ===== 系统设置 =====
        async handleSaveSettings() {
            await this.$http.put('/settings', this.settings)
            this.$message.success('设置已保存')
        },

        // ===== 退出登录 =====
        handleLogout() {
            this.$confirm('确认退出登录？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message.success('已退出登录')
                this.$router.push('/')
            }).catch(() => {
            })
        }
    },
    async created() {
        // 页面加载时获取所有数据
        await this.fetchStats()
        await this.fetchProjects()
        await this.fetchMessages()
        await this.fetchSettings()
    }
}
</script>

<template>
    <el-container style="min-height: 100vh;">
        <!-- ===== 侧边栏 ===== -->
        <el-aside width="220px" class="app-aside">
            <div class="aside-header">
                <span class="aside-title">{{ config.aside.title }}</span>
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
                    <span slot="title">{{ config.aside.item.overview }}</span>
                </el-menu-item>
                <el-menu-item index="projects">
                    <i class="el-icon-collection-tag"></i>
                    <span slot="title">{{ config.aside.item.access }}</span>
                </el-menu-item>
                <el-menu-item index="messages">
                    <i class="el-icon-chat-dot-round"></i>
                    <span slot="title">
                    {{ config.aside.item.entry }}
                    <el-tag size="mini" type="danger" v-if="pendingMessageCount">{{ pendingMessageCount }}</el-tag>
                </span>
                </el-menu-item>
                <el-menu-item index="settings">
                    <i class="el-icon-setting"></i>
                    <span slot="title">{{ config.aside.item.settings }}</span>
                </el-menu-item>
            </el-menu>
        </el-aside>

        <!-- ===== 右侧主区域 ===== -->
        <el-container direction="vertical">
            <!-- 顶栏 -->
            <el-header class="app-header" height="60px">
            <span class="header-breadcrumb">
                {{
                    activeMenu === 'dashboard' ? '首页概览' : activeMenu === 'projects' ? '项目管理' : activeMenu === 'messages' ? '留言管理' : '系统设置'
                }}
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

                <!-- ===== 人员管理 ===== -->
                <div v-if="activeMenu === 'personnelManagement'">
                    <div class="page-header">
                        <h2 class="page-title">{{ config.main.header.title }}</h2>
                        <el-button type="primary" icon="el-icon-plus" @click="handleAddProject">{{ config.main.header.addPerson }}</el-button>
                    </div>
                    <el-table :data="projects" stripe style="width: 100%">
                        <el-table-column prop="id" :label="config.main.form.id" width="60"></el-table-column>
                        <el-table-column prop="company" :label="config.main.form.company" width="250"></el-table-column>
                        <el-table-column prop="personnelName" :label="config.main.form.personnelName"></el-table-column>
                        <el-table-column prop="personnelType" :label="config.main.form.personnelType.title">
                            <template v-slot="{ row }">
                                <el-tag :type="config.main.form.personnelType[row.personnelType].color">
                                    {{ config.main.form.personnelType[row.personnelType].label }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="workMode" :label="config.main.form.workMode.title">
                            <template v-slot="{ row }">
                                <el-tag :type="config.main.form.workMode[row.workMode].color">
                                    {{ config.main.form.workMode[row.workMode].label }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="bankLiaison" :label="config.main.form.bankLiaison"></el-table-column>
                        <el-table-column prop="accessCardNumber" :label="config.main.form.accessCardNumber"></el-table-column>
                        <el-table-column prop="accessCardStatus" :label="config.main.form.accessCardStatus"></el-table-column>
                        <el-table-column prop="employeeBadgeNumber" :label="config.main.form.employeeBadgeNumber"></el-table-column>
                        <el-table-column prop="employeeBadgeStatus" :label="config.main.form.employeeBadgeStatus"></el-table-column>
                        <el-table-column prop="entryRegistrationTime" :label="config.main.form.entryRegistrationTime"></el-table-column>
                        <el-table-column prop="exitRegistrationTime" :label="config.main.form.exitRegistrationTime"></el-table-column>
                        <el-table-column prop="remarks" :label="config.main.form.remarks"></el-table-column>
                        <el-table-column :label="config.main.form.operate.title" width="160">
                            <template v-slot="{ row }">
                                <el-button size="mini" type="primary" plain @click="handleEditProject(row)">{{ config.main.form.operate.edit }}</el-button>
                                <el-button size="mini" type="danger" plain @click="handleDeleteProject(row)">{{ config.main.form.operate.delete }}</el-button>
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

                <!-- ===== IP地址管理 ===== -->
                <div v-if="activeMenu === 'ipAddressManagement'">
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
                                >审核通过
                                </el-button>
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
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
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
