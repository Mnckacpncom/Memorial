import VueRouter from "vue-router";

const router = new VueRouter({
    routes: [
        {
            path: '/',
            component: () => import('@/components/PageLogin.vue')
        },
        {
            path: '/home',
            component: () => import('@/components/PageHome.vue')
        }
    ]
})

export default router