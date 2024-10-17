// 导入vue2.0js文件
import Vue from 'vue'
// 导入vue2.0路由文件
import VueRouter from 'vue-router'
// 导入登录组件 不引用不会显示
import Login from '../components/Login.vue'
// 导入首页组件 不引用不会显示
import Home from '../components/Home.vue'
// 导入欢迎组件 不引用不会显示
import Welcome from '../components/Welcome'
// 导入用户组件 不引用不会显示
import Users from '../components/user/Users.vue'
// 导入权限组件 不引用不会显示
import Rights from '../components/power/Rights.vue'
// 导入角色组件 不引用不会显示
import Roles from '../components/power/Roles.vue'
// 导入商品分类组件 不引用不会显示
import Cate from '../components/goods/Cate.vue'
// 导入商品参数组件 不引用不会显示
import Params from '../components/goods/Params.vue'
// 导入商品列表组件 不引用不会显示
import Goods from '../components/goods/Goods.vue'
// 导入添加商品组件 不引用不会显示
import Add from '../components/goods/Add.vue'
// 导入订单组件 不引用不会显示
import Order from '../components/order/Order.vue'
// 导入数据报表组件 不引用不会显示
import Report from '../components/report/Report.vue'
// 导入编辑商品组件 不引用不会显示
import Edit from '../components/goods/Edit.vue'



// 注册vue2.0路由
Vue.use(VueRouter)
// 定义路由规则
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home', component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: Goods },
      { path: '/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report },
      { path: '/edit', component: Edit }
    ]
  }
]
// 实例化路由对象
const router = new VueRouter({
  routes
})

// 为路由添加beforeEach巡航守卫
router.beforeEach((to, from, next) => {
  // 2.判断token是否存在
  if (to.path === '/login')
    // 2.1如果存在 直接放行
    return next();
  const tokenStr = window.sessionStorage.getItem('token')
  //没有token 强制跳转到登录页面
  if (!tokenStr)
    return next('/login')
  next()
})

// 导出路由对象
export default router
