import Vue from 'vue'
import App from './App.vue'
// 导入路由
import router from './router'
// 导入全局样式表
import'./assets/css/global.css'
// 导入element-ui组件库
import ElementUI from 'element-ui';
// 导入element-ui组件库的样式
import 'element-ui/lib/theme-chalk/index.css';
// 导入axios
import axios from 'axios';
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 注册富文本编辑器
Vue.use(VueQuillEditor)

// 导入字体图标
// import './assets/fonts/iconfont.css'

// 使用element-ui组件库
Vue.use(ElementUI);

// 把插入导入到项目中
import TreeTable from 'vue-table-with-tree-grid'
// 注册组件
Vue.component('tree-table', TreeTable)


// 设置请求的根路径: api接口文档
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/';
// axios.defaults.baseURL = 'http://www.tangxiaoyang.vip:8888/api/v2/';

// 请求在达到服务器之前，先会调用use中的这个回调函数来添加请求头信息
axios.interceptors.request.use(config => {
  console.log(config)
  // request 是拦截器
  // config 是请求的配置对象
  // 为请求头对象，添加token验证Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})
// 挂载:把axios这个包挂载到Vue的原型对象上 这样Vue的每一个组件都可以通过 this.$http从而发起Ajax请求
// 在main.js中引入axios 然后挂载到Vue的原型对象上
Vue.prototype.$http=axios;

Vue.filter('dateFormat',function(originVal){
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth()+1+'').padStart(2,'0')
  const d = (dt.getDate()+'').padStart(2,'0')
  const hh = (dt.getHours()+'').padStart(2,'0')
  const mm = (dt.getMinutes()+'').padStart(2,'0')
  const ss = (dt.getSeconds()+'').padStart(2,'0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

// 1.在vue 项目 main.js文件中创建一个全局自定义指令。
 
Vue.directive('removeAriaHidden', {
  bind(el, binding) {
    let ariaEls = el.querySelectorAll('.el-radio__original');
    ariaEls.forEach((item) => {
      item.removeAttribute('aria-hidden');
    })
  }
})