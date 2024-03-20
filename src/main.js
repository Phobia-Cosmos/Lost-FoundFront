import Vue from 'vue'

import App from './App.vue'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/assets/css/global.css'
import '@/assets/css/theme/index.css'
import '@/assets/css/iconfont/iconfont.css'

import request from "@/utils/request";
// import "@/permission" // permission control

// TODO：这个请求方式是什么？如何使用？prototype?
Vue.prototype.$request = request
Vue.prototype.$baseUrl = process.env.VUE_APP_BASEURL

Vue.use(ElementUI, {size: "small"})

// TODO:这个是干什么的？
Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
