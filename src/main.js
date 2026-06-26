import Vue from 'vue'
import VueRouter from "vue-router";
import router from "@/router/router";
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.prototype.$http = axios;
axios.defaults.baseURL = '/api'

new Vue({
  render: h => h(App),
  router: router
}).$mount('#app')
