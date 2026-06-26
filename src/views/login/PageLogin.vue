<script>
import loginBg from '@/assets/images/login-bg.jpg'

export default {
    name: "PageLogin",
    data() {
        return {
            loginBg,
            // 字母
            letters: ['M', 'e', 'm', 'o', 'r', 'i', 'a', 'l'],
            activeLetter: -1,
            loading: false,
            form: {
                username: "admin",
                password: "admin",
            },
            rules: {
                username: { required: true, message: '请输入账号', trigger: 'blur' },
                password: { required: true, message: '请输入密码', trigger: 'blur' },
            },
            // 注册
            registerVisible: false,
            registerLoading: false,
            registerForm: {
                username: "",
                password: "",
                confirmPassword: ""
            },
            registerRules: {
                username: { required: true, message: '请输入账号', trigger: 'blur' },
                password: { required: true, message: '请输入密码', trigger: 'blur' },
                confirmPassword: {
                    required: true,
                    validator: (rule, value, callback) => {
                        if (value === '') {
                            callback(new Error('请确认密码'))
                        } else if (value !== this.registerForm.password) {
                            callback(new Error('两次密码不一致'))
                        } else {
                            callback()
                        }
                    },
                    trigger: 'blur'
                }
            }
        }
    },
    methods: {
        handleLogin() {
            this.$refs.loginForm.validate(async (valid) => {
                if (!valid) {
                    this.$message.error('请正确填写表单')
                    return
                }

                this.loading = true

                try {
                    // TODO: 替换为真实登录接口
                    await this.loginApi(this.form.username, this.form.password)

                    this.$message.success('登录成功')
                    this.$router.push('/home')
                } catch (e) {
                    this.$message.error(e.message || '登录失败，请检查账号密码')
                } finally {
                    this.loading = false
                }
            })
        },

        /**
         * 模拟登录接口 — 后续替换为真实 API 调用
         */
        loginApi(username, password) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (username === 'admin' && password === 'admin') {
                        resolve({ token: 'mock-token-' + Date.now() })
                    } else {
                        reject(new Error('账号或密码错误'))
                    }
                }, 800)
            })
        },

        handleOpenRegister() {
            this.registerForm = { username: "", password: "", confirmPassword: "" }
            this.registerVisible = true
        },
        handleRegister() {
            this.$refs.registerForm.validate(async (valid) => {
                if (!valid) return
                this.registerLoading = true
                // TODO: 调用注册接口
                await new Promise(resolve => setTimeout(resolve, 600))
                this.$message.success('注册成功，请登录')
                this.registerVisible = false
                this.registerLoading = false
                this.form.username = this.registerForm.username
                this.form.password = ''
            })
        }
    }
}
</script>

<template>
    <el-row type="flex" justify="center" align="middle" class="login-row" :style="{ backgroundImage: 'url(' + loginBg + ')', backgroundSize: 'cover', backgroundPosition: 'center' }">
        <el-col :xs="20" :sm="10" :md="7" :lg="5" :xl="5">
            <el-card class="box-card" shadow="always">
                <template v-slot:header>
                    <div class="login-header">
                        <div class="login-wordmark" @mouseleave="activeLetter = -1">
                            <span
                                v-for="(ch, i) in letters"
                                :key="i"
                                class="wm-letter"
                                :class="(i === 0 || activeLetter === i) ? 'wm-glow' : ''"
                                @mouseenter="activeLetter = i"
                            >{{ ch }}</span>
                            <div class="wm-bar"></div>
                        </div>
                    </div>
                </template>

                <el-form
                    ref="loginForm"
                    :model="form"
                    :rules="rules"
                    status-icon
                    label-width="0"
                    @submit.native.prevent="handleLogin"
                >
                    <el-form-item prop="username">
                        <el-input
                            v-model="form.username"
                            prefix-icon="el-icon-user"
                            placeholder="请输入账号"
                            :disabled="loading"
                            clearable
                        ></el-input>
                    </el-form-item>

                    <el-form-item prop="password">
                        <el-input
                            v-model="form.password"
                            type="password"
                            prefix-icon="el-icon-lock"
                            placeholder="请输入密码"
                            :disabled="loading"
                            clearable
                            show-password
                        ></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button
                            type="primary"
                            native-type="submit"
                            :loading="loading"
                            style="width:100%"
                        >
                            {{ loading ? '出发咯…' : 'GoGoGo' }}
                        </el-button>
                    </el-form-item>

                    <el-form-item>
                        <el-button
                            type="primary"
                            style="width:100%"
                            :disabled="loading"
                            @click="handleOpenRegister"
                        >
                            注册
                        </el-button>
                    </el-form-item>
                </el-form>

                <!-- 注册弹窗 -->
                <el-dialog
                    title="注册账号"
                    :visible.sync="registerVisible"
                    width="400px"
                    :close-on-click-modal="false"
                    append-to-body
                >
                    <el-form
                        ref="registerForm"
                        :model="registerForm"
                        :rules="registerRules"
                        label-width="80px"
                        size="small"
                        @submit.native.prevent="handleRegister"
                    >
                        <el-form-item label="账号" prop="username">
                            <el-input v-model="registerForm.username" placeholder="请输入账号"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input
                                v-model="registerForm.password"
                                type="password"
                                placeholder="请输入密码"
                                show-password
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="confirmPassword">
                            <el-input
                                v-model="registerForm.confirmPassword"
                                type="password"
                                placeholder="请再次输入密码"
                                show-password
                            ></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer">
                        <el-button @click="registerVisible = false" size="small">取消</el-button>
                        <el-button
                            type="primary"
                            :loading="registerLoading"
                            size="small"
                            @click="handleRegister"
                        >注册</el-button>
                    </span>
                </el-dialog>
            </el-card>
        </el-col>
    </el-row>
</template>

<style scoped>
.login-row {
    height: 100vh;
    position: relative;
    overflow: hidden;
}

/* 暗色遮罩 */
.login-row::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
}

.box-card {
    width: 100%;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(20px);
}

.box-card >>> .el-card__header {
    border-bottom: 1px solid rgba(255,255,255,0.08);
    padding: 28px 40px 20px;
}

.box-card >>> .el-card__body {
    padding: 44px 36px 48px;
}

.box-card >>> .el-form-item {
    margin-bottom: 32px;
}

/* 登录头 */
.login-header {
    text-align: center;
    padding: 4px 0;
}

.login-wordmark {
    text-align: center;
    line-height: 1;
}

.wm-letter {
    display: inline-block;
    font-size: 28px;
    font-weight: 300;
    letter-spacing: 4px;
    margin: 0 2px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.55);
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    cursor: default;
}

.wm-letter:hover {
    transform: translateY(-6px);
    filter: drop-shadow(0 4px 24px rgba(167,139,250,0.7));
}

.wm-glow {
    font-size: 52px !important;
    font-weight: 900 !important;
    letter-spacing: 0 !important;
    color: transparent !important;
    background: linear-gradient(180deg, #fff 20%, #c4b5fd 50%, #a78bfa 80%) !important;
    -webkit-background-clip: text !important;
    background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    filter: drop-shadow(0 0 18px rgba(167,139,250,0.5)) !important;
    transform: translateY(-6px) !important;
}

.wm-bar {
    width: 80px;
    height: 4px;
    margin: 10px auto 0;
    border-radius: 2px;
    background: linear-gradient(90deg, #a78bfa, #f0abfc, #67e8f9);
    animation: barPulse 2s ease-in-out infinite alternate;
}

@keyframes barPulse {
    0% { width: 80px; opacity: 0.6; }
    100% { width: 130px; opacity: 1; }
}



/* 深色输入框 */
.box-card >>> .el-input__inner {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.15);
    color: #fff;
    border-radius: 8px;
}

.box-card >>> .el-input__inner::placeholder {
    color: rgba(255,255,255,0.35);
}

.box-card >>> .el-input__inner:focus {
    border-color: rgba(255,255,255,0.4);
    background: rgba(255,255,255,0.12);
}

.box-card >>> .el-input__prefix {
    color: rgba(255,255,255,0.4);
}

/* 登录按钮 */
.box-card >>> .el-button--primary {
    border-radius: 8px;
    height: 42px;
    font-size: 15px;
    letter-spacing: 4px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;
}

.box-card >>> .el-button--primary::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: shimmer 2.5s ease-in-out infinite;
    pointer-events: none;
}

.box-card >>> .el-button--primary:hover {
    background: linear-gradient(135deg, #7b93f5 0%, #8b5fbf 100%);
    box-shadow: 0 4px 20px rgba(102,126,234,0.5);
    transform: translateY(-1px);
}

.box-card >>> .el-button--primary:active {
    transform: translateY(0);
}

@keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
}

/* 弹窗按钮 */
.box-card >>> .el-dialog__footer .el-button--primary {
    border-radius: 6px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
}

.box-card >>> .el-dialog__footer .el-button--primary:hover {
    background: linear-gradient(135deg, #7b93f5 0%, #8b5fbf 100%);
}

.box-card >>> .el-dialog__footer .el-button {
    border-radius: 6px;
}

.box-card >>> .el-dialog__footer .el-button--default {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.6);
}

.box-card >>> .el-dialog__footer .el-button--default:hover {
    background: rgba(255,255,255,0.12);
    color: #fff;
}

/* 弹窗适配深色主题 */
.box-card >>> .el-dialog {
    border-radius: 12px;
    background: rgba(30, 30, 50, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.1);
}

.box-card >>> .el-dialog__title {
    color: #fff;
}

.box-card >>> .el-dialog__header {
    border-bottom: 1px solid rgba(255,255,255,0.08);
}

.box-card >>> .el-dialog__body .el-input__inner {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.15);
    color: #fff;
    border-radius: 8px;
}

.box-card >>> .el-dialog__body .el-input__inner::placeholder {
    color: rgba(255,255,255,0.35);
}

.box-card >>> .el-dialog__body .el-input__inner:focus {
    border-color: rgba(255,255,255,0.4);
    background: rgba(255,255,255,0.12);
}

.box-card >>> .el-dialog__body .el-form-item__label {
    color: rgba(255,255,255,0.75);
}

/* 按钮间距 */
.el-form-item:last-child {
    margin-bottom: 0;
}
/* 非 scoped：禁止页面滚动 */
</style>

/* 非 scoped：背景图 + 禁止页面滚动 */
<style>
.login-row {
    height: 100vh;
    position: relative;
    overflow: hidden;
}

html, body {
    overflow: hidden;
    margin: 0;
    padding: 0;
}
</style>
