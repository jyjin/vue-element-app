import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import global from './global'
import axios from './utils/axios'
import { ElMessage, ElLoading } from 'element-plus';
import 'element-plus/dist/index.css'

console.log(process.env.NODE_ENV)

const app = createApp(App)
let prevConfig = localStorage.getItem('tenantConfig')
try {

  if (prevConfig) {
    prevConfig = JSON.parse([prevConfig])
  }
} catch (e) {
  console.error('Read prev config error == ', e)
}

app.config.globalProperties.$app = prevConfig ? prevConfig : global
app.config.globalProperties.$axios = axios
app.config.globalProperties.$msg = ElMessage
app.config.globalProperties.$loading = ElLoading
app.use(router)
  .mount('#app')
