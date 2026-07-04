import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import i18n from './locales'

import App from './App.vue'
import router from './router'
import './assets/css/global.scss'

// Axios 基础配置
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true; // 允许跨域带 Cookie

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

async function init() {
  // 注册所有图标
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  // 先注册路由，确保路由可用
  app.use(router)
  app.use(i18n)

  // Element Plus 语言由 App.vue 的 el-config-provider 动态配置
  app.use(ElementPlus)

  // 挂载应用
  app.mount('#app')

  // 最后初始化认证，这样路由已经可用
  try {
    const userStore = useUserStore()
    await userStore.initAuth()
  } catch (error) {
    // 获取用户信息失败，说明未登录，路由已经注册，可以正常跳转
    console.log('未登录，路由已注册')
  }
}

init()

