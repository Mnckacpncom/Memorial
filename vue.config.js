const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        client: {
            webSocketURL: 'ws://localhost:8081/hmr-ws'   // ⬅️ 关键：改变 HMR 路径
        },
        proxy: {
            '/ws': {
                target: 'http://localhost:8080',
                ws: true,
                changeOrigin: true
            },
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true
            }
        }
    }
})