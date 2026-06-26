import VueRouter from "vue-router";

const router = new VueRouter({
    routes: [
        {
            path: '/',
            component: () => import('@/views/login/PageLogin.vue')
        },
        {
            path: '/home',
            component: () => import('@/views/home/PageHome.vue')
        }
    ]
})

export default router